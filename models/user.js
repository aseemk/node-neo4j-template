// user.js
// User model logic.

// TODO wire this up to the database; XXX for now, mock data:
var USERS = [];

// constructor:

var User = module.exports = function User(data) {
    this.name = data.name;
    this.id = null;     // only set when a user is saved to the db
}

// instance methods:

User.prototype.save = function (callback) {
    // TODO save to db; XXX nothing to do for now:
    process.nextTick(function () {
        callback(null);
    });
};

User.prototype.del = function (callback) {
    // TODO delete from db; XXX using mock data for now:
    var user = this;
    process.nextTick(function () {
        USERS[user.id] = null;
        callback(null);
    });
};

// static methods:

User.get = function (id, callback) {
    // TODO fetch from db; XXX using mock data for now:
    process.nextTick(function () {
        callback(null, USERS[id]);
    });
};

User.getAll = function (callback) {
    // TODO fetch from db; XXX using mock data for now:
    process.nextTick(function () {
        callback(null, USERS);
    });
};

User.create = function (data, callback) {
    // TODO save to db; XXX using mock data for now:
    process.nextTick(function () {
        var user = new User(data);
        user.id = USERS.length;
        USERS.push(user);
        callback(null, user);
    });
};
