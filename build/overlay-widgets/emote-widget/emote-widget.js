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
    addEmoteToContainer(emoteContainerClass, emoteCssClass, specificEmote) {
        let emote;
        if (specificEmote instanceof Function) {
            emote = specificEmote();
        }
        else {
            emote = specificEmote;
        }
        const newEmote = $('<div></div>').addClass(emoteCssClass);
        const emoteSize = emote.convertScaleToPixels();
        newEmote.width(`${emoteSize.width}px`);
        newEmote.height(`${emoteSize.height}px`);
        newEmote.css('background', `url("${emote.url}")`);
        newEmote.css('background-size', 'cover');
        const lifetimeOfElement = emote.randomizeEmoteAnimation(newEmote);
        $(`.${emoteContainerClass}`).append(newEmote);
        // remove the elment
        setTimeout((emote) => {
            emote.remove();
        }, lifetimeOfElement * 1000, newEmote);
    }
    randomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
exports.EmoteWidget = EmoteWidget;
