"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ComboType;
(function (ComboType) {
    ComboType[ComboType["None"] = 0] = "None";
    ComboType[ComboType["Sequence"] = 1] = "Sequence";
    ComboType[ComboType["LeftRight"] = 2] = "LeftRight";
})(ComboType = exports.ComboType || (exports.ComboType = {}));
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
            foundEmotes.push({ type: ComboType.None, data: emote });
        });
        return foundEmotes;
    }
    parseForEmotes(msg, parsableEmotes) {
        const validEmotes = parsableEmotes.join('|');
        const validSuffixes = this.emoteSuffixes.join('|');
        const regex = new RegExp(`(${validEmotes})(${validSuffixes})?`, 'gi');
        let comboEmotes = [];
        if (msg.match(regex)) {
            const matches = msg.match(regex);
            if (matches) {
                comboEmotes.push(matches);
            }
        }
        return comboEmotes;
    }
    checkForComboEmotes(msg, parsableEmotes) {
        let comboEmotes = [];
        const validMiddles = parsableEmotes.join('|');
        this.comboCodes.forEach((comboEmote) => {
            const sequentialCombo = this.checkForSequentialEmotes(msg, comboEmote);
            if (sequentialCombo.length > 0) {
                sequentialCombo.forEach((combo) => {
                    comboEmotes.push({ type: ComboType.Sequence, data: combo });
                });
            }
            const leftRightCombo = this.checkForLeftRightEmotes(msg, comboEmote, validMiddles);
            if (leftRightCombo.length > 0) {
                leftRightCombo.forEach((combo) => {
                    comboEmotes.push({ type: ComboType.LeftRight, data: combo });
                });
            }
        });
        return comboEmotes;
    }
    checkForLeftRightEmotes(msg, comboEmote, validMiddles) {
        var _a;
        const validSuffixes = this.emoteSuffixes.join('|');
        const regex = new RegExp(`${comboEmote.combo[0]} (${validMiddles})(${validSuffixes})? ${comboEmote.combo[1]}`, 'gi');
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
