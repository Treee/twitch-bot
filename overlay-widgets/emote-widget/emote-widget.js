"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_interfaces_1 = require("./emotes/emote-interfaces");
const raining_emote_1 = require("./emotes/raining-emote");
const wavy_emote_1 = require("./emotes/wavy-emote");
const firework_emote_1 = require("./emotes/firework-emote");
class EmoteWidget {
    constructor(emoteConfig) {
        this.masterEmotes = [];
        this.emotesToDraw = [];
        this.explodedEmotes = [];
        this.emoteConfig = emoteConfig;
    }
    getEmoteCodes() {
        return this.masterEmotes.map((emote) => {
            return emote.code;
        });
    }
    getDrawableEmoteByCode(emoteCodes) {
        let drawable = this.createRainingEmote(emoteCodes);
        const randomAnimationType = this.randomNumberBetween(1, 3);
        if (randomAnimationType === 2) {
            drawable = this.createWavyEmote(emoteCodes);
        }
        if (randomAnimationType === 3) {
            drawable = this.createFireworkEmote(emoteCodes);
        }
        return drawable;
    }
    createFireworkEmote(emoteCodes) {
        const scalar = this.randomNumberBetween(1, 3);
        const emoteUrls = [];
        let emoteSize = new emote_interfaces_1.Vector2(28, 28); //default values
        emoteCodes.forEach((emoteCode) => {
            const emote = this.getEmoteByCode(emoteCode);
            emote.setScale(scalar);
            emote.setUrl();
            emoteUrls.push(emote.url);
            emoteSize = emote.convertScaleToPixels();
        });
        const randomPosition = new emote_interfaces_1.Vector2(this.randomNumberBetween(0, this.getViewWidth()), this.getViewHeight());
        const xVelocityDirection = randomPosition.x < this.getViewWidth() / 2 ? 1 : -1;
        const randomVelocity = new emote_interfaces_1.Vector2(this.randomNumberBetween(1, 2) * xVelocityDirection, this.randomNumberBetween(2, 4.5) * -1);
        const randomLifespan = this.randomNumberBetween(3, 4.2);
        const randomAngularVelocity = this.randomNumberBetween(1, 2);
        const fireworkEmote = new firework_emote_1.FireworkEmote(randomPosition, randomVelocity, randomLifespan, emoteSize, emoteUrls, randomAngularVelocity);
        fireworkEmote.code = emoteCodes[0];
        return fireworkEmote;
    }
    createRainingEmote(emoteCodes) {
        const scalar = this.randomNumberBetween(1, 3);
        const emoteUrls = [];
        let emoteSize = new emote_interfaces_1.Vector2(28, 28); //default values
        emoteCodes.forEach((emoteCode) => {
            const emote = this.getEmoteByCode(emoteCode);
            emote.setScale(scalar);
            emote.setUrl();
            emoteUrls.push(emote.url);
            emoteSize = emote.convertScaleToPixels();
        });
        const randomPosition = new emote_interfaces_1.Vector2(this.randomNumberBetween(0, this.getViewWidth()), 0);
        const randomVelocity = new emote_interfaces_1.Vector2(0, this.randomNumberBetween(1, 5));
        const randomLifespan = this.randomNumberBetween(1, 6);
        const randomAngularVelocity = this.randomNumberBetween(1, 4);
        return new raining_emote_1.RainingEmote(randomPosition, randomVelocity, randomLifespan, emoteSize, emoteUrls, randomAngularVelocity);
    }
    createWavyEmote(emoteCodes) {
        const scalar = this.randomNumberBetween(1, 3);
        const emoteUrls = [];
        let emoteSize = new emote_interfaces_1.Vector2(28, 28); //default values
        emoteCodes.forEach((emoteCode) => {
            const emote = this.getEmoteByCode(emoteCode);
            emote.setScale(scalar);
            emote.setUrl();
            emoteUrls.push(emote.url);
            emoteSize = emote.convertScaleToPixels();
        });
        const randomVelocity = new emote_interfaces_1.Vector2(this.randomNumberBetween(1, 5), this.randomNumberBetween(1, 5));
        const randomLifespan = this.randomNumberBetween(3, 9);
        const randomAngularVelocity = this.randomNumberBetween(1, 4);
        const randomPosition = new emote_interfaces_1.Vector2(0, this.randomNumberBetween(0, this.getViewHeight() - emoteSize.y));
        const max = 2;
        const toggle = this.randomNumberBetween(1, max); //left
        if (toggle % max === 1) { // right
            randomPosition.x = this.getViewWidth();
            randomVelocity.x *= -1;
        }
        // else if (toggle % max === 2) { // top
        //     randomPosition.x = this.randomNumberBetween(0, this.getViewWidth());
        //     randomPosition.y = 0;
        // } else if (toggle % max === 3) {// bot
        //     randomPosition.x = this.randomNumberBetween(0, this.getViewWidth());
        //     randomPosition.y = this.getViewHeight();
        //     randomVelocity.y *= -1;
        // }
        return new wavy_emote_1.WavyEmote(randomPosition, randomVelocity, randomLifespan, emoteSize, emoteUrls, randomAngularVelocity);
    }
    getEmoteByCode(emoteCode) {
        const splitCode = emoteCode.split('_');
        if (splitCode.length === 2) {
            emoteCode = splitCode[0];
        }
        const foundEmote = this.masterEmotes.find((emote) => {
            return emote.code.toLowerCase() === emoteCode.toLowerCase();
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
    addEmoteToContainer(emoteCodes) {
        let numEmotes = this.randomNumberBetween(1, 2);
        for (let index = 0; index < numEmotes; index++) {
            emoteCodes.forEach((emote) => {
                const drawableEmote = this.getDrawableEmoteByCode([emote]);
                this.addEmoteToCanvasAndDrawables(drawableEmote);
            });
        }
    }
    addGroupedEmoteToContainer(emoteCodes) {
        let numEmotes = this.randomNumberBetween(1, 2);
        for (let index = 0; index < numEmotes; index++) {
            const drawableEmote = this.getDrawableEmoteByCode(emoteCodes);
            this.addEmoteToCanvasAndDrawables(drawableEmote);
        }
    }
    addEmoteToCanvasAndDrawables(drawable) {
        var _a;
        if ((_a = drawable) === null || _a === void 0 ? void 0 : _a.htmlElement) {
            setTimeout(() => {
                if (drawable.htmlElement) {
                    $(`.emote-container`).append(drawable.htmlElement);
                }
            }, this.randomNumberBetween(100, 500));
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
        this.checkForExplodedEmotes();
        this.pruneRemainingEmotes();
    }
    pruneRemainingEmotes() {
        this.emotesToDraw = this.emotesToDraw.filter((emote) => {
            var _a;
            return ((_a = emote) === null || _a === void 0 ? void 0 : _a.lifespan) > 0;
        });
    }
    checkForExplodedEmotes() {
        const explodedEmotes = this.emotesToDraw.filter((emote) => {
            if (emote instanceof firework_emote_1.FireworkEmote) {
                return emote.opacity < 1 && !emote.isExploded;
            }
        });
        explodedEmotes.forEach((explodedEmote) => {
            this.explodeIntoEmotes(explodedEmote.code, explodedEmote.position);
            explodedEmote.isExploded = true;
        });
    }
    explodeIntoEmotes(emoteCode, position) {
        const twoPi = Math.PI * 2;
        const radians = twoPi / 360;
        const emote = this.getEmoteByCode(emoteCode);
        const randomNumberOfEmoteParticles = this.randomNumberBetween(5, 12);
        for (let numEmotes = 0; numEmotes < randomNumberOfEmoteParticles; numEmotes++) {
            const randomLifespan = this.randomNumberBetween(1, 2);
            const randomAngularVelocity = this.randomNumberBetween(-4, 4);
            emote.setScale(this.randomNumberBetween(1, 2));
            emote.setUrl();
            const emoteSize = emote.convertScaleToPixels();
            const randomDegrees = this.randomNumberBetween(0, 360);
            const theta = randomDegrees * radians; // some random number between 0 and 2pi
            const randomVelocity = new emote_interfaces_1.Vector2(Math.cos(theta), Math.sin(theta));
            const fireworkEmote = new raining_emote_1.RainingEmote(position, randomVelocity, randomLifespan, emoteSize, [emote.url], randomAngularVelocity);
            this.addEmoteToCanvasAndDrawables(fireworkEmote);
        }
    }
}
exports.EmoteWidget = EmoteWidget;
