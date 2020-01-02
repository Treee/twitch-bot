"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_1 = require("./emote");
class BttvEmoteResponse {
    constructor(urlTemplate, emotes) {
        this.urlTemplate = urlTemplate;
        this.emotes = emotes;
    }
}
exports.BttvEmoteResponse = BttvEmoteResponse;
class BttvEmote extends emote_1.Emote {
    constructor(channel, code, id, imageType) {
        super(1, '', code);
        this.channel = channel;
        this.code = code;
        this.id = id;
        this.imageType = imageType;
        this.setUrl();
    }
    setUrl() {
        this.url = `https://cdn.betterttv.net/emote/${this.id}/${this.scale}x`;
    }
}
exports.BttvEmote = BttvEmote;
