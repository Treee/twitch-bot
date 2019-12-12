"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Emote {
    constructor(scale = 1, url = '') {
        this.scale = 1;
        this.url = url;
        this.scale = scale;
    }
    setScale(size) {
        this.scale = size;
    }
    convertScaleToPixels() {
        let emoteWidth = 0, emoteHeight = 0;
        if (this.scale === 1) {
            emoteWidth = 28;
            emoteHeight = 28;
        }
        else if (this.scale === 2) {
            emoteWidth = 56;
            emoteHeight = 56;
        }
        else if (this.scale === 3) {
            emoteWidth = 112;
            emoteHeight = 112;
        }
        return { width: emoteWidth, height: emoteHeight };
    }
    randomizeEmoteAnimation(emoteElement) {
        // move across the top of the screen
        // randomize the lifetime of the animation
        const randomAnmimationLifetime = this.randomNumberBetween(2.5, 8.5);
        emoteElement.css({
            'left': `${this.randomNumberBetween(0, 95)}vw`,
            'top': `-${this.convertScaleToPixels().height}px`,
            '-webkit-animation': `raining-rotating ${randomAnmimationLifetime}s none linear, fade-out ${randomAnmimationLifetime}s none linear`,
        });
        // return the lifetime of the animation so we can kill it via DOM removal
        return randomAnmimationLifetime;
    }
    randomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
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
class BttvEmote extends Emote {
    constructor(channel, code, id, imageType) {
        super();
        this.channel = channel;
        this.code = code;
        this.id = id;
        this.imageType = imageType;
    }
    setUrl() {
        this.url = `https://cdn.betterttv.net/emote/${this.id}/${this.scale}x`;
    }
}
exports.BttvEmote = BttvEmote;
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
class TwitchEmote extends Emote {
    constructor(code, emoticon_set, id) {
        super();
        this.code = code;
        this.emoticon_set = emoticon_set;
        this.id = id;
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
        this.url = `https://static-cdn.jtvnw.net/emoticons/v1/${this.id}/${this.scale}.0`;
    }
}
exports.TwitchEmote = TwitchEmote;
