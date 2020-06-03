import { TwitchChatbot } from "./twitch-chatbot";
import { SteamApi } from "../../steam/steam-api";
import { TwitchApiV5 } from "../twitch-api-v5";

describe('Twitch Chat Bot', () => {

    let mockSteamApi: SteamApi;
    let mockTwitchApi: TwitchApiV5;
    let testBot: TwitchChatbot;

    beforeEach(() => {
        mockSteamApi = jasmine.createSpyObj('SteamApi', ['getSteamJoinableLobbyLink']);
        testBot = new TwitchChatbot(mockTwitchApi, mockSteamApi);
    });

    it('returns false if no emotes exist', () => {
        expect(testBot.emotesExist()).toBe(false);
    });


});