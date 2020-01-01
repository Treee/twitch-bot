"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmoteWidget {
    constructor(emoteConfig) {
        this.masterEmotes = [];
        this.emotesToDraw = [];
        this.emoteSuffixes = ['_SA', '_BW', '_HF', '_VF', '_SQ', '_TK', '_SG', '_RD'];
        this.emoteConfig = emoteConfig;
    }
    getEmoteCodes() {
        return this.masterEmotes.map((emote) => {
            return emote.code;
        });
    }
    getEmoteByCode(emoteCode) {
        const splitCode = emoteCode.split('_');
        if (splitCode.length === 2) {
            emoteCode = splitCode[0];
        }
        const foundEmote = this.masterEmotes.find((emote) => {
            return emote.code === emoteCode;
        });
        if (splitCode.length === 2) {
            foundEmote.channelPointModifier = `_${splitCode[1]}`;
        }
        if (!foundEmote) {
            throw new Error(`No emote found for code: ${emoteCode}.`);
        }
        foundEmote.setScale(this.randomNumberBetween(1, 3));
        foundEmote.setUrl();
        foundEmote.createHtmlElement('emote');
        return foundEmote.clone();
    }
    getRandomEmote() {
        const randomIndex = this.randomNumberBetween(0, this.masterEmotes.length - 1);
        if (this.masterEmotes.length < 1) {
            throw new Error('No Emotes in the master list.');
        }
        const randomEmote = this.masterEmotes[randomIndex];
        randomEmote.setScale(this.randomNumberBetween(1, 3));
        randomEmote.setUrl();
        randomEmote.createHtmlElement('emote');
        return randomEmote.clone();
    }
    randomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    addEmoteToContainer(emoteCode) {
        var _a, _b, _c;
        let newEmote = this.getRandomEmote();
        let numEmotes = 1;
        if (emoteCode !== '') {
            newEmote = this.getEmoteByCode(emoteCode);
            numEmotes = this.randomNumberBetween(2, 7);
        }
        for (let index = 0; index < numEmotes; index++) {
            (_a = newEmote) === null || _a === void 0 ? void 0 : _a.randomizeEmoteAnimation();
            if ((_b = newEmote) === null || _b === void 0 ? void 0 : _b.htmlElement) {
                $(`.emote-container`).append(newEmote.htmlElement);
            }
            // remove the elment
            setTimeout((emote) => {
                emote.htmlElement.hide(1);
            }, (((_c = newEmote) === null || _c === void 0 ? void 0 : _c.lifespan) || 0) * 1000 + 1000, newEmote);
        }
    }
    addEmoteToCanvasAndDrawables(emote) {
        var _a;
        if ((_a = emote) === null || _a === void 0 ? void 0 : _a.htmlElement) {
            $(`.emote-container`).append(emote.htmlElement);
            emote.moveTo(this.randomNumberBetween(0, this.getViewWidth()), 0);
            emote.velocity.y = this.randomNumberBetween(1, 7);
        }
        this.emotesToDraw.push(emote);
    }
    getViewHeight() {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }
    getViewWidth() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    startSimulation() {
        this.addEmoteToCanvasAndDrawables(this.getEmoteByCode('itsatrEeCool'));
        this.addEmoteToCanvasAndDrawables(this.getEmoteByCode('itsatrEeCool'));
        // let dt = 0.016;
        setInterval(() => {
            this.oneLoop();
        }, 1000 / 60);
    }
    oneLoop() {
        this.emotesToDraw.forEach((emote) => {
            const nextFrame = emote.calculateNextMoveFrame();
            emote.moveTo(nextFrame.x, nextFrame.y);
        });
    }
}
exports.EmoteWidget = EmoteWidget;
