"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firework_emote_1 = require("./firework-emote");
const raining_emote_1 = require("./raining-emote");
const wavy_emote_1 = require("./wavy-emote");
const emote_interfaces_1 = require("./emote-interfaces");
const math_helper_1 = require("../../../helpers/math-helper");
class EmoteFactory {
    constructor() {
        this.masterEmoteList = [];
    }
    getEmoteCodes() {
        return this.masterEmoteList.map((emote) => {
            return emote.code;
        });
    }
    getEmoteByCode(emoteCode) {
        let splitCode = emoteCode.split('_');
        // special case for the below emoji
        if (emoteCode === `[oO](_|\\.)[oO]`) {
            splitCode = [];
        }
        if (splitCode.length === 2) {
            emoteCode = splitCode[0];
        }
        const foundEmote = this.masterEmoteList.find((emote) => {
            return emote.code.toLowerCase() === emoteCode.toLowerCase();
        });
        if (foundEmote) {
            if (splitCode.length === 2) {
                foundEmote.channelPointModifier = `_${splitCode[1]}`;
            }
            else {
                foundEmote.channelPointModifier = '';
            }
        }
        if (!foundEmote) {
            throw new Error(`No emote found for code: ${emoteCode}.`);
        }
        foundEmote.setScale(math_helper_1.randomNumberBetween(1, 3));
        foundEmote.setUrl();
        return foundEmote;
    }
    getRandomEmote() {
        const randomIndex = math_helper_1.randomNumberBetween(0, this.masterEmoteList.length - 1);
        if (this.masterEmoteList.length < 1) {
            throw new Error('No Emotes in the master list.');
        }
        return this.getEmoteByCode(this.masterEmoteList[randomIndex].code);
    }
    createFireworkEmote(emoteCodes, canvasWidth, canvaseHeight) {
        const scalar = math_helper_1.randomNumberBetween(1, 3);
        const emoteUrls = [];
        let emoteSize = new emote_interfaces_1.Vector2(28, 28); //default values
        emoteCodes.forEach((emoteCode) => {
            const emote = this.getEmoteByCode(emoteCode);
            emote.setScale(scalar);
            emote.setUrl();
            emoteUrls.push(emote.url);
            emoteSize = emote.convertScaleToPixels();
        });
        const randomPosition = new emote_interfaces_1.Vector2(math_helper_1.randomNumberBetween(0, canvasWidth), canvaseHeight);
        const xVelocityDirection = randomPosition.x < canvasWidth / 2 ? 1 : -1;
        const randomVelocity = new emote_interfaces_1.Vector2(math_helper_1.randomNumberBetween(1, 2) * xVelocityDirection, math_helper_1.randomNumberBetween(2, 4.5) * -1);
        const randomLifespan = math_helper_1.randomNumberBetween(3, 4.2);
        const randomAngularVelocity = math_helper_1.randomNumberBetween(1, 2);
        const fireworkEmote = new firework_emote_1.FireworkEmote(randomPosition, randomVelocity, randomLifespan, emoteSize, emoteUrls, randomAngularVelocity);
        fireworkEmote.code = emoteCodes[0];
        return fireworkEmote;
    }
    createRainingEmote(emoteCodes, canvasWidth) {
        const scalar = math_helper_1.randomNumberBetween(1, 3);
        const emoteUrls = [];
        let emoteSize = new emote_interfaces_1.Vector2(28, 28); //default values
        emoteCodes.forEach((emoteCode) => {
            const emote = this.getEmoteByCode(emoteCode);
            emote.setScale(scalar);
            emote.setUrl();
            emoteUrls.push(emote.url);
            emoteSize = emote.convertScaleToPixels();
        });
        const randomPosition = new emote_interfaces_1.Vector2(math_helper_1.randomNumberBetween(0, canvasWidth), 0);
        const randomVelocity = new emote_interfaces_1.Vector2(0, math_helper_1.randomNumberBetween(1, 5));
        const randomLifespan = math_helper_1.randomNumberBetween(1, 6);
        const randomAngularVelocity = math_helper_1.randomNumberBetween(1, 4);
        return new raining_emote_1.RainingEmote(randomPosition, randomVelocity, randomLifespan, emoteSize, emoteUrls, randomAngularVelocity);
    }
    createWavyEmote(emoteCodes, canvasWidth, canvasHeight) {
        const scalar = math_helper_1.randomNumberBetween(1, 3);
        const emoteUrls = [];
        let emoteSize = new emote_interfaces_1.Vector2(28, 28); //default values
        emoteCodes.forEach((emoteCode) => {
            const emote = this.getEmoteByCode(emoteCode);
            emote.setScale(scalar);
            emote.setUrl();
            emoteUrls.push(emote.url);
            emoteSize = emote.convertScaleToPixels();
        });
        const randomVelocity = new emote_interfaces_1.Vector2(math_helper_1.randomNumberBetween(1, 5), math_helper_1.randomNumberBetween(1, 5));
        const randomLifespan = math_helper_1.randomNumberBetween(3, 9);
        const randomAngularVelocity = math_helper_1.randomNumberBetween(1, 4);
        const randomPosition = new emote_interfaces_1.Vector2(0, math_helper_1.randomNumberBetween(0, canvasHeight - emoteSize.y));
        const max = 2;
        const toggle = math_helper_1.randomNumberBetween(1, max); //left
        if (toggle % max === 1) { // right
            randomPosition.x = canvasWidth;
            randomVelocity.x *= -1;
        }
        // else if (toggle % max === 2) { // top
        //     randomPosition.x = randomNumberBetween(0, this.getViewWidth());
        //     randomPosition.y = 0;
        // } else if (toggle % max === 3) {// bot
        //     randomPosition.x = randomNumberBetween(0, this.getViewWidth());
        //     randomPosition.y = this.getViewHeight();
        //     randomVelocity.y *= -1;
        // }
        return new wavy_emote_1.WavyEmote(randomPosition, randomVelocity, randomLifespan, emoteSize, emoteUrls, randomAngularVelocity);
    }
    checkForExplodedEmotes(activeEmotes) {
        let explodedEmotes = [];
        activeEmotes.forEach((emote) => {
            if (emote instanceof firework_emote_1.FireworkEmote && emote.opacity < 1 && !emote.isExploded) {
                explodedEmotes = explodedEmotes.concat(this.explodeIntoEmotes(emote.code, emote.position));
                emote.isExploded = true;
            }
        });
        return explodedEmotes;
    }
    explodeIntoEmotes(emoteCode, position) {
        const twoPi = Math.PI * 2;
        const radians = twoPi / 360;
        const emote = this.getEmoteByCode(emoteCode);
        const randomNumberOfEmoteParticles = math_helper_1.randomNumberBetween(5, 12);
        const emotesToReturn = [];
        for (let numEmotes = 0; numEmotes < randomNumberOfEmoteParticles; numEmotes++) {
            const randomLifespan = math_helper_1.randomNumberBetween(1, 2);
            const randomAngularVelocity = math_helper_1.randomNumberBetween(-4, 4);
            emote.setScale(math_helper_1.randomNumberBetween(1, 2));
            emote.setUrl();
            const emoteSize = emote.convertScaleToPixels();
            const randomDegrees = math_helper_1.randomNumberBetween(0, 360);
            const theta = randomDegrees * radians; // some random number between 0 and 2pi
            const randomVelocity = new emote_interfaces_1.Vector2(Math.cos(theta), Math.sin(theta));
            const fireworkEmote = new raining_emote_1.RainingEmote(position, randomVelocity, randomLifespan, emoteSize, [emote.url], randomAngularVelocity);
            emotesToReturn.push(fireworkEmote);
        }
        return emotesToReturn;
    }
}
exports.EmoteFactory = EmoteFactory;
