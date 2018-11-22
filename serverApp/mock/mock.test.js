import { describe, it } from 'mocha';
import { expect } from 'chai';

import { disagg } from './disagg';

describe('mocking services', () => {
    describe('disagg mocking function', () => {
        it('returns the right set of appliances breakdown', () => {
            expect(disagg()).to.deep.equal({
                applianceUsage: [
                    {
                        appliance: 'REFRIGERATION',
                        usage: 12.761227608333334,
                    },
                    {
                        appliance: 'ALWAYS_ON',
                        usage: 10.75027126875,
                    },
                    {
                        appliance: 'DISH_WASHER',
                        usage: 6.21089973328393,
                    },
                    {
                        appliance: 'LIGHTING',
                        usage: 5.8498614889644065,
                    },
                    {
                        appliance: 'WASHING_MACHINE',
                        usage: 2.885396666666667,
                    },
                ],
            });
        });
    });
});
