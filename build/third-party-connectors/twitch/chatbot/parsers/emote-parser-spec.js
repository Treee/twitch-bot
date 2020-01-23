"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_parser_1 = require("./emote-parser");
describe('Emote Parser', () => {
    let emoteParser;
    beforeEach(() => {
        emoteParser = new emote_parser_1.EmoteParser();
    });
    describe('checkForEmoteSuffix', () => {
        it('returns any emotes string that match a specil suffix', () => {
            const expectedResult = 'bird_SA';
            const actualResult = emoteParser.checkForEmoteSuffix('bird_SA', 'bird');
            expect(actualResult).toEqual(expectedResult);
        });
        it('returns empty string if no emote suffix is used', () => {
            const expectedResult = '';
            const actualResult = emoteParser.checkForEmoteSuffix('bird', 'bird');
            expect(actualResult).toEqual(expectedResult);
        });
    });
    describe('checkWordForParsableEmote', () => {
        it('returns the emote code matched if a word matches', () => {
            const expectedResult = 'pickle';
            const actualResult = emoteParser.checkWordForParsableEmote('pickle', ['test', 'pickle']);
            expect(actualResult).toEqual(expectedResult);
        });
        it('returns an empty string if the word doesnt match', () => {
            const expectedResult = '';
            const actualResult = emoteParser.checkWordForParsableEmote('birdz', ['test', 'pickle']);
            expect(actualResult).toEqual(expectedResult);
        });
    });
    describe('checkAllWordsForParsableEmotes', () => {
        it('returns a list of all matched emotes in a message', () => {
            const msg = 'some random text with emoteCode';
            const parsableEmotes = ['emoteCode', 'dfsa', 'dsatw'];
            const expectedResult = ['emoteCode'];
            const actualResult = emoteParser.checkAllWordsForParsableEmotes(msg, parsableEmotes);
            expect(actualResult).toEqual(expectedResult);
        });
        it('returns an empty list if no words in the message match emote codes', () => {
            const msg = 'some random text with emoteCode';
            const parsableEmotes = ['grgsdf', 'dfsa', 'dsatw'];
            const expectedResult = [];
            const actualResult = emoteParser.checkAllWordsForParsableEmotes(msg, parsableEmotes);
            expect(actualResult).toEqual(expectedResult);
        });
    });
});
