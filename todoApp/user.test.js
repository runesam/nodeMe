import request from 'supertest';
import { ObjectID } from 'mongodb';
import jwt from 'jsonwebtoken';

import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';

import { app } from './index';
import { User } from './models';

const id = new ObjectID();
const userDummy = {
    _id: id,
    real: 'testpassword',
    password: '$2b$10$nosBYF9HlO9CVWOYisD1CevOAYeEm/PycoDBs6qdpDpMaC3ww5lSy',
    email: 'same7.hamada@gmail.com',
    tokens: {
        access: 'auth',
        token: jwt.sign({ _id: id.toHexString(), access: 'auth' }, 'secret').toString(),
    },
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

    describe('get over /user/me end point', () => {
        it('return user id and email if user exists', (done) => {
            request(app)
                .get('/user/me')
                .set('x-auth', userDummy.tokens.token)
                .send()
                .expect(200)
                .expect((result) => {
                    const { _id, email } = result.body;
                    expect(_id).to.equal(id.toHexString());
                    expect(email).to.equal(userDummy.email);
                })
                .end(done);
        });

        it('returns the right error message if the user does\'t exist', (done) => {
            request(app)
                .get('/user/me')
                .set('x-auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmZhY2RmZmM2MTY4OGJlMTY0MzE3MTEiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTQzMTYzMzkxfQ.KUdkfcCoxhxJwyuNrZ11zuI85dm6TvUwybYOIrtkMbQ')
                .send()
                .expect(404)
                .expect(({ body }) => expect(body.errorMessage).to.equal('user not found'))
                .end(done);
        });

        it('returns 401 if there is no token provided with the right error message', (done) => {
            request(app)
                .get('/user/me')
                .set('x-auth', 'invalid token')
                .send()
                .expect(401)
                .expect(({ body }) => expect(body.message).to.equal('jwt malformed'))
                .end(done);
        });

        it('returns 401 if there is no token provided with the right error message', (done) => {
            request(app)
                .get('/user/me')
                .send()
                .expect(401)
                .expect(({ body }) => expect(body.message).to.equal('jwt must be provided'))
                .end(done);
        });

        it('returns 401 if there is no token provided with the right error message', (done) => {
            request(app)
                .get('/user/me')
                .set('x-auth', 'sJ9.eyJfaWQiOiI1YmZhY2RmZmM2MTY4OGJlMTY0MzE3MTEiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTQzMTYzMzkxfQ.KUdkfcCoxhxJwyuNrZ11zuI85dm6TvUwybYOIrtkMbQ')
                .send()
                .expect(401)
                .expect(({ body }) => expect(body.message).to.equal('invalid token'))
                .end(done);
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

        it('returns invalid messages when provided body is', (done) => {
            request(app)
                .post('/user/')
                .send({ email: 'invalid email', password: 'small' })
                .expect(400)
                .expect(({ body }) => {
                    const errors = Object.keys(body.errors);
                    expect(errors).to.contains('email');
                    expect(errors).to.contains('password');
                })
                .end(done);
        });

        it('returns duplicate key error message if email is already registered', (done) => {
            request(app)
                .post('/user/').send({ email: 'test@t.com', password: '123000' }).end(() => {
                    request(app)
                        .post('/user/')
                        .send({ email: 'test@t.com', password: '123000' })
                        .expect(({ body }) => {
                            expect(body.errmsg).to.contain('duplicate key error collection');
                        })
                        .end(done);
                });
        });
    });

    describe('post over /user/login/ endpoint', () => {
        it('returns a single user with right credentials', (done) => {
            let response;
            request(app)
                .post('/user/login/')
                .send({ email: userDummy.email, password: userDummy.real })
                .expect(200)
                .expect(({ header, body: { _id, email } }) => {
                    // eslint-disable-next-line no-underscore-dangle
                    expect(_id).to.equal(userDummy._id.toHexString());
                    expect(email).to.equal(userDummy.email);
                    response = header;
                })
                .end(() => {
                    User.findOne({ email: userDummy.email }).then((user) => {
                        const { tokens: [{ token }] } = user;
                        expect(response['x-auth']).to.equal(token);
                        done();
                    });
                });
        });

        it('returns the right error message when user not found', (done) => {
            request(app)
                .post('/user/login/')
                .send({ email: 'wrong@asa.com', password: 'wrongPass' })
                .expect(404)
                .expect(({ body: { errorMessage } }) => {
                    expect(errorMessage).to.equal('wrong email or password');
                })
                .end(done);
        });

        it('returns the right error message when password is wrong', (done) => {
            request(app)
                .post('/user/login/')
                .send({ email: userDummy.email, password: 'wrongPass' })
                .expect(401)
                .expect(({ body: { errorMessage } }) => {
                    expect(errorMessage).to.equal('wrong email or password');
                })
                .end(done);
        });
    });
});
