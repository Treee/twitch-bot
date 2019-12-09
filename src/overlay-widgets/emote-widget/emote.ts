
export class Emote {
    url: string;
    scale: number = 1;

    constructor(scale: number = 1, url: string = '') {
        this.url = url;
        this.scale = scale;
    }

    setScale(size: number) {
        this.scale = size;
    }

    convertScaleToPixels(): { width: number, height: number } {
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

    randomizeEmoteAnimation(emoteElement: JQuery) {
        // move across the top of the screen
        emoteElement.css('left', `${this.randomNumberBetween(0, 93)}vw`);

        // randomize the lifetime of the animation
        let randomAnmimationLifetime = this.randomNumberBetween(2.5, 8.5);
        emoteElement.css('-webkit-animation', `raining-rotating ${randomAnmimationLifetime}s none linear, fade-out ${randomAnmimationLifetime}s none linear`);

        // return the lifetime of the animation so we can kill it via DOM removal
        return randomAnmimationLifetime;
    }

    private randomNumberBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

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

    setUrl() {
        this.url = `https://static-cdn.jtvnw.net/emoticons/v1/${this.id}/${this.scale}.0`;
    }
}