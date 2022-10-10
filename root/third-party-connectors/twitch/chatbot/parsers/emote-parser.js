"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmoteParser = exports.ComboType = void 0;
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
        this.emoteSuffixes = ["_SA", "_BW", "_HF", "_VF", "_SQ", "_TK", "_SG", "_RD", "_RA", "_HB", "_KI", "_HE", "_LH", "_RB", "_WD", "_BE", "_CL"];
        this.comboCodes = [
            new ComboEmote(ComboType.Sequence, ["Squid1", "Squid2", "Squid3", "Squid4"]),
            new ComboEmote(ComboType.Sequence, ["TableHere", "FlipThis"]),
            new ComboEmote(ComboType.LeftRight, ["PowerUpL", "PowerUpR"]),
            new ComboEmote(ComboType.LeftRight, ["HahaShrugLeft", "HahaShrugRight"]),
            new ComboEmote(ComboType.LeftRight, ["MercyWing1", "MercyWing2"]),
            new ComboEmote(ComboType.LeftRight, ["PrideWingL", "PrideWingR"]),
            new ComboEmote(ComboType.LeftRight, ["LuvBrownL", "LuvBrownR"]),
            new ComboEmote(ComboType.LeftRight, ["LuvBlondeL", "LuvBlondeR"]),
            new ComboEmote(ComboType.LeftRight, ["FBPass", "FBBlock"]),
        ];
    }
    parseComplete(msg, parsableEmotes) {
        // console.log("msg to check: ", msg);
        // console.log("parsable emotes: ", parsableEmotes);
        let foundEmotes = [];
        this.checkForComboEmotes(msg, parsableEmotes).forEach((emote) => {
            foundEmotes.push(emote);
        });
        this.parseForEmotes(msg, parsableEmotes).forEach((emote) => {
            if (!this.checkForDuplicate(foundEmotes, emote)) {
                foundEmotes.push({ type: ComboType.None, data: emote });
            }
        });
        return foundEmotes;
    }
    checkForDuplicate(existingValues, newValue) {
        let foundDupe = false;
        existingValues.forEach((existingValue) => {
            let fullMatch = false;
            for (let index = 0; index < newValue.length; index++) {
                fullMatch = existingValue.data[index] === newValue[index];
            }
            foundDupe = fullMatch || foundDupe;
        });
        return foundDupe;
    }
    parseForEmotes(msg, parsableEmotes) {
        const validEmotes = parsableEmotes.join("|");
        const validSuffixes = this.emoteSuffixes.join("|");
        const regex = new RegExp(`(${validEmotes})(${validSuffixes})?`, "gi");
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
        const validMiddles = parsableEmotes.join("|");
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
        const validSuffixes = this.emoteSuffixes.join("|");
        const regex = new RegExp(`${comboEmote.combo[0]} (${validMiddles})(${validSuffixes})? ${comboEmote.combo[1]}`, "gi");
        let comboEmotes = [];
        if (msg.match(regex)) {
            const matches = msg.match(regex);
            matches === null || matches === void 0 ? void 0 : matches.forEach((match) => {
                comboEmotes.push(match.split(" "));
            });
        }
        return comboEmotes;
    }
    checkForSequentialEmotes(msg, comboEmote) {
        const regex = new RegExp(`${comboEmote.combo.join(" ")}`, "gi");
        let comboEmotes = [];
        if (msg.match(regex)) {
            const matches = msg.match(regex);
            matches === null || matches === void 0 ? void 0 : matches.forEach((match) => {
                comboEmotes.push(match.split(" "));
            });
        }
        return comboEmotes;
    }
}
exports.EmoteParser = EmoteParser;
