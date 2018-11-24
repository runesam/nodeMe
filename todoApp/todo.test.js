import request from 'supertest';
import {
    describe,
    it,
    beforeEach,
    after,
} from 'mocha';
import { expect } from 'chai';

import { app, server } from './index';
import { User, Todo } from './models';

request.agent(server);

describe('app', () => {
    after((done) => {
        server.close();
        done();
    });

    describe('post over /todo end point', () => {
        beforeEach((done) => {
            Todo.deleteMany({}).then(() => done());
        });

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
                    return Todo.find().then((todoList) => {
                        expect(todoList.length).to.equal(1);
                        expect(todoList[0].text).to.equal(text);
                        done();
                    }).catch(e => done(e));
                });
        });
    });
});
