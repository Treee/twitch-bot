"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math_helper_1 = require("../../helpers/math-helper");
class EmoteWidget {
    constructor(emoteConfig, emoteFactory) {
        this.emotesToDraw = [];
        this.emoteConfig = emoteConfig;
        this.emoteFactory = emoteFactory;
    }
    getDrawableEmoteByCode(emoteCodes) {
        let drawable = this.emoteFactory.createFireworkEmote(emoteCodes, this.getViewWidth(), this.getViewHeight());
        const randomAnimationType = math_helper_1.randomNumberBetween(1, 3);
        if (randomAnimationType === 2) {
            drawable = this.emoteFactory.createWavyEmote(emoteCodes, this.getViewWidth(), this.getViewHeight());
        }
        if (randomAnimationType === 3) {
            drawable = this.emoteFactory.createFireworkEmote(emoteCodes, this.getViewWidth(), this.getViewHeight());
        }
        return drawable;
    }
    addEmoteToContainer(emoteCodes) {
        let numEmotes = math_helper_1.randomNumberBetween(1, 2);
        for (let index = 0; index < numEmotes; index++) {
            emoteCodes.forEach((emote) => {
                if (emote === '') {
                    emote = this.emoteFactory.getRandomEmote().code;
                }
                const drawableEmote = this.getDrawableEmoteByCode([emote]);
                this.addEmoteToCanvasAndDrawables(drawableEmote);
            });
        }
    }
    addGroupedEmoteToContainer(emoteCodes) {
        let numEmotes = math_helper_1.randomNumberBetween(1, 2);
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
            }, math_helper_1.randomNumberBetween(100, 500));
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
            var _a, _b;
            if (((_a = emote) === null || _a === void 0 ? void 0 : _a.lifespan) < 0) {
                emote.htmlElement.remove();
            }
            return ((_b = emote) === null || _b === void 0 ? void 0 : _b.lifespan) > 0;
        });
    }
    checkForExplodedEmotes() {
        const explodedEmotes = this.emoteFactory.checkForExplodedEmotes(this.emotesToDraw);
        if (explodedEmotes.length > 0) {
            explodedEmotes.forEach((emote) => {
                this.addEmoteToCanvasAndDrawables(emote);
            });
        }
    }
}
exports.EmoteWidget = EmoteWidget;
