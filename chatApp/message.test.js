import { describe, it } from 'mocha';
import { expect } from 'chai';

import { generateMessage } from './message';

describe('generate message function', () => {
    it('generated the message with the right properties', () => {
        const from = 'same7.hamada@gmail.com';
        const text = 'just for testing purposes';
        const actual = generateMessage(from, text);
        expect(actual).to.contain({ from, text });
        expect(actual.createdAt).to.be.a('number');
    });
});
