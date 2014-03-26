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
// - Have user B follow user C.
// - Attempt to have user B follow user C again; should be idempotent.
// - Fetch both users' "following and others"; should be right.
// - Have user B unfollow user C.
// - Attempt to have user B unfollow user C again; should be idempotent.
// - Fetch both users' "following and others" again; should be changed.
// - Delete both users.
//
// NOTE: I struggle to translate this kind of test plan into BDD style tests.
// E.g. what am I "describing", and what should "it" do?? Help welcome! =)
//


var expect = require('chai').expect;
var User = require('../../models/user');


// Shared state:

var INITIAL_USERS;
var USER_A, USER_B, USER_C;


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

            var found = false;
            users.forEach(function (user) {
                if (user.id === USER_A.id) {
                    expect(found, 'User A already found').to.equal(false);
                    expectUser(user, USER_A);
                    found = true;
                }
            });
            expect(found, 'User A not found').to.equal(true);

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
            users.forEach(function (user) {
                expect(user.id).to.not.equal(USER_A.id);
            });

            return next();
        });
    });

    // Multi-user following:

    it('Create users B and C');

    it('Have user B follow user C');

    it('Attempt to have user B follow user C again');

    it('Fetch both users’ “following and others”');

    it('Have user B unfollow user C');

    it('Attempt to have user B unfollow user C again');

    it('Fetch both users’ “following and others” again');

    it('Delete both users');

});
