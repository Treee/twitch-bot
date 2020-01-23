"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ComboType;
(function (ComboType) {
    ComboType[ComboType["Sequence"] = 0] = "Sequence";
    ComboType[ComboType["LeftRight"] = 1] = "LeftRight";
})(ComboType || (ComboType = {}));
class ComboEmote {
    constructor(comboType, combo) {
        this.comboType = comboType;
        this.combo = combo;
    }
}
class EmoteParser {
    constructor() {
        this.emoteSuffixes = ['_SA', '_BW', '_HF', '_VF', '_SQ', '_TK', '_SG', '_RD'];
        this.comboCodes = [
            new ComboEmote(ComboType.Sequence, ['Squid1', 'Squid2', 'Squid3', 'Squid4']),
            new ComboEmote(ComboType.LeftRight, ['PowerUpL', 'PowerUpR'])
        ];
    }
    parseComplete(msg, parsableEmotes) {
        let foundEmotes = [];
        this.checkForComboEmotes(msg, parsableEmotes).forEach((emote) => {
            foundEmotes.push(emote);
        });
        this.parseForEmotes(msg, parsableEmotes).forEach((emote) => {
            foundEmotes.push(emote);
        });
        return foundEmotes;
    }
    parseForEmotes(msg, parsableEmotes) {
        const validEmotes = parsableEmotes.join('|');
        const regex = new RegExp(`(${validEmotes})`, 'gi');
        let comboEmotes = [];
        if (msg.match(regex)) {
            const matches = msg.match(regex);
            if (matches) {
                comboEmotes.push(matches);
            }
        }
        return comboEmotes;
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
    checkForComboEmotes(msg, parsableEmotes) {
        let comboEmotes = [];
        const validMiddles = parsableEmotes.join('|');
        this.comboCodes.forEach((comboEmote) => {
            const sequentialCombo = this.checkForSequentialEmotes(msg, comboEmote);
            if (sequentialCombo.length > 0) {
                sequentialCombo.forEach((combo) => {
                    comboEmotes.push(combo);
                });
            }
            const leftRightCombo = this.checkForLeftRightEmotes(msg, comboEmote, validMiddles);
            if (leftRightCombo.length > 0) {
                leftRightCombo.forEach((combo) => {
                    comboEmotes.push(combo);
                });
            }
        });
        return comboEmotes;
    }
    checkForLeftRightEmotes(msg, comboEmote, validMiddles) {
        var _a;
        const regex = new RegExp(`${comboEmote.combo[0]} (${validMiddles}) ${comboEmote.combo[1]}`, 'gi');
        let comboEmotes = [];
        if (msg.match(regex)) {
            const matches = msg.match(regex);
            (_a = matches) === null || _a === void 0 ? void 0 : _a.forEach((match) => {
                comboEmotes.push(match.split(' '));
            });
        }
        return comboEmotes;
    }
    checkForSequentialEmotes(msg, comboEmote) {
        var _a;
        const regex = new RegExp(`${comboEmote.combo.join(' ')}`, 'gi');
        let comboEmotes = [];
        if (msg.match(regex)) {
            const matches = msg.match(regex);
            (_a = matches) === null || _a === void 0 ? void 0 : _a.forEach((match) => {
                comboEmotes.push(match.split(' '));
            });
        }
        return comboEmotes;
    }
}
exports.EmoteParser = EmoteParser;
