import { TwitchChatbot } from "./twitch-chatbot";
import { SteamApi } from "../../steam/steam-api";

describe('Twitch Chat Bot', () => {

    let mockSteamApi: SteamApi;
    let testBot: TwitchChatbot;

    beforeEach(() => {
        mockSteamApi = jasmine.createSpyObj('SteamApi', ['getSteamJoinableLobbyLink']);
        testBot = new TwitchChatbot(mockSteamApi);
    });

    it('returns false if no emotes exist', () => {
        expect(testBot.emotesExist()).toBe(false);
    });

    it('returns true if emotes exist in the list', () => {
        testBot.setEmoteCodes(['testcode1', 'testcode2']);
        expect(testBot.emotesExist()).toBe(true);
    });
});