"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmoteParser {
    constructor() {
        this.emoteSuffixes = ['_SA', '_BW', '_HF', '_VF', '_SQ', '_TK', '_SG', '_RD'];
    }
    parseForEmotes(msg, parsableEmotes) {
        return this.checkAllWordsForParsableEmotes(msg, parsableEmotes);
    }
    checkAllWordsForParsableEmotes(words, parsableEmotes) {
        return words.split(' ').filter((word) => {
            return this.checkWordForParsableEmote(word, parsableEmotes) !== '';
        });
    }
    checkWordForParsableEmote(word, parsableEmotes) {
        let invokedEmote = '';
        parsableEmotes.forEach((emoteCode) => {
            if (word.toLowerCase() === emoteCode.toLowerCase()) {
                invokedEmote = emoteCode;
            }
            else if (invokedEmote === '') { // check for modified emote codes (like _SA or _RD or BW or _SQ)
                invokedEmote = this.checkForEmoteSuffix(word, emoteCode);
            }
        });
        return invokedEmote;
    }
    checkForEmoteSuffix(word, emoteCode) {
        let invokedEmote = '';
        this.emoteSuffixes.forEach((suffix) => {
            if (word.toLowerCase() === `${emoteCode}${suffix}`.toLowerCase()) {
                invokedEmote = `${emoteCode}${suffix}`;
            }
        });
        return invokedEmote;
    }
}
exports.EmoteParser = EmoteParser;
