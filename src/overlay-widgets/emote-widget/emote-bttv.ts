import { Emote } from "./emote";

export class BttvEmoteResponse {
    urlTemplate: string;
    emotes: BttvEmote[];

    constructor(urlTemplate: string, emotes: BttvEmote[]) {
        this.urlTemplate = urlTemplate;
        this.emotes = emotes;
    }
}

export class BttvEmote extends Emote {
    channel: string;
    code: string;
    id: string;
    imageType: string;

    constructor(channel: string, code: string, id: string, imageType: string) {
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
