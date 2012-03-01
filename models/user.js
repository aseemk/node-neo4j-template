// user.js
// User model logic.

// TODO wire this up to the database; XXX for now, mock data:
var USERS = [];     // an array for push() convenience, but really an id map
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
        (callback || noop)(null);
    });
};

User.prototype.del = function (callback) {
    // TODO delete from db; XXX using mock data for now:
    var user = this;
    process.nextTick(function () {
        delete USERS[user.id];
        (callback || noop)(null);
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
        (callback || noop)(null);
    });
};

User.prototype.unfollow = function (other, callback) {
    // TODO remove from db; XXX using mock data for now:
    var user = this;
    process.nextTick(function () {
        if (FOLLOWS[user.id] && FOLLOWS[user.id][other.id]) {
            delete FOLLOWS[user.id][other.id];
        }
        (callback || noop)(null);
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
        for (var id in USERS) {
            var other = USERS[id];
            if (user.id === other.id) {
                continue;
            } else if (FOLLOWS[user.id] && FOLLOWS[user.id][other.id]) {
                following.push(other);
            } else {
                others.push(other);
            }
        }
        (callback || noop)(null, following, others);
    });
};

// static methods:

User.get = function (id, callback) {
    // TODO fetch from db; XXX using mock data for now:
    process.nextTick(function () {
        (callback || noop)(null, USERS[id]);
    });
};

User.getAll = function (callback) {
    // TODO fetch from db; XXX using mock data for now:
    process.nextTick(function () {
        // clone USERS array, removing nulls/undefineds (deleted users):
        var users = USERS.filter(function (user) {
            return !!user;
        });
        (callback || noop)(null, users);
    });
};

User.create = function (data, callback) {
    // TODO save to db; XXX using mock data for now:
    process.nextTick(function () {
        var user = new User(data);
        user.id = USERS.length;
        USERS.push(user);
        (callback || noop)(null, user);
    });
};

// misc helpers:

function noop() {}

// XXX more mock data:
User.create({name: 'Aseem Kishore'});
User.create({name: 'Daniel Gasienica'});
User.create({name: 'Jules Walter'});
User.create({name: 'Gary Flake'});
User.create({name: 'Zombie User'});
process.nextTick(function () {
    USERS[0].follow(USERS[1]);  // Aseem follows Daniel
    USERS[0].follow(USERS[2]);  // Aseem follows Jules
    USERS[0].follow(USERS[3]);  // Aseem follows Gary
    USERS[1].follow(USERS[0]);  // Daniel follows Aseem
    USERS[1].follow(USERS[3]);  // Daniel follows Gary
    USERS[2].follow(USERS[0]);  // Jules follows Aseem
});
