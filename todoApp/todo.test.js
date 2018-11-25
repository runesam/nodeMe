import request from 'supertest';
import {
    beforeEach,
    describe,
    it,
} from 'mocha';
import { expect } from 'chai';

import { app } from './index';
import { User, Todo } from './models';

const todoDummy = [
    { text: 'first todo' },
    { text: 'second todo' },
];

beforeEach((done) => {
    Todo.deleteMany({}).then(() => Todo.insertMany(todoDummy)).then(() => done());
});

describe('app', () => {
    describe('post over /todo end point', () => {
        it('returns 200  with the right request body', (done) => {
            const text = 'love me';
            request(app)
                .post('/todo')
                .send({ text })
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

    describe('post over /todo end point', () => {
        it('gets the right number of todo items from the collection', (done) => {
            request(app)
                .get('/todo')
                .expect(200)
                .expect(res => expect(res.body.length).to.equal(2))
                .end(done);
        });
    });
});
