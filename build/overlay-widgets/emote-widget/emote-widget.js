"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_1 = require("./emote");
class EmoteWidget {
    constructor(emoteConfig) {
        this.twitchSubBadges = [];
        this.twitchEmotes = [];
        this.bttvEmotes = [];
        this.emoteConfig = emoteConfig;
    }
    getEmoteCodes() {
        const emoteCodes = [];
        this.twitchEmotes.forEach((emote) => {
            emoteCodes.push(emote.code);
        });
        this.bttvEmotes.forEach((emote) => {
            emoteCodes.push(emote.code);
        });
        return emoteCodes;
    }
    getEmoteFromCode(emoteCode) {
        let newEmote = this.getSpecificTwitchEmote(emoteCode);
        if (newEmote.code === '') {
            newEmote = this.getSpecificBttvEmote(emoteCode);
        }
        return newEmote;
    }
    getSpecificTwitchEmote(emoteCode) {
        let emote = this.twitchEmotes.find((emote) => {
            return emote.code === emoteCode;
        });
        if (!!emote) {
            emote.setScale(this.randomNumberBetween(1, 3));
            emote.setUrl();
        }
        else {
            emote = new emote_1.TwitchEmote('', -999, -999);
        }
        return emote;
    }
    getRandomTwitchEmote() {
        const emote = this.twitchEmotes[this.randomNumberBetween(0, this.twitchEmotes.length - 1)];
        emote.setScale(this.randomNumberBetween(1, 3));
        emote.setUrl();
        return emote;
    }
    getSpecificBttvEmote(emoteCode) {
        let emote = this.bttvEmotes.find((emote) => {
            return emote.code === emoteCode;
        });
        if (!!emote) {
            emote.setScale(this.randomNumberBetween(1, 3));
            emote.setUrl();
        }
        else {
            emote = new emote_1.BttvEmote('', '', '', '');
        }
        return emote;
    }
    getRandomBttvEmote() {
        const emote = this.bttvEmotes[this.randomNumberBetween(0, this.bttvEmotes.length - 1)];
        emote.setScale(this.randomNumberBetween(1, 3));
        emote.setUrl();
        return emote;
    }
    getRandomEmote() {
        const emoteChoices = [];
        if (this.emoteConfig.showTwitch && this.twitchEmotes.length > 0) {
            emoteChoices.push(this.getRandomTwitchEmote());
        }
        if (this.emoteConfig.showBttv && this.bttvEmotes.length > 0) {
            emoteChoices.push(this.getRandomBttvEmote());
        }
        if (emoteChoices.length === 0) {
            emoteChoices.push(new emote_1.Emote(1, this.emoteConfig.defaultImageUrl));
        }
        // pick a random number, if it is even make a twitch emote otherwise bttv emote. toggle
        return emoteChoices[this.randomNumberBetween(0, emoteChoices.length - 1)];
    }
    addEmoteToContainer(emoteContainerClass, emoteCssClass, emoteCode) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        let newEmote;
        let numExtraEmotes = -1;
        if (emoteCode === '') {
            // get a random emote code or w/e
            newEmote = this.getRandomEmote();
        }
        else {
            newEmote = this.getEmoteFromCode(emoteCode);
            numExtraEmotes = this.randomNumberBetween(2, 7);
        }
        if (numExtraEmotes > -1) {
            for (let index = 0; index < numExtraEmotes; index++) {
                (_a = newEmote) === null || _a === void 0 ? void 0 : _a.createHtmlElement(emoteCssClass);
                (_b = newEmote) === null || _b === void 0 ? void 0 : _b.randomizeEmoteAnimation();
                if ((_c = newEmote) === null || _c === void 0 ? void 0 : _c.htmlElement) {
                    $(`.${emoteContainerClass}`).append(newEmote.htmlElement);
                }
                // remove the elment
                setTimeout((emote) => {
                    emote.htmlElement.hide(1);
                }, (((_d = newEmote) === null || _d === void 0 ? void 0 : _d.lifespan) || 0) * 1000 + 1000, newEmote);
            }
        }
        else {
            (_e = newEmote) === null || _e === void 0 ? void 0 : _e.createHtmlElement(emoteCssClass);
            (_f = newEmote) === null || _f === void 0 ? void 0 : _f.randomizeEmoteAnimation();
            if ((_g = newEmote) === null || _g === void 0 ? void 0 : _g.htmlElement) {
                $(`.${emoteContainerClass}`).append(newEmote.htmlElement);
            }
            // remove the elment
            setTimeout((emote) => {
                emote.htmlElement.hide(1);
            }, (((_h = newEmote) === null || _h === void 0 ? void 0 : _h.lifespan) || 0) * 1000 + 1000, newEmote);
        }
    }
    randomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
exports.EmoteWidget = EmoteWidget;
