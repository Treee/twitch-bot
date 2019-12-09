import { EmoteWidgetConfig } from "./emote-widget-config";
import { Emote, TwitchEmote, BttvEmote, SubBadge } from "./emote";

export class EmoteWidget {
    emoteConfig: EmoteWidgetConfig;
    twitchSubBadges: SubBadge[] = [];
    twitchEmotes: TwitchEmote[] = [];
    bttvEmotes: BttvEmote[] = [];

    constructor(emoteConfig: EmoteWidgetConfig) {
        this.emoteConfig = emoteConfig;
    }

    getEmoteCodes(): string[] {
        const emoteCodes: string[] = [];

        this.twitchEmotes.forEach((emote) => {
            emoteCodes.push(emote.code);
        });
        this.bttvEmotes.forEach((emote) => {
            emoteCodes.push(emote.code);
        });
        return emoteCodes;
    }

    getSpecificTwitchEmote(emoteCode: string): TwitchEmote {
        let emote = this.twitchEmotes.find((emote: TwitchEmote) => {
            return emote.code === emoteCode;
        });
        if (!!emote) {
            emote.setScale(this.randomNumberBetween(1, 3));
            emote.setUrl();
        } else {
            emote = new TwitchEmote('', -999, -999);
        }
        return emote;
    }

    getRandomTwitchEmote(): TwitchEmote {
        const emote = this.twitchEmotes[this.randomNumberBetween(0, this.twitchEmotes.length - 1)];
        emote.setScale(this.randomNumberBetween(1, 3));
        emote.setUrl();
        return emote;
    }

    getSpecificBttvEmote(emoteCode: string): BttvEmote {
        let emote = this.bttvEmotes.find((emote: BttvEmote) => {
            return emote.code === emoteCode;
        });
        if (!!emote) {
            emote.setScale(this.randomNumberBetween(1, 3));
            emote.setUrl();
        } else {
            emote = new BttvEmote('', '', '', '');
        }
        return emote;
    }

    getRandomBttvEmote(): BttvEmote {
        const emote = this.bttvEmotes[this.randomNumberBetween(0, this.bttvEmotes.length - 1)];
        emote.setScale(this.randomNumberBetween(1, 3));
        emote.setUrl();
        return emote;
    }

    getRandomEmote(): Emote {
        const emoteChoices: Emote[] = [];

        if (this.emoteConfig.showTwitch && this.twitchEmotes.length > 0) {
            emoteChoices.push(this.getRandomTwitchEmote());
        }
        if (this.emoteConfig.showBttv && this.bttvEmotes.length > 0) {
            emoteChoices.push(this.getRandomBttvEmote());
        }
        if (emoteChoices.length === 0) {
            emoteChoices.push(new Emote(1, this.emoteConfig.defaultImageUrl));
        }
        // pick a random number, if it is even make a twitch emote otherwise bttv emote. toggle
        return emoteChoices[this.randomNumberBetween(0, emoteChoices.length - 1)];
    }

    addEmoteToContainer(emoteContainerClass: string, emoteCssClass: string, specificEmote: Function | Emote) {
        let emote;
        if (specificEmote instanceof Function) {
            emote = specificEmote();
        } else {
            emote = specificEmote;
        }
        const newEmote = $('<div></div>').addClass(emoteCssClass);
        const emoteSize = emote.convertScaleToPixels();
        newEmote.width(`${emoteSize.width}px`);
        newEmote.height(`${emoteSize.height}px`);
        newEmote.css('background', `url("${emote.url}")`);
        newEmote.css('background-size', 'cover');
        const lifetimeOfElement = emote.randomizeEmoteAnimation(newEmote);
        $(`.${emoteContainerClass}`).append(newEmote);

        // remove the elment
        setTimeout((emote) => {
            emote.remove();
        }, lifetimeOfElement * 1000, newEmote)
    }

    randomNumberBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}