import { EmoteWidgetConfig } from "./emote-widget-config";
import { Emote } from "./emotes/emote";
import { TwitchEmote } from "./emotes/emote";
import { DrawableEmote, Vector2 } from "./emotes/emote-interfaces";

export class EmoteWidget {
    emoteConfig: EmoteWidgetConfig;
    masterEmotes: Emote[] = [];
    emotesToDraw: DrawableEmote[] = [];
    emoteSuffixes = ['_SA', '_BW', '_HF', '_VF', '_SQ', '_TK', '_SG', '_RD'];

    constructor(emoteConfig: EmoteWidgetConfig) {
        this.emoteConfig = emoteConfig;
    }

    public getEmoteCodes(): string[] {
        return this.masterEmotes.map((emote) => {
            return emote.code;
        });
    }

    private getDrawableEmoteByCode(emoteCode: string): DrawableEmote {
        const emote = this.getEmoteByCode(emoteCode);
        const randomPosition = new Vector2(this.randomNumberBetween(0, this.getViewWidth()), 0);
        const randomVelocity = new Vector2(0, this.randomNumberBetween(1, 5));
        const randomLifespan = this.randomNumberBetween(1, 5);
        emote.setScale(this.randomNumberBetween(1, 3));
        emote.setUrl();
        const emoteSize = emote.convertScaleToPixels();

        const drawable = new DrawableEmote(randomPosition, randomVelocity, randomLifespan, emoteSize, emote.url);
        drawable.angularVelocityDegrees = this.randomNumberBetween(1, 4);

        return drawable;
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
        return foundEmote;
    }

    public getRandomEmote(): Emote {
        const randomIndex = this.randomNumberBetween(0, this.masterEmotes.length - 1);
        if (this.masterEmotes.length < 1) {
            throw new Error('No Emotes in the master list.');
        }
        const randomEmote = this.masterEmotes[randomIndex];
        randomEmote.setScale(this.randomNumberBetween(1, 3));
        randomEmote.setUrl();
        return randomEmote;
    }

    private randomNumberBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public addEmoteToContainer(emoteCode: string) {
        let numEmotes = this.randomNumberBetween(3, 9);
        for (let index = 0; index < numEmotes; index++) {
            const drawableEmote = this.getDrawableEmoteByCode(emoteCode);
            this.addEmoteToCanvasAndDrawables(drawableEmote);
        }
    }

    private addEmoteToCanvasAndDrawables(drawable: DrawableEmote) {
        if (drawable?.htmlElement) {
            setTimeout(() => {
                $(`.emote-container`).append(drawable.htmlElement);
            }, this.randomNumberBetween(100, 500));
        }
        this.emotesToDraw.push(drawable);
    }

    private getViewHeight() {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }

    private getViewWidth() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }

    startSimulation() {
        let dt = 0.016;
        setInterval(() => {
            this.oneLoop(dt);
        }, 1000 / 60);
    }

    oneLoop(dt: number) {
        this.emotesToDraw.forEach((emote) => {
            emote.doUpdate(dt);
            emote.draw();
        });

        this.pruneRemainingEmotes();
    }

    pruneRemainingEmotes() {
        this.emotesToDraw = this.emotesToDraw.filter((emote) => {
            return emote.lifespan > 0;
        });
    }
}