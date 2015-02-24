// user.js
// User model logic.

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(
    process.env['NEO4J_URL'] ||
    process.env['GRAPHENEDB_URL'] ||
    'http://localhost:7474'
);

// private constructor:

var User = module.exports = function User(_node) {
    // all we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
}

// public instance properties:

// TODO using native Neo4j IDs is now discouraged; switch to an indexed+unique
// property instead, e.g. `email` or `username` or etc.
Object.defineProperty(User.prototype, 'id', {
    get: function () { return this._node._id; }
});

Object.defineProperty(User.prototype, 'name', {
    get: function () {
        return this._node.properties['name'];
    },
    set: function (name) {
        this._node.properties['name'] = name;
    }
});

// public instance methods:

// TODO: node-neo4j v2 is no longer has a `save` method, because updates should
// be atomic and precise via Cypher, so consider a `patch` method instead.
User.prototype.save = function (callback) {
    var query = [
        'MATCH (user:User)',
        'WHERE ID(user) = {id}',
        'SET user = {props}',
    ].join('\n')

    var params = {
        id: this.id,
        props: this._node.properties,
    };

    db.cypher({
        query: query,
        params: params,
    }, function (err) {
        callback(err);
    });
};

User.prototype.del = function (callback) {
    // use a Cypher query to delete both this user and his/her following
    // relationships in one query and one network request:
    // (note that this'll still fail if there are any relationships attached
    // of any other types, which is good because we don't expect any.)
    var query = [
        'MATCH (user:User)',
        'WHERE ID(user) = {userId}',
        'DELETE user',
        'WITH user',
        'MATCH (user) -[rel:follows]- (other)',
        'DELETE rel',
    ].join('\n')

    var params = {
        userId: this.id
    };

    db.cypher({
        query: query,
        params: params,
    }, function (err) {
        callback(err);
    });
};

User.prototype.follow = function (other, callback) {
    var query = [
        'MATCH (user:User) ,(other:User)',
        'WHERE ID(user) = {userId} AND ID(other) = {otherId}',
        'MERGE (user) -[rel:follows]-> (other)',
    ].join('\n')

    var params = {
        userId: this.id,
        otherId: other.id,
    };

    db.cypher({
        query: query,
        params: params,
    }, function (err) {
        callback(err);
    });
};

User.prototype.unfollow = function (other, callback) {
    var query = [
        'MATCH (user:User) -[rel:follows]-> (other:User)',
        'WHERE ID(user) = {userId} AND ID(other) = {otherId}',
        'DELETE rel',
    ].join('\n')

    var params = {
        userId: this.id,
        otherId: other.id,
    };

    db.cypher({
        query: query,
        params: params,
    }, function (err) {
        callback(err);
    });
};

// calls callback w/ (err, following, others) where following is an array of
// users this user follows, and others is all other users minus him/herself.
User.prototype.getFollowingAndOthers = function (callback) {
    // query all users and whether we follow each one or not:
    var query = [
        'MATCH (user:User), (other:User)',
        'OPTIONAL MATCH (user) -[rel:follows]-> (other)',
        'WHERE ID(user) = {userId}',
        'RETURN other, COUNT(rel)', // COUNT(rel) is a hack for 1 or 0
    ].join('\n')

    var params = {
        userId: this.id,
    };

    var user = this;
    db.cypher({
        query: query,
        params: params,
    }, function (err, results) {
        if (err) return callback(err);

        var following = [];
        var others = [];

        for (var i = 0; i < results.length; i++) {
            var other = new User(results[i]['other']);
            var follows = results[i]['COUNT(rel)'];

            if (user.id === other.id) {
                continue;
            } else if (follows) {
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
    var query = [
        'MATCH (user:User)',
        'WHERE ID(user) = {id}',
        'RETURN user',
    ].join('\n')

    var params = {
        id: parseInt(id, 10),
    };

    db.cypher({
        query: query,
        params: params,
    }, function (err, results) {
        if (err) return callback(err);
        if (!results.length) {
            err = new Error('No such user with ID: ' + id);
            return callback(err);
        }
        var user = new User(results[0]['user']);
        callback(null, user);
    });
};

User.getAll = function (callback) {
    var query = [
        'MATCH (user:User)',
        'RETURN user',
    ].join('\n');

    db.cypher({
        query: query,
    }, function (err, results) {
        if (err) return callback(err);
        var users = results.map(function (result) {
            return new User(result['user']);
        });
        callback(null, users);
    });
};

// creates the user and persists (saves) it to the db, incl. indexing it:
User.create = function (props, callback) {
    // select and translate the given public-facing properties into the
    // database-internal properties we persist.
    // today, the only property we have is `name`, and it's the same.
    var props = {
        name: props.name,
    };

    var query = [
        'CREATE (user:User {props})',
        'RETURN user',
    ].join('\n');

    var params = {
        props: props
    };

    db.cypher({
        query: query,
        params: params,
    }, function (err, results) {
        if (err) return callback(err);
        var user = new User(results[0]['user']);
        callback(null, user);
    });
};
