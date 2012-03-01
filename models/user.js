// user.js
// User model logic.

// TODO wire this up to the database; XXX for now, mock data:
var USERS = [];
var FOLLOWS = {};   // 2D adjacency matrix, [user1id][user2id] = true or false

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

User.prototype.follow = function (other, callback) {
    // TODO save to db; XXX using mock data for now:
    var user = this;
    process.nextTick(function () {
        if (!FOLLOWS[user.id]) {
            FOLLOWS[user.id] = {};
        }
        FOLLOWS[user.id][other.id] = true;
        callback(null);
    });
};

// calls callback w/ (err, following, others) where following is an array of
// users this user follows, and others is all other users minus him/herself.
User.prototype.getFollowingAndOthers = function (callback) {
    // TODO fetch from db; XXX using mock data for now:
    var user = this;
    process.nextTick(function () {
        var following = [];
        var others = [];
        for (var i = 0; i < USERS.length; i++) {
            var other = USERS[i];
            if (user.id === other.id) {
                continue;
            } else if (FOLLOWS[user.id] && FOLLOWS[user.id][other.id]) {
                following.push(other);
            } else {
                others.push(other);
            }
        }
        callback(null, following, others);
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
