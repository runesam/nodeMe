import { describe, it } from 'mocha';
import { expect } from 'chai';

import { generateMessage, generateLocationMessage } from './message';

describe('generate message function', () => {
    it('generates the message with the right properties', () => {
        const from = 'same7.hamada@gmail.com';
        const text = 'just for testing purposes';
        const actual = generateMessage(from, text);
        expect(actual).to.contain({
            from,
            text,
        });
        expect(actual.createdAt).to.be.a('date');
    });
});

describe('generate location message function', () => {
    it('generates the message with the right properties', () => {
        const lat = 0;
        const lon = 0;
        const from = 'same7.hamada@gmail.com';
        const text = `
            <a
                href='https://maps.google.com/?q=${lat},${lon}' target='_blank'
            >
                location
            </a>
        `;
        const actual = generateLocationMessage(from, lat, lon);
        expect(actual).to.contain({ from, text });
        expect(actual.createdAt).to.be.a('date');
    });
});
