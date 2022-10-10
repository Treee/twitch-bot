"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubBadge = exports.TwitchEmoteResponse = exports.BttvEmoteResponse = exports.Emote = void 0;
class Emote {
    constructor(scale, url, code, id, type, emoteSetId = -1) {
        this.channelPointModifier = '';
        this.channel = '';
        this.imageType = '';
        this.url = url;
        this.scale = scale;
        this.code = code;
        this.id = id;
        this.type = type;
        this.emoticon_set = emoteSetId;
    }
}
exports.Emote = Emote;
class BttvEmoteResponse {
    constructor(urlTemplate, emotes) {
        this.urlTemplate = urlTemplate;
        this.emotes = emotes;
    }
}
exports.BttvEmoteResponse = BttvEmoteResponse;
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
