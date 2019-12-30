"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmoteWidget {
    constructor(emoteConfig) {
        this.masterEmotes = [];
        this.emoteConfig = emoteConfig;
    }
    getEmoteCodes() {
        return this.masterEmotes.map((emote) => {
            return emote.code;
        });
    }
    getEmoteByCode(emoteCode) {
        const foundEmote = this.masterEmotes.find((emote) => {
            return emote.code === emoteCode;
        });
        if (!foundEmote) {
            throw new Error(`No emote found for code: ${emoteCode}.`);
        }
        return foundEmote;
    }
    getRandomEmote() {
        const randomIndex = this.randomNumberBetween(0, this.masterEmotes.length - 1);
        if (this.masterEmotes.length < 1) {
            throw new Error('No Emotes in the master list.');
        }
        return this.masterEmotes[randomIndex];
    }
    randomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    addEmoteToContainer(emoteCode) {
        var _a, _b, _c, _d, _e, _f;
        let newEmote = this.getRandomEmote();
        let numEmotes = 1;
        if (emoteCode !== '') {
            newEmote = this.getEmoteByCode(emoteCode);
            numEmotes = this.randomNumberBetween(2, 7);
        }
        for (let index = 0; index < numEmotes; index++) {
            (_a = newEmote) === null || _a === void 0 ? void 0 : _a.setScale(this.randomNumberBetween(1, 3));
            (_b = newEmote) === null || _b === void 0 ? void 0 : _b.setUrl();
            (_c = newEmote) === null || _c === void 0 ? void 0 : _c.createHtmlElement('emote');
            (_d = newEmote) === null || _d === void 0 ? void 0 : _d.randomizeEmoteAnimation();
            if ((_e = newEmote) === null || _e === void 0 ? void 0 : _e.htmlElement) {
                $(`.emote-container`).append(newEmote.htmlElement);
            }
            // remove the elment
            setTimeout((emote) => {
                emote.htmlElement.hide(1);
            }, (((_f = newEmote) === null || _f === void 0 ? void 0 : _f.lifespan) || 0) * 1000 + 1000, newEmote);
        }
    }
}
exports.EmoteWidget = EmoteWidget;
