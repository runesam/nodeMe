import { describe, it } from 'mocha';
import { expect } from 'chai';

import Users from './users';

describe('users class', () => {
    const users = new Users();
    it('has a users empty list when initiate new instance of it', () => {
        const expected = users.getUsers();
        expect(expected).to.be.instanceOf(Array);
        expect(expected).to.have.length(0);
    });

    it('has a user getter and settter', () => {
        const { setUser, getUser } = users;
        expect(setUser).to.be.instanceOf(Function);
        expect(getUser).to.be.instanceOf(Function);
    });

    describe('setter', () => {
        it('sets user data', () => {
            const { setUser } = users;
            const user = { id: 1, username: 'sam', room: 'test' };
            setUser(user);
            const expected = users.getUsers();
            expect(expected).to.be.instanceOf(Array);
            expect(expected).to.have.length(1);
        });
    });

    describe('getter', () => {
        it('gets user data', () => {
            const { getUser } = users;
            const user = { id: 1, username: 'sam', room: 'test' };
            const expected = getUser(user);
            expect(expected).to.be.instanceOf(Object);
            expect(expected).to.deep.equal(user);
        });
    });

    describe('deleter', () => {
        it('delete user data', () => {
            const { deleteUser } = users;
            const user = { id: 1, username: 'sam', room: 'test' };
            let expected = deleteUser(user);
            expect(expected).to.be.instanceOf(Object);
            expect(expected).to.deep.equal(user);
            expected = users.getUsers();
            expect(expected).to.have.length(0);
        });
    });

    describe('getRoomUsers', () => {
        it('get Room Users List', () => {
            const { setUser, getRoomUsers } = users;
            ([
                { id: 1, username: 'sam1', room: 'test1' },
                { id: 2, username: 'sam2', room: 'test2' },
                { id: 3, username: 'sam3', room: 'test1' },
                { id: 4, username: 'sam4', room: 'test2' },
                { id: 5, username: 'sam5', room: 'test1' },
            ]).forEach(user => setUser(user));
            const expected = users.getUsers();
            expect(expected).to.have.length(5);
            const roomUsers = getRoomUsers('test1');
            expect(roomUsers).to.have.length(3);
        });
    });
});
