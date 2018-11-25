import request from 'supertest';
import { ObjectID } from 'mongodb';
import jwt from 'jsonwebtoken';

import {
    beforeEach,
    describe,
    it,
} from 'mocha';
import {
    expect,
} from 'chai';

import {
    app,
} from './index';
import {
    User,
} from './models';

const userDummy = {
    _id: new ObjectID(),
    password: 'testpassword',
    email: 'same7.hamada@gmail.com',
};

describe('/user end point', () => {
    beforeEach((done) => {
        User.deleteMany({}).then(() => User.insertMany([userDummy])).then(() => done());
    });

    describe('get over /user/:id end point', () => {
        it('returns a single user object if the user exists', (done) => {
            const { _id } = userDummy;
            request(app)
                .get(`/user/${_id}`)
                .expect(200)
                .expect(res => expect(res.body.result).to.contain({
                    email: userDummy.email,
                    _id: _id.toHexString(),
                }))
                .end(done);
        });

        it('returns the right errorMessage if the user doesn\'t exists', (done) => {
            User.deleteMany({}).then(() => {
                const { _id } = userDummy;
                request(app)
                    .get(`/user/${_id}`)
                    .expect(404)
                    .expect(res => expect(res.body.errorMessage).to.equal('user not found'))
                    .end(done);
            });
        });
    });

    describe('post over /user/ end point', () => {
        it('returns a single user object as created', (done) => {
            const email = `${Math.random()}test@test.com`;
            request(app)
                .post('/user/')
                .send({ email, password: 'test231' })
                .expect(200)
                .expect((res) => {
                    const { access } = jwt.verify(res.body.token, 'secret');
                    expect(access).to.equal('auth');
                })
                .end(() => {
                    User.find({ email }).then((result) => {
                        expect(result.length).to.equal(1);
                        done();
                    });
                });
        });
    });
});
