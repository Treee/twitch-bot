"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_1 = require("./emote");
const emote_interfaces_1 = require("./emote-interfaces");
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
            return new emote_interfaces_1.Vector2(20 * this.scale, 18 * this.scale);
        }
        else {
            return super.convertScaleToPixels();
        }
    }
    setUrl() {
        this.url = `https://static-cdn.jtvnw.net/emoticons/v1/${this.id}${this.channelPointModifier}/${this.scale}.0`;
    }
}
exports.TwitchEmote = TwitchEmote;
