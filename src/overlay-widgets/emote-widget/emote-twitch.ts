import { Emote } from "./emote";

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
    code: string;
    emoticon_set: number;
    id: number;

    constructor(code: string, emoticon_set: number, id: number) {
        super();
        this.code = code;
        this.emoticon_set = emoticon_set;
        this.id = id;
    }

    convertScaleToPixels(): { width: number, height: number } {
        if (this.emoticon_set === 42) {
            return { width: 20 * this.scale, height: 18 * this.scale };
        } else {
            return super.convertScaleToPixels();
        }
    }

    setUrl() {
        this.url = `https://static-cdn.jtvnw.net/emoticons/v1/${this.id}/${this.scale}.0`;
    }
}