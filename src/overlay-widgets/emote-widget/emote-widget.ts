import { EmoteWidgetConfig } from "./emote-widget-config";
import { Emote } from "./emote";
import { SubBadge, TwitchEmote } from "./emote-twitch";
import { BttvEmote } from "./emote-bttv";

export class EmoteWidget {
    emoteConfig: EmoteWidgetConfig;
    twitchSubBadges: SubBadge[] = [];
    twitchEmotes: TwitchEmote[] = [];
    bttvEmotes: BttvEmote[] = [];
    // emoteSuffixes: string[] = ['_SA', '_BW', '_HF', '_VF', '_SQ', '_TK', '_SG', '_RD'];

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

    getEmoteFromCode(emoteCode: string): TwitchEmote | BttvEmote | undefined {
        let newEmote: TwitchEmote | BttvEmote = this.getSpecificTwitchEmote(emoteCode);

        if (newEmote.code === '') {
            newEmote = this.getSpecificBttvEmote(emoteCode);
        }

        return newEmote;
    }

    getSpecificTwitchEmote(emoteCode: string): TwitchEmote {
        let formattedEmoteCode = emoteCode;
        const emoteSuffix = emoteCode.split('_');
        if (emoteSuffix.length > 1) {
            formattedEmoteCode = emoteSuffix[0];
        }


        let emote = this.twitchEmotes.find((emote: TwitchEmote) => {
            return emote.code === formattedEmoteCode;
        });
        if (!!emote) {
            if (emoteSuffix.length > 1) {
                emote.channelPointModifier = `_${emoteSuffix[1]}`;
            }
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

    getRandomEmote(): TwitchEmote | BttvEmote {
        const emoteChoices: any[] = [];

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

    addEmoteToContainer(emoteContainerClass: string, emoteCssClass: string, emoteCode: string) {
        let newEmote;
        let numExtraEmotes = -1;
        if (emoteCode === '') {
            // get a random emote code or w/e
            newEmote = this.getRandomEmote();
        } else {
            newEmote = this.getEmoteFromCode(emoteCode);
            numExtraEmotes = this.randomNumberBetween(2, 7);
        }

        if (numExtraEmotes > -1) {
            for (let index = 0; index < numExtraEmotes; index++) {
                newEmote?.createHtmlElement(emoteCssClass);
                newEmote?.randomizeEmoteAnimation();
                if (newEmote?.htmlElement) {
                    $(`.${emoteContainerClass}`).append(newEmote.htmlElement);
                }

                // remove the elment
                setTimeout((emote) => {
                    emote.htmlElement.hide(1);
                }, (newEmote?.lifespan || 0) * 1000 + 1000, newEmote)
            }
        } else {
            newEmote?.createHtmlElement(emoteCssClass);
            newEmote?.randomizeEmoteAnimation();
            if (newEmote?.htmlElement) {
                $(`.${emoteContainerClass}`).append(newEmote.htmlElement);
            }

            // remove the elment
            setTimeout((emote) => {
                emote.htmlElement.hide(1);
            }, (newEmote?.lifespan || 0) * 1000 + 1000, newEmote)
        }
    }

    randomNumberBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}