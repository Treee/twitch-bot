import "jasmine"
import { HelixApi } from './helix-api';

describe('Helix Api', () => {
    let testApi: HelixApi;

    beforeEach(() => {
        testApi = new HelixApi();
    });

    it('Can get basic stuff', () => {
        expect(false).toBe(true);
    });
});