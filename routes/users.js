// users.js
// Routes to CRUD users.

var User = require('../models/user');

/**
 * GET /users
 */
exports.list = function (req, res, next) {
    User.getAll(function (err, users) {
        if (err) return next(err);
        res.render('users', {
            users: users
        });
    });
};

/**
 * POST /users
 */
exports.create = function (req, res, next) {
    User.create({
        username: req.body['username']
    }, function (err, user) {
        if (err) return next(err);
        res.redirect('/users/' + user.username);
    });
};

/**
 * GET /users/:username
 */
exports.show = function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        if (err) return next(err);
        // TODO: Also fetch and show followers? (Not just follow*ing*.)
        user.getFollowingAndOthers(function (err, following, others) {
            if (err) return next(err);
            res.render('user', {
                user: user,
                following: following,
                others: others
            });
        });
    });
};

/**
 * POST /users/:username
 */
exports.edit = function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        if (err) return next(err);
        user.patch(req.body, function (err) {
            if (err) return next(err);
            res.redirect('/users/' + user.username);
        });
    });
};

/**
 * DELETE /users/:username
 */
exports.del = function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        if (err) return next(err);
        user.del(function (err) {
            if (err) return next(err);
            res.redirect('/users');
        });
    });
};

/**
 * POST /users/:username/follow
 */
exports.follow = function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        if (err) return next(err);
        User.get(req.body.otherUsername, function (err, other) {
            if (err) return next(err);
            user.follow(other, function (err) {
                if (err) return next(err);
                res.redirect('/users/' + user.username);
            });
        });
    });
};

/**
 * POST /users/:username/unfollow
 */
exports.unfollow = function (req, res, next) {
    User.get(req.params.username, function (err, user) {
        if (err) return next(err);
        User.get(req.body.otherUsername, function (err, other) {
            if (err) return next(err);
            user.unfollow(other, function (err) {
                if (err) return next(err);
                res.redirect('/users/' + user.username);
            });
        });
    });
};
