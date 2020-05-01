export class Emote {

    id: string;
    code: string;
    url: string;
    scale: number;
    type: string; // 'twitch', 'bttv'
    emoticon_set: number;
    channelPointModifier: string = '';
    channel: string = '';
    imageType: string = '';


    constructor(scale: number, url: string, code: string, id: string, type: string, emoteSetId: number = -1) {
        this.url = url;
        this.scale = scale;
        this.code = code;
        this.id = id;
        this.type = type;
        this.emoticon_set = emoteSetId;
    }
}

export class BttvEmoteResponse {
    urlTemplate: string;
    emotes: Emote[];

    constructor(urlTemplate: string, emotes: Emote[]) {
        this.urlTemplate = urlTemplate;
        this.emotes = emotes;
    }
}

export class TwitchEmoteResponse {
    channelId: string;
    channelName: string;
    channelDisplayName: string;
    emotes: Emote[];
    subBadges: SubBadge[];

    constructor(channelId: string, channeName: string, channelDisplayName: string, emotes: Emote[], subBadges: SubBadge[]) {
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