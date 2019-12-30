"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jasmine");
const emote_widget_1 = require("./emote-widget");
const emote_widget_config_1 = require("./emote-widget-config");
const emote_twitch_1 = require("./emote-twitch");
describe('Emote Widget Spec', () => {
    let emoteConfig;
    let testWidget;
    beforeEach(() => {
        emoteConfig = new emote_widget_config_1.EmoteWidgetConfig();
        emoteConfig.setConfigFrom('clientId=gct24z0bpt832rurvqgn4m6kqja6kg&botMode=true&showGlobal=true&showBttv=true');
        testWidget = new emote_widget_1.EmoteWidget(emoteConfig);
    });
    it('gets the list of emote codes available', () => {
        let emote1 = new emote_twitch_1.TwitchEmote('code1', 0, 0);
        let emote2 = new emote_twitch_1.TwitchEmote('code2', 0, 0);
        let emote3 = new emote_twitch_1.TwitchEmote('code3', 0, 0);
        testWidget.masterEmotes = [emote1, emote2, emote3];
        const expectedReturnedCodes = [emote1.code, emote2.code, emote3.code];
        let actualReturnedCodes = testWidget.getEmoteCodes();
        expect(actualReturnedCodes).toEqual(expectedReturnedCodes);
        const newCode = 'someNewCode';
        testWidget.masterEmotes.push(new emote_twitch_1.TwitchEmote(newCode, 0, 0));
        expectedReturnedCodes.push(newCode);
        actualReturnedCodes = testWidget.getEmoteCodes();
        expect(actualReturnedCodes).toEqual(expectedReturnedCodes);
    });
    it('throws an error when trying to select a random emote when no emotes are in the master list', () => {
        expect(() => { testWidget.getRandomEmote(); }).toThrow(new Error('No Emotes in the master list.'));
    });
});
