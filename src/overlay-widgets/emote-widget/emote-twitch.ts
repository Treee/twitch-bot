import { Emote } from "./emote";
import { Vector2 } from "./emote-interfaces";

export class TwitchEmoteResponse {
    channelId: string;
    channelName: string;
    channelDisplayName: string;
    emotes: TwitchEmote[];
    subBadges: SubBadge[];

    constructor(channelId: string, channeName: string, channelDisplayName: string, emotes: TwitchEmote[], subBadges: SubBadge[]) {
        this.channelId = channelId;
        this.channelName = channeName;
        this.channelDisplayName = channelDisplayName;
        this.emotes = emotes;
        this.subBadges = subBadges;
    }
}

export class SubBadge {
    tier: number;
    displayName: string;
    imageSizes: string[]

    constructor(tier: number, displayName: string, imageSizes: string[]) {
        this.tier = tier;
        this.displayName = displayName;
        this.imageSizes = imageSizes;
    }
}

export class TwitchEmote extends Emote {
    emoticon_set: number;
    id: number;
    channelPointModifier: string = '';

    constructor(code: string = 'FrankerZ', emoticon_set: number, id: number, scale: number = 1, url: string = '') {
        super(scale, url, code);
        this.emoticon_set = emoticon_set;
        this.id = id;
        this.setUrl();
    }

    convertScaleToPixels(): Vector2 {
        if (this.emoticon_set === 42) {
            return new Vector2(20 * this.scale, 18 * this.scale);
        } else {
            return super.convertScaleToPixels();
        }
    }

    setUrl() {
        this.url = `https://static-cdn.jtvnw.net/emoticons/v1/${this.id}${this.channelPointModifier}/${this.scale}.0`;
    }
}