import request from 'supertest';
import { describe, it } from 'mocha';
import { expect } from 'chai';

import { app } from './index';

describe('app', () => {
    describe('/error end point', () => {
        it('returns 404  with the right errorMessage', (done) => {
            request(app)
                .get('/error')
                .expect(404)
                .expect(res => expect(res.body).to.deep.equal({ errorMessage: 'error not found' }))
                .end(done);
        });
    });
});
