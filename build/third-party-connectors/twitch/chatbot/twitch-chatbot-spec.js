"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const twitch_chatbot_1 = require("./twitch-chatbot");
describe('Twitch Chat Bot', () => {
    let mockSteamApi;
    let testBot;
    beforeEach(() => {
        mockSteamApi = jasmine.createSpyObj('SteamApi', ['getSteamJoinableLobbyLink']);
        testBot = new twitch_chatbot_1.TwitchChatbot(mockSteamApi);
    });
    it('returns false if no emotes exist', () => {
        expect(testBot.emotesExist()).toBe(false);
    });
    it('returns true if emotes exist in the list', () => {
        testBot.setEmoteCodes(['testcode1', 'testcode2']);
        expect(testBot.emotesExist()).toBe(true);
    });
});
