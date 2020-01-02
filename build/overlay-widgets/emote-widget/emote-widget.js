"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_interfaces_1 = require("./emote-interfaces");
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
    getDrawableEmoteByEmote(emote) {
        const randomPosition = new emote_interfaces_1.Vector2(this.randomNumberBetween(0, this.getViewWidth()), 0);
        const randomVelocity = new emote_interfaces_1.Vector2(0, this.randomNumberBetween(1, 5));
        const randomLifespan = this.randomNumberBetween(1, 3);
        emote.setScale(this.randomNumberBetween(1, 3));
        emote.setUrl();
        const emoteSize = emote.convertScaleToPixels();
        const drawable = new emote_interfaces_1.DrawableEmote(randomPosition, randomVelocity, randomLifespan, emoteSize, emote.url);
        drawable.angularVelocityDegrees = this.randomNumberBetween(0, 12);
        return drawable;
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
        return foundEmote;
    }
    getRandomEmote() {
        const randomIndex = this.randomNumberBetween(0, this.masterEmotes.length - 1);
        if (this.masterEmotes.length < 1) {
            throw new Error('No Emotes in the master list.');
        }
        const randomEmote = this.masterEmotes[randomIndex];
        randomEmote.setScale(this.randomNumberBetween(1, 3));
        randomEmote.setUrl();
        return randomEmote;
    }
    randomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    addEmoteToContainer(emoteCode) {
        let newEmote = this.getRandomEmote();
        let numEmotes = this.randomNumberBetween(3, 9);
        if (emoteCode !== '') {
            newEmote = this.getEmoteByCode(emoteCode);
        }
        for (let index = 0; index < numEmotes; index++) {
            const drawableEmote = this.getDrawableEmoteByEmote(newEmote);
            this.addEmoteToCanvasAndDrawables(drawableEmote);
        }
    }
    addEmoteToCanvasAndDrawables(drawable) {
        var _a;
        if ((_a = drawable) === null || _a === void 0 ? void 0 : _a.htmlElement) {
            $(`.emote-container`).append(drawable.htmlElement);
        }
        this.emotesToDraw.push(drawable);
    }
    getViewHeight() {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }
    getViewWidth() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    startSimulation() {
        // this.addEmoteToContainer('itsatrEeCool');
        // this.addEmoteToContainer('itsatrEeCool');
        let dt = 0.016;
        setInterval(() => {
            this.oneLoop(dt);
        }, 1000 / 60);
    }
    oneLoop(dt) {
        this.emotesToDraw.forEach((emote) => {
            emote.doUpdate(dt);
            emote.draw();
        });
    }
}
exports.EmoteWidget = EmoteWidget;
