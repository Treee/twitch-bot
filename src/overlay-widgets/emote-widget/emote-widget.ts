import { EmoteWidgetConfig } from "./emote-widget-config";
import { Emote } from "./emote";
import { TwitchEmote } from "./emote-twitch";

export class EmoteWidget {
    emoteConfig: EmoteWidgetConfig;
    masterEmotes: Emote[] = [];
    emotesToDraw: Emote[] = [];
    emoteSuffixes = ['_SA', '_BW', '_HF', '_VF', '_SQ', '_TK', '_SG', '_RD'];

    constructor(emoteConfig: EmoteWidgetConfig) {
        this.emoteConfig = emoteConfig;
    }

    public getEmoteCodes(): string[] {
        return this.masterEmotes.map((emote) => {
            return emote.code;
        });
    }

    private getEmoteByCode(emoteCode: string): Emote {
        const splitCode = emoteCode.split('_');
        if (splitCode.length === 2) {
            emoteCode = splitCode[0];
        }

        const foundEmote = this.masterEmotes.find((emote) => {
            return emote.code === emoteCode;
        });

        if (splitCode.length === 2) {
            (foundEmote as TwitchEmote).channelPointModifier = `_${splitCode[1]}`;
        }

        if (!foundEmote) {
            throw new Error(`No emote found for code: ${emoteCode}.`);
        }
        foundEmote.setScale(this.randomNumberBetween(1, 3));
        foundEmote.setUrl();
        foundEmote.createHtmlElement('emote');
        return foundEmote.clone();
    }

    public getRandomEmote(): Emote {
        const randomIndex = this.randomNumberBetween(0, this.masterEmotes.length - 1);
        if (this.masterEmotes.length < 1) {
            throw new Error('No Emotes in the master list.');
        }
        const randomEmote = this.masterEmotes[randomIndex];
        randomEmote.setScale(this.randomNumberBetween(1, 3));
        randomEmote.setUrl();
        randomEmote.createHtmlElement('emote');
        return randomEmote.clone();
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

    addEmoteToCanvasAndDrawables(emote: Emote) {
        if (emote?.htmlElement) {
            $(`.emote-container`).append(emote.htmlElement);
            emote.moveTo(this.randomNumberBetween(0, this.getViewWidth()), 0);
            emote.velocity.y = this.randomNumberBetween(1, 7);
        }
        this.emotesToDraw.push(emote);
    }
    private getViewHeight() {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }

    private getViewWidth() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    startSimulation() {
        this.addEmoteToCanvasAndDrawables(this.getEmoteByCode('itsatrEeCool'));
        this.addEmoteToCanvasAndDrawables(this.getEmoteByCode('itsatrEeCool'));
        // let dt = 0.016;
        setInterval(() => {
            this.oneLoop();
        }, 1000 / 60);
    }

    oneLoop() {
        this.emotesToDraw.forEach((emote) => {
            const nextFrame = emote.calculateNextMoveFrame();
            emote.moveTo(nextFrame.x, nextFrame.y);
        })
    }
}