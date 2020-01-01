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
    id: string;
    imageType: string;

    constructor(channel: string, code: string, id: string, imageType: string) {
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

    clone(): BttvEmote {
        const clonedEmote = new BttvEmote(this.channel, this.code, this.id, this.imageType);
        clonedEmote.lifespan = this.lifespan;
        clonedEmote.velocity = this.velocity;
        clonedEmote.htmlElement = this.htmlElement;
        return clonedEmote;
    }
}
