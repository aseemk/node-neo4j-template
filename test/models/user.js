//
// User model tests. These are basically CRUD tests, ordered to let us test
// all cases, plus listing all users and following/unfollowing between users.
//
// It's worth noting that there may already be users in the database, so these
// tests must not assume the initial state is empty.
//
// High-level test plan:
//
// - List initial users.
// - Create a user A.
// - Fetch user A. Should be the same.
// - List users again; should be initial list plus user A.
// - Update user A, e.g. its name.
// - Fetch user A again. It should be updated.
// - Delete user A.
// - Try to fetch user A again; should fail.
// - List users again; should be back to initial list.
//
// - Create two users in parallel, B and C.
// - Fetch both user's "following and others"; both should show no following.
// - Have user B follow user C.
// - Have user B follow user C again; should be idempotent.
// - Fetch user B's "following and others"; should show following user C.
// - Fetch user C's "following and others"; should show not following user B.
// - Have user B unfollow user C.
// - Have user B unfollow user C again; should be idempotent.
// - Fetch both users' "following and others" again; both should follow none.
//
// - Create a user D.
// - Have user B follow user C follow user D.
// - Fetch all users' "following and others"; should be right.
// - Delete user B.
// - Fetch user C's and D's "following and others"; should be right.
// - Delete user D.
// - Fetch user C's "following and others"; should be right.
// - Delete user C.
//
// NOTE: I struggle to translate this kind of test plan into BDD style tests.
// E.g. what am I "describing", and what should "it" do?? Help welcome! =)
//


var expect = require('chai').expect;
var User = require('../../models/user');


// Shared state:

var INITIAL_USERS;
var USER_A, USER_B, USER_C, USER_D;


// Helpers:

/**
 * Asserts that the given object is a valid user model.
 * If an expected user model is given too (the second argument),
 * asserts that the given object represents the same user with the same data.
 */
function expectUser(obj, user) {
    expect(obj).to.be.an('object');
    expect(obj).to.be.an.instanceOf(User);

    if (user) {
        ['id', 'name'].forEach(function (prop) {
            expect(obj[prop]).to.equal(user[prop]);
        });
    }
}

/**
 * Asserts that the given array of users contains the given user,
 * exactly and only once.
 */
function expectUsersToContain(users, expUser) {
    var found = false;

    expect(users).to.be.an('array');
    users.forEach(function (actUser) {
        if (actUser.id === expUser.id) {
            expect(found, 'User already found').to.equal(false);
            expectUser(actUser, expUser);
            found = true;
        }
    });
    expect(found, 'User not found').to.equal(true);
}

/**
 * Asserts that the given array of users does *not* contain the given user.
 */
function expectUsersToNotContain(users, expUser) {
    expect(users).to.be.an('array');
    users.forEach(function (actUser) {
        expect(actUser.id).to.not.equal(expUser.id);
    });
}

/**
 * Fetches the given user's "following and others", and asserts that it
 * reflects the given list of expected following and expected others.
 * The expected following is expected to be a complete list, while the
 * expected others may be a subset of all users.
 * Calls the given callback (err, following, others) when complete.
 */
function expectUserToFollow(user, expFollowing, expOthers, callback) {
    user.getFollowingAndOthers(function (err, actFollowing, actOthers) {
        if (err) return callback(err);

        expect(actFollowing).to.be.an('array');
        expect(actFollowing).to.have.length(expFollowing.length);
        expFollowing.forEach(function (expFollowingUser) {
            expectUsersToContain(actFollowing, expFollowingUser);
        });
        expOthers.forEach(function (expOtherUser) {
            expectUsersToNotContain(actFollowing, expOtherUser);
        });

        expect(actOthers).to.be.an('array');
        expOthers.forEach(function (expOtherUser) {
            expectUsersToContain(actOthers, expOtherUser);
        });
        expFollowing.forEach(function (expFollowingUser) {
            expectUsersToNotContain(actOthers, expFollowingUser);
        });

        // and neither list should contain the user itself:
        expectUsersToNotContain(actFollowing, user);
        expectUsersToNotContain(actOthers, user);

        return callback(null, actFollowing, actOthers);
    });
}


// Tests:

