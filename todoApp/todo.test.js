import request from 'supertest';
import { ObjectID } from 'mongodb';

import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';

import { app } from './index';
import { Todo, User } from './models';

const userId = new ObjectID();
const todoDummy = [{
        _id: new ObjectID(),
        text: 'first todo',
        createdBy: userId,
    },
    {
        _id: new ObjectID(),
        text: 'second todo',
        createdBy: userId,
    },
];

const userDummy = {
    _id: userId,
    real: 'testpassword',
    password: '$2b$10$nosBYF9HlO9CVWOYisD1CevOAYeEm/PycoDBs6qdpDpMaC3ww5lSy',
    email: 'user@for.todo',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userId.toHexString(), access: 'auth' }, 'secret').toString(),
    }],
};

describe('app', () => {
    describe('/todo endpoint', () => {
        beforeEach((done) => {
            Todo.deleteMany({}).then(() => Todo.insertMany(todoDummy)).then(() => {
                User.deleteMany({}).then(() => User.insertMany([userDummy]).then(() => done()));
            });
        });

        describe('post over /todo end point', () => {
            it('returns 200  with the right request body', (done) => {
                const text = 'love me';
                request(app)
                    .post('/todo')
                    .set('x-auth', userDummy.tokens[0].token)
                    .send({ text, createdBy: userId.toHexString() })
                    .expect(200)
                    .expect(res => expect(res.body.text).to.equal(text))
                    .end((err) => {
                        if (err) {
                            return done(err);
                        }
                        return Todo.find({ text }).then((todoList) => {
                            expect(todoList.length).to.equal(1);
                            expect(todoList[0].text).to.equal(text);
                            done();
                        }).catch(e => done(e));
                    });
            });

            it('return 400 with the right error message', (done) => {
                request(app)
                    .post('/todo')
                    .set('x-auth', userDummy.tokens[0].token)
                    .expect(400)
                    .expect(res => expect(res.body.message).to.equal('Todo validation failed: text: Path `text` is required.'))
                    .end((err) => {
                        if (err) {
                            return done(err);
                        }
                        return Todo.find().then((todoList) => {
                            expect(todoList.length).to.equal(2);
                            done();
                        }).catch(e => done(e));
                    });
            });
        });

        describe('get over /todo end point', () => {
            it('gets the right number of todo items from the collection', (done) => {
                request(app)
                    .get('/todo')
                    .set('x-auth', userDummy.tokens[0].token)
                    .expect(200)
                    .expect(res => expect(res.body.result.length).to.equal(2))
                    .end(done);
            });

            it('returns an empty list when the collection is empty', (done) => {
                Todo.deleteMany({}).then(() => {
                    request(app)
                        .get('/todo')
                        .set('x-auth', userDummy.tokens[0].token)
                        .expect(200)
                        .expect(res => expect(res.body.result.length).to.equal(0))
                        .end(done);
                });
            });
        });

        describe('get over /todo/:id end point', () => {
            it('returns a single todo object if the todo exists', (done) => {
                const { _id } = todoDummy[0];
                request(app)
                    .get(`/todo/${_id}`)
                    .set('x-auth', userDummy.tokens[0].token)
                    .expect(200)
                    .expect(res => expect(res.body.result).to.contain({
                        ...todoDummy[0],
                        // eslint-disable-next-line no-underscore-dangle
                        createdBy: userDummy._id.toHexString(),
                        _id: _id.toHexString(),
                    }))
                    .end(done);
            });

            it('returns the right error message if the todo doesn\'t exist', (done) => {
                Todo.deleteMany({}).then(() => {
                    const { _id } = todoDummy[0];
                    request(app)
                        .get(`/todo/${_id}`)
                        .set('x-auth', userDummy.tokens[0].token)
                        .expect(404)
                        .expect(res => expect(res.body.errorMessage).to.equal('todo not found'))
                        .end(done);
                });
            });
        });

        describe('delete over /todo/:id end point', () => {
            it('returns a single todo object if the todo exists', (done) => {
                const { _id } = todoDummy[0];
                request(app)
                    .delete(`/todo/${_id}`)
                    .set('x-auth', userDummy.tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.result).to.contain({
                            ...todoDummy[0],
                            // eslint-disable-next-line no-underscore-dangle
                            createdBy: userDummy._id.toHexString(),
                            _id: _id.toHexString(),
                        });
                    })
                    .end(done);
            });

            it('delete a single todo from the collection', (done) => {
                const { _id } = todoDummy[0];
                request(app)
                    .delete(`/todo/${_id}`)
                    .set('x-auth', userDummy.tokens[0].token)
                    .end(() => {
                        Todo.find().then((result) => {
                            expect(result.length).to.equal(1);
                            done();
                        }).catch(e => done(e));
                    });
            });

            it('returns right error message when todo doesn\' exist', (done) => {
                request(app)
                    .delete('/todo/5bfa6d0baea6e56b7902ea8c')
                    .set('x-auth', userDummy.tokens[0].token)
                    .expect(404)
                    .expect((res) => {
                        expect(res.errorMessage).to.equal('no todo found to delete');
                    });
                Todo.find().then((result) => {
                    expect(result.length).to.equal(2);
                    done();
                }).catch(e => done(e));
            });
        });

        describe('patch over /todo/:id end point', () => {
            it('returns a single todo if the todo exists and updates it', (done) => {
                const { _id } = todoDummy[0];
                request(app)
                    .patch(`/todo/${_id}`)
                    .set('x-auth', userDummy.tokens[0].token)
                    .send({ completed: true })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.result).to.contain({
                            ...todoDummy[0],
                            completed: true,
                            // eslint-disable-next-line no-underscore-dangle
                            createdBy: userDummy._id.toHexString(),
                            _id: _id.toHexString(),
                        });
                    })
                    .end(done);
            });

            it('updates a single todo from the collection', (done) => {
                const { _id } = todoDummy[0];
                request(app)
                    .patch(`/todo/${_id}`)
                    .set('x-auth', userDummy.tokens[0].token)
                    .send({ completed: true })
                    .end(() => {
                        Todo.find().then((result) => {
                            expect(result.length).to.equal(2);
                            expect(result[0].completed).to.be.true;
                            expect(result[0].completedAt).to.not.equal(null);
                            done();
                        }).catch(e => done(e));
                    });
            });
        });
    });
});
