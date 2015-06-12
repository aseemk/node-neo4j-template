// user.js
// User model logic.

var neo4j = require('neo4j');

var db = new neo4j.GraphDatabase({
    // Support specifying database info via environment variables,
    // but assume Neo4j installation defaults.
    url: process.env['NEO4J_URL'] || process.env['GRAPHENEDB_URL'] ||
        'http://neo4j:neo4j@localhost:7474',
    auth: process.env['NEO4J_AUTH'],
});

// Private constructor:

var User = module.exports = function User(_node) {
    // All we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
}

// Public instance properties:

// The user's username, e.g. 'aseemk'.
Object.defineProperty(User.prototype, 'username', {
    get: function () { return this._node.properties['username']; }
});

// Private helpers:

// Takes the given caller-provided properties (which corresponding to our public
// instance properties), selects only whitelisted ones for editing, validates
// them, and translates them to the corresponding internal db properties.
function translate(props) {
    // Today, the only property we have is `username`.
    // TODO: Validate it. E.g. length, acceptable chars, etc.
    return {
        username: props.username,
    };
}

// Public instance methods:

// Atomically updates this user, both locally and remotely in the db, with the
// given property updates.
User.prototype.patch = function (props, callback) {
    var safeProps = translate(props);

    var query = [
        'MATCH (user:User {username: {username}})',
        'SET user += {props}',
        'RETURN user',
    ].join('\n');

    var params = {
        username: this.username,
        props: safeProps,
    };

    var self = this;

    db.cypher({
        query: query,
        params: params,
    }, function (err, results) {
        if (err) return callback(err);

        if (!results.length) {
            err = new Error('User has been deleted! Username: ' + self.username);
            return callback(err);
        }

        // Update our node with this updated+latest data from the server:
        self._node = results[0]['user'];

        callback(null);
    });
};

User.prototype.del = function (callback) {
    // Use a Cypher query to delete both this user and his/her following
    // relationships in one query and one network request:
    // (Note that this'll still fail if there are any relationships attached
    // of any other types, which is good because we don't expect any.)
    var query = [
        'MATCH (user:User {username: {username}})',
        'OPTIONAL MATCH (user) -[rel:follows]- (other)',
        'DELETE user, rel',
    ].join('\n')

    var params = {
        username: this.username,
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
        'MATCH (user:User {username: {thisUsername}})',
        'MATCH (other:User {username: {otherUsername}})',
        'MERGE (user) -[rel:follows]-> (other)',
    ].join('\n')

    var params = {
        thisUsername: this.username,
        otherUsername: other.username,
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
        'MATCH (user:User {username: {thisUsername}})',
        'MATCH (other:User {username: {otherUsername}})',
        'MATCH (user) -[rel:follows]-> (other)',
        'DELETE rel',
    ].join('\n')

    var params = {
        thisUsername: this.username,
        otherUsername: other.username,
    };

    db.cypher({
        query: query,
        params: params,
    }, function (err) {
        callback(err);
    });
};

// Calls callback w/ (err, following, others), where following is an array of
// users this user follows, and others is all other users minus him/herself.
User.prototype.getFollowingAndOthers = function (callback) {
    // Query all users and whether we follow each one or not:
    var query = [
        'MATCH (user:User {username: {thisUsername}})',
        'MATCH (other:User)',
        'OPTIONAL MATCH (user) -[rel:follows]-> (other)',
        'RETURN other, COUNT(rel)', // COUNT(rel) is a hack for 1 or 0
    ].join('\n')

    var params = {
        thisUsername: this.username,
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

            if (user.username === other.username) {
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

// Static methods:

User.get = function (username, callback) {
    var query = [
        'MATCH (user:User {username: {username}})',
        'RETURN user',
    ].join('\n')

    var params = {
        username: username,
    };

    db.cypher({
        query: query,
        params: params,
    }, function (err, results) {
        if (err) return callback(err);
        if (!results.length) {
            err = new Error('No such user with username: ' + username);
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

// Creates the user and persists (saves) it to the db, incl. indexing it:
User.create = function (props, callback) {
    var query = [
        'CREATE (user:User {props})',
        'RETURN user',
    ].join('\n');

    var params = {
        props: translate(props)
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

// Static initialization:

// Register our unique username constraint.
// TODO: This is done async'ly (fire and forget) here for simplicity,
// but this would be better as a formal schema migration script or similar.
db.createConstraint({
    label: 'User',
    property: 'username',
}, function (err, constraint) {
    if (err) throw err;     // Failing fast for now, by crash the application.
    if (constraint) {
        console.log('(Registered unique usernames constraint.)');
    } else {
        // Constraint already present; no need to log anything.
    }
})