describe('User models:', function () {

    // Single user CRUD:

    it('List initial users', function (next) {
        User.getAll(function (err, users) {
            if (err) return next(err);

            expect(users).to.be.an('array');
            users.forEach(function (user) {
                expectUser(user);
            });

            INITIAL_USERS = users;
            return next();
        });
    });

    it('Create user A', function (next) {
        var name = 'Test User A';
        User.create({name: name}, function (err, user) {
            if (err) return next(err);

            expectUser(user);
            expect(user.id).to.be.a('number');
            expect(user.name).to.be.equal(name);

            USER_A = user;
            return next();
        });
    });

    it('Fetch user A', function (next) {
        User.get(USER_A.id, function (err, user) {
            if (err) return next(err);
            expectUser(user, USER_A);
            return next();
        });
    });

    it('List users again', function (next) {
        User.getAll(function (err, users) {
            if (err) return next(err);

            // the order isn't part of the contract, so we just test that the
            // new array is one longer than the initial, and contains user A.
            expect(users).to.be.an('array');
            expect(users).to.have.length(INITIAL_USERS.length + 1);
            expectUsersToContain(users, USER_A);

            return next();
        });
    });

    it('Update user A', function (next) {
        USER_A.name += ' (edited)';
        USER_A.save(function (err) {
            return next(err);
        });
    });

    it('Fetch user A again', function (next) {
        User.get(USER_A.id, function (err, user) {
            if (err) return next(err);
            expectUser(user, USER_A);
            return next();
        });
    });

    it('Delete user A', function (next) {
        USER_A.del(function (err) {
            return next(err);
        });
    });

    it('Attempt to fetch user A again', function (next) {
        User.get(USER_A.id, function (err, user) {
            expect(user).to.not.exist;  // i.e. null or undefined
            expect(err).to.be.an('object');
            expect(err).to.be.an.instanceOf(Error);
            return next();
        });
    });

    it('List users again', function (next) {
        User.getAll(function (err, users) {
            if (err) return next(err);

            // like before, we just test that this array is now back to the
            // initial length, and *doesn't* contain user A.
            expect(users).to.be.an('array');
            expect(users).to.have.length(INITIAL_USERS.length);
            expectUsersToNotContain(users, USER_A);

            return next();
        });
    });

    // Two-user following:

    it('Create users B and C', function (next) {
        var nameB = 'Test User B';
        var nameC = 'Test User C';

        function callback(err, user) {
            if (err) return next(err);

            expectUser(user);

            switch (user.name) {
                case nameB:
                    USER_B = user;
                    break;
                case nameC:
                    USER_C = user;
                    break;
                default:
                    // trigger an assertion error:
                    expect(user.name).to.equal(nameB);
            }

            if (USER_B && USER_C) {
                return next();
            }
        }

        User.create({name: nameB}, callback);
        User.create({name: nameC}, callback);
    });

    it('Fetch user B’s “following and others”', function (next) {
        expectUserToFollow(USER_B, [], [USER_C], function (err, following, others) {
            if (err) return next(err);

            // our helper tests most things; we just test the length of others:
            expect(others).to.have.length(INITIAL_USERS.length + 1);

            return next();
        });
    });

    it('Fetch user C’s “following and others”', function (next) {
        expectUserToFollow(USER_C, [], [USER_B], function (err, following, others) {
            if (err) return next(err);

            // our helper tests most things; we just test the length of others:
            expect(others).to.have.length(INITIAL_USERS.length + 1);

            return next();
        });
    });

    it('Have user B follow user C', function (next) {
        USER_B.follow(USER_C, function (err) {
            return next(err);
        });
    });

    it('Have user B follow user C again', function (next) {
        USER_B.follow(USER_C, function (err) {
            return next(err);
        });
    });

    it('Fetch user B’s “following and others”', function (next) {
        expectUserToFollow(USER_B, [USER_C], [], next);
    });

    it('Fetch user C’s “following and others”', function (next) {
        expectUserToFollow(USER_C, [], [USER_B], next);
    });

    it('Have user B unfollow user C', function (next) {
        USER_B.unfollow(USER_C, function (err) {
            return next(err);
        });
    });

    // NOTE: skipping this actually causes the next two tests to fail!
    it('Have user B unfollow user C again', function (next) {
        USER_B.unfollow(USER_C, function (err) {
            return next(err);
        });
    });

    it('Fetch user B’s “following and others”', function (next) {
        expectUserToFollow(USER_B, [], [USER_C], next);
    });

    it('Fetch user C’s “following and others”', function (next) {
        expectUserToFollow(USER_C, [], [USER_B], next);
    });

    // Multi-user-following deletions:

    it('Create user D', function (next) {
        var name = 'Test User D';
        User.create({name: name}, function (err, user) {
            if (err) return next(err);

            expectUser(user);
            expect(user.name).to.be.equal(name);

            USER_D = user;
            return next();
        });
    });

    it('Have user B follow user C follow user D', function (next) {
        var remaining = 2;

        function callback(err) {
            if (err) return next(err);
            if (--remaining === 0) {
                next();
            }
        }

        USER_B.follow(USER_C, callback);
        USER_C.follow(USER_D, callback);
    });

    it('Fetch all user’s “following and others”', function (next) {
        var remaining = 3;

        function callback(err) {
            if (err) return next(err);
            if (--remaining === 0) {
                next();
            }
        }

        expectUserToFollow(USER_B, [USER_C], [USER_D], callback);
        expectUserToFollow(USER_C, [USER_D], [USER_B], callback);
        expectUserToFollow(USER_D, [], [USER_B, USER_C], callback);
    });

    it('Delete user B', function (next) {
        USER_B.del(function (err) {
            return next(err);
        });
    });

    it('Fetch user C’s and D’s “following and others”', function (next) {
        var remaining = 2;

        function callback(err) {
            if (err) return next(err);
            if (--remaining === 0) {
                next();
            }
        }

        expectUserToFollow(USER_C, [USER_D], [], callback);
        expectUserToFollow(USER_D, [], [USER_C], callback);
    });

    it('Delete user D', function (next) {
        USER_D.del(function (err) {
            return next(err);
        });
    });

    it('Fetch user C’s “following and others”', function (next) {
        expectUserToFollow(USER_C, [], [], next);
    });

    it('Delete user C', function (next) {
        USER_C.del(function (err) {
            return next(err);
        });
    });

});
