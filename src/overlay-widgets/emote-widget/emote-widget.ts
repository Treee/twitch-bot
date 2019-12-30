import { EmoteWidgetConfig } from "./emote-widget-config";
import { Emote } from "./emote";

export class EmoteWidget {
    emoteConfig: EmoteWidgetConfig;
    masterEmotes: Emote[] = [];

    constructor(emoteConfig: EmoteWidgetConfig) {
        this.emoteConfig = emoteConfig;
    }

    public getEmoteCodes(): string[] {
        return this.masterEmotes.map((emote) => {
            return emote.code;
        });
    }

    private getEmoteByCode(emoteCode: string): Emote {
        const foundEmote = this.masterEmotes.find((emote) => {
            return emote.code === emoteCode;
        });
        if (!foundEmote) {
            throw new Error(`No emote found for code: ${emoteCode}.`);
        }
        return foundEmote;
    }

    public getRandomEmote(): Emote {
        const randomIndex = this.randomNumberBetween(0, this.masterEmotes.length - 1);
        if (this.masterEmotes.length < 1) {
            throw new Error('No Emotes in the master list.');
        }
        return this.masterEmotes[randomIndex];
    }

    private randomNumberBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public addEmoteToContainer(emoteCode: string) {
        let newEmote = this.getRandomEmote();
        let numEmotes = 1;
        if (emoteCode !== '') {
            newEmote = this.getEmoteByCode(emoteCode);
            numEmotes = this.randomNumberBetween(2, 7);
        }
        for (let index = 0; index < numEmotes; index++) {
            newEmote?.setScale(this.randomNumberBetween(1, 3));
            newEmote?.setUrl();
            newEmote?.createHtmlElement('emote');
            newEmote?.randomizeEmoteAnimation();
            if (newEmote?.htmlElement) {
                $(`.emote-container`).append(newEmote.htmlElement);
            }

            // remove the elment
            setTimeout((emote) => {
                emote.htmlElement.hide(1);
            }, (newEmote?.lifespan || 0) * 1000 + 1000, newEmote)
        }
    }
}