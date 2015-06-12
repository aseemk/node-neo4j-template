// users.js
// Routes to CRUD users.

var URL = require('url');

var errors = require('../models/errors');
var User = require('../models/user');

function getUserURL(user) {
    return '/users/' + encodeURIComponent(user.username);
}

/**
 * GET /users
 */
exports.list = function (req, res, next) {
    User.getAll(function (err, users) {
        if (err) return next(err);
        res.render('users', {
            User: User,
            users: users,
            username: req.query.username,   // Support pre-filling create form
            error: req.query.error,     // Errors creating; see create route
        });
    });
};

/**
 * POST /users {username, ...}
 */
exports.create = function (req, res, next) {
    User.create({
        username: req.body.username
    }, function (err, user) {
        if (err) {
            if (err instanceof errors.ValidationError) {
                // Return to the create form and show the error message.
                // TODO: Assuming username is the issue; hardcoding for that
                // being the only input right now.
                // TODO: It'd be better to use a cookie to "remember" this info,
                // e.g. using a flash session.
                return res.redirect(URL.format({
                    pathname: '/users',
                    query: {
                        username: req.body.username,
                        error: err.message,
                    },
                }));
            } else {
                return next(err);
            }
        }
        res.redirect(getUserURL(user));
    });
};

/**
 * GET /users/:username
 */
exports.show = function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        // TODO: Gracefully "no such user" error. E.g. 404 page.
        if (err) return next(err);
        // TODO: Also fetch and show followers? (Not just follow*ing*.)
        user.getFollowingAndOthers(function (err, following, others) {
            if (err) return next(err);
            res.render('user', {
                User: User,
                user: user,
                following: following,
                others: others,
                username: req.query.username,   // Support pre-filling edit form
                error: req.query.error,     // Errors editing; see edit route
            });
        });
    });
};

/**
 * POST /users/:username {username, ...}
 */
exports.edit = function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        // TODO: Gracefully "no such user" error. E.g. 404 page.
        if (err) return next(err);
        user.patch(req.body, function (err) {
            if (err) {
                if (err instanceof errors.ValidationError) {
                    // Return to the edit form and show the error message.
                    // TODO: Assuming username is the issue; hardcoding for that
                    // being the only input right now.
                    // TODO: It'd be better to use a cookie to "remember" this
                    // info, e.g. using a flash session.
                    return res.redirect(URL.format({
                        pathname: getUserURL(user),
                        query: {
                            username: req.body.username,
                            error: err.message,
                        },
                    }));
                } else {
                    return next(err);
                }
            }
            res.redirect(getUserURL(user));
        });
    });
};

/**
 * DELETE /users/:username
 */
exports.del = function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        // TODO: Gracefully handle "no such user" error somehow.
        // E.g. redirect back to /users with an info message?
        if (err) return next(err);
        user.del(function (err) {
            if (err) return next(err);
            res.redirect('/users');
        });
    });
};

/**
 * POST /users/:username/follow {otherUsername}
 */
exports.follow = function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        // TODO: Gracefully handle "no such user" error somehow.
        // This is the source user, so e.g. 404 page?
        if (err) return next(err);
        User.get(req.body.otherUsername, function (err, other) {
            // TODO: Gracefully handle "no such user" error somehow.
            // This is the target user, so redirect back to the source user w/
            // an info message?
            if (err) return next(err);
            user.follow(other, function (err) {
                if (err) return next(err);
                res.redirect(getUserURL(user));
            });
        });
    });
};

/**
 * POST /users/:username/unfollow {otherUsername}
 */
exports.unfollow = function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        // TODO: Gracefully handle "no such user" error somehow.
        // This is the source user, so e.g. 404 page?
        if (err) return next(err);
        User.get(req.body.otherUsername, function (err, other) {
            // TODO: Gracefully handle "no such user" error somehow.
            // This is the target user, so redirect back to the source user w/
            // an info message?
            if (err) return next(err);
            user.unfollow(other, function (err) {
                if (err) return next(err);
                res.redirect(getUserURL(user));
            });
        });
    });
};
