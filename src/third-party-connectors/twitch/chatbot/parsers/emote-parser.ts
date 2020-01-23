export class EmoteParser {
    private emoteSuffixes = ['_SA', '_BW', '_HF', '_VF', '_SQ', '_TK', '_SG', '_RD'];

    constructor() { }

    parseForEmotes(msg: string, parsableEmotes: string[]): string[] {
        return this.checkAllWordsForParsableEmotes(msg, parsableEmotes);
    }

    checkAllWordsForParsableEmotes(words: string, parsableEmotes: string[]): string[] {
        return words.split(' ').filter((word) => {
            return this.checkWordForParsableEmote(word, parsableEmotes) !== '';
        });
    }

    checkWordForParsableEmote(word: string, parsableEmotes: string[]): string {
        let invokedEmote: string = '';
        parsableEmotes.forEach((emoteCode) => {
            if (word.toLowerCase() === emoteCode.toLowerCase()) {
                invokedEmote = emoteCode;
            } else if (invokedEmote === '') { // check for modified emote codes (like _SA or _RD or BW or _SQ)
                invokedEmote = this.checkForEmoteSuffix(word, emoteCode);
            }
        });
        return invokedEmote;
    }

    checkForEmoteSuffix(word: string, emoteCode: string): string {
        let invokedEmote: string = '';
        this.emoteSuffixes.forEach((suffix) => {
            if (word.toLowerCase() === `${emoteCode}${suffix}`.toLowerCase()) {
                invokedEmote = `${emoteCode}${suffix}`;
            }
        });
        return invokedEmote;
    }
}
