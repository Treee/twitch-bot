import { EmoteParser, ComboType } from "./emote-parser";

describe('Emote Parser', () => {

    let emoteParser: EmoteParser;

    beforeEach(() => {
        emoteParser = new EmoteParser();
    });

    describe('parseComplete', () => {
        it('returns a list of emotes and combo emotes used', () => {
            const expectedResult = [
                { type: ComboType.Sequence, data: ['Squid1', 'Squid2', 'Squid3', 'Squid4'] },
                { type: ComboType.LeftRight, data: ['PowerUpL', 'itsatrEeToast', 'PowerUpR'] },
                { type: ComboType.LeftRight, data: ['PowerUpL', 'itsatrEeToast', 'PowerUpR'] },
                { type: ComboType.None, data: ['itsatrEeCool', 'itsatrEeCool', 'itsatrEeToast', 'itsatrEeToast'] }
            ];
            const parsableEmotes = ['itsatrEeCool', 'dfsa', 'itsatrEeToast'];
            const msg = 'hi itsatrEeCool itsatrEeCool Squid1 Squid2 Squid3 Squid4 texst tefdfdfgsd fdsf dsf sd PowerUpL itsatrEeToast PowerUpR tefgd  fds PowerUpL itsatrEeToast PowerUpR';
            const actualResult = emoteParser.parseComplete(msg, parsableEmotes);
            expect(actualResult).toEqual(expectedResult);
        });
    });

    describe('parseForEmotes', () => {
        it('returns a list of all matched emotes in a message that contain special emote suffixes', () => {
            const msg = 'some random text with emoteCode_SA';
            const parsableEmotes = ['emoteCode', 'dfsa', 'dsatw'];
            const expectedResult = [
                ['emoteCode_SA']
            ];
            const actualResult = emoteParser.parseForEmotes(msg, parsableEmotes);
            expect(actualResult).toEqual(expectedResult);
        });

        it('returns a list of all matched emotes in a message', () => {
            const msg = 'some random text with emoteCode';
            const parsableEmotes = ['emoteCode', 'dfsa', 'dsatw'];
            const expectedResult = [
                ['emoteCode']
            ];
            const actualResult = emoteParser.parseForEmotes(msg, parsableEmotes);
            expect(actualResult).toEqual(expectedResult);
        });

        it('returns an empty list if no words in the message match emote codes', () => {
            const msg = 'some random text with emoteCode';
            const parsableEmotes = ['grgsdf', 'dfsa', 'dsatw'];
            const expectedResult: string[][] = [];
            const actualResult = emoteParser.parseForEmotes(msg, parsableEmotes);
            expect(actualResult).toEqual(expectedResult);
        });
    });

    describe('checkForComboEmotes', () => {

        it('can find a sequence of emotes  that combo together', () => {
            const expectedResult = [
                { type: ComboType.Sequence, data: ['Squid1', 'Squid2', 'Squid3', 'Squid4'] }
            ];
            const msg = 'my custom emote msg Squid1 Squid2 Squid3 Squid4';
            const actualResult = emoteParser.checkForComboEmotes(msg, []);
            expect(actualResult).toEqual(expectedResult);
        });

        it('can find multiple sequences of emotes that combo together', () => {
            const expectedResult = [
                { type: ComboType.Sequence, data: ['Squid1', 'Squid2', 'Squid3', 'Squid4'] },
                { type: ComboType.Sequence, data: ['Squid1', 'Squid2', 'Squid3', 'Squid4'] },
            ];
            const msg = 'my custom emote msg Squid1 Squid2 Squid3 Squid4 Squid1 Squid2 Squid3 Squid4';
            const actualResult = emoteParser.checkForComboEmotes(msg, []);
            expect(actualResult).toEqual(expectedResult);
        });

        it('can find a sequence of emotes that are on the left and right', () => {
            const expectedResult = [
                { type: ComboType.LeftRight, data: ['PowerUpL', 'itsatrEeToast', 'PowerUpR'] }
            ];
            const parsableEmotes = ['test1', 'test2', 'itsatrEeToast'];
            const msg = 'my custom emote msg PowerUpL itsatrEeToast PowerUpR';
            const actualResult = emoteParser.checkForComboEmotes(msg, parsableEmotes);
            expect(actualResult).toEqual(expectedResult);
        });

        it('can find a sequence of emotes that are on the left and right using special suffixes', () => {
            const expectedResult = [
                { type: ComboType.LeftRight, data: ['PowerUpL', 'itsatrEeToast_SA', 'PowerUpR'] }
            ];
            const parsableEmotes = ['test1', 'test2', 'itsatrEeToast'];
            const msg = 'my custom emote msg PowerUpL itsatrEeToast_SA PowerUpR';
            const actualResult = emoteParser.checkForComboEmotes(msg, parsableEmotes);
            expect(actualResult).toEqual(expectedResult);
        });

        it('can find multiple sequences of emotes that are on the left and right', () => {
            const expectedResult = [
                { type: ComboType.LeftRight, data: ['PowerUpL', 'itsatrEeToast', 'PowerUpR'] },
                { type: ComboType.LeftRight, data: ['PowerUpL', 'itsatrEeToast', 'PowerUpR'] }
            ];
            const parsableEmotes = ['test1', 'test2', 'itsatrEeToast'];
            const msg = 'my custom emote msg PowerUpL itsatrEeToast PowerUpR PowerUpL itsatrEeToast PowerUpR';
            const actualResult = emoteParser.checkForComboEmotes(msg, parsableEmotes);
            expect(actualResult).toEqual(expectedResult);
        });
    });

});