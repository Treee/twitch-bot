"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_1 = require("./emote");
class TwitchEmoteResponse {
    constructor(channelId, channeName, channelDisplayName, emotes, subBadges) {
        this.channelId = channelId;
        this.channelName = channeName;
        this.channelDisplayName = channelDisplayName;
        this.emotes = emotes;
        this.subBadges = subBadges;
    }
}
exports.TwitchEmoteResponse = TwitchEmoteResponse;
class SubBadge {
    constructor(tier, displayName, imageSizes) {
        this.tier = tier;
        this.displayName = displayName;
        this.imageSizes = imageSizes;
    }
}
exports.SubBadge = SubBadge;
class TwitchEmote extends emote_1.Emote {
    constructor(code = 'FrankerZ', emoticon_set, id, scale = 1, url = '') {
        super(scale, url, code);
        this.channelPointModifier = '';
        this.emoticon_set = emoticon_set;
        this.id = id;
        this.setUrl();
    }
    convertScaleToPixels() {
        if (this.emoticon_set === 42) {
            return { width: 20 * this.scale, height: 18 * this.scale };
        }
        else {
            return super.convertScaleToPixels();
        }
    }
    setUrl() {
        this.url = `https://static-cdn.jtvnw.net/emoticons/v1/${this.id}${this.channelPointModifier}/${this.scale}.0`;
    }
    clone() {
        const clonedEmote = new TwitchEmote(this.code, this.emoticon_set, this.id, this.scale, this.url);
        clonedEmote.channelPointModifier = this.channelPointModifier;
        clonedEmote.lifespan = this.lifespan;
        clonedEmote.velocity = this.velocity;
        clonedEmote.htmlElement = this.htmlElement;
        return clonedEmote;
    }
}
exports.TwitchEmote = TwitchEmote;
