"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
var helix_api_1 = require("./helix-api");
describe('Helix Api', function () {
    var testApi;
    beforeEach(function () {
        testApi = new helix_api_1.HelixApi();
    });
    it('Can get basic stuff', function () {
        var x = testApi.getMostActiveStreamsForGameId(33214);
        console.log(x);
        expect(false).toBe(true);
    });
});
