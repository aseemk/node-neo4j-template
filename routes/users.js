// users.js
// Routes to CRUD users.

// GET /users
exports.list = function (req, res, next) {
    // TODO fetch users from db
    res.render('users');
};

// POST /users
exports.create = function (req, res, next) {
    // TODO create new user in db; redirect to their ID
    res.redirect('/users/0');
};

// GET /users/:id
exports.show = function (req, res, next) {
    // TODO fetch user from db
    res.render('user');
};

// POST /users/:id
exports.edit = function (req, res, next) {
    // TODO fetch and update user in db; redirect to their ID
    res.redirect('/users/0');
};

// DELETE /users/:id
exports.del = function (req, res, next) {
    // TODO fetch and delete user from db
    res.redirect('/users');
};
