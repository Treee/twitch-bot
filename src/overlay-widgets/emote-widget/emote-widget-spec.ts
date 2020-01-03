import "jasmine"
import { EmoteWidget } from './emote-widget';
import { EmoteWidgetConfig } from "./emote-widget-config";
import { TwitchEmote } from "./emotes/emote";

describe('Emote Widget Spec', () => {

    let emoteConfig: EmoteWidgetConfig;
    let testWidget: EmoteWidget;

    beforeEach(() => {
        emoteConfig = new EmoteWidgetConfig();
        emoteConfig.setConfigFrom('clientId=gct24z0bpt832rurvqgn4m6kqja6kg&botMode=true&showGlobal=true&showBttv=true');
        testWidget = new EmoteWidget(emoteConfig);
    });

    it('gets the list of emote codes available', () => {
        let emote1 = new TwitchEmote('code1', 0, '0');
        let emote2 = new TwitchEmote('code2', 0, '0');
        let emote3 = new TwitchEmote('code3', 0, '0');
        testWidget.masterEmotes = [emote1, emote2, emote3];
        const expectedReturnedCodes = [emote1.code, emote2.code, emote3.code];
        let actualReturnedCodes = testWidget.getEmoteCodes();
        expect(actualReturnedCodes).toEqual(expectedReturnedCodes);

        const newCode = 'someNewCode';
        testWidget.masterEmotes.push(new TwitchEmote(newCode, 0, '0'));
        expectedReturnedCodes.push(newCode);
        actualReturnedCodes = testWidget.getEmoteCodes();
        expect(actualReturnedCodes).toEqual(expectedReturnedCodes);
    });

    it('throws an error when trying to select a random emote when no emotes are in the master list', () => {
        expect(() => { testWidget.getRandomEmote(); }).toThrow(new Error('No Emotes in the master list.'));
    });
});