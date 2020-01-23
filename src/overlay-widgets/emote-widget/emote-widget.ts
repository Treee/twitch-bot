import { EmoteWidgetConfig } from './emote-widget-config';
import { Emote } from './emotes/emote';
import { TwitchEmote } from './emotes/emote';
import { Vector2, RenderableObject } from './emotes/emote-interfaces';
import { RainingEmote } from './emotes/raining-emote';
import { WavyEmote } from './emotes/wavy-emote';
import { FireworkEmote } from './emotes/firework-emote';

export class EmoteWidget {
    emoteConfig: EmoteWidgetConfig;
    masterEmotes: Emote[] = [];
    emotesToDraw: RenderableObject[] = [];
    emoteSuffixes = ['_SA', '_BW', '_HF', '_VF', '_SQ', '_TK', '_SG', '_RD'];

    constructor(emoteConfig: EmoteWidgetConfig) {
        this.emoteConfig = emoteConfig;
    }

    public getEmoteCodes(): string[] {
        return this.masterEmotes.map((emote) => {
            return emote.code;
        });
    }

    private getDrawableEmoteByCode(emoteCode: string, position?: Vector2, velocity?: Vector2, lifespan?: number, angularVelocity?: number, scale?: number, group?: number): RenderableObject {
        let drawable = this.createRainingEmote(emoteCode, position, velocity, lifespan, angularVelocity, scale);
        const randomAnimationType = group ? group : this.randomNumberBetween(1, 3);
        if (randomAnimationType === 2) {
            drawable = this.createWavyEmote(emoteCode, position, velocity, lifespan, angularVelocity, scale);
        } if (randomAnimationType === 3) {
            drawable = this.createFireworkEmote(emoteCode, position, velocity, lifespan, angularVelocity, scale);
        }
        return drawable;
    }

    createFireworkEmote(emoteCode: string, position?: Vector2, velocity?: Vector2, lifespan?: number, angularVelocity?: number, scale?: number): FireworkEmote {
        const emote = this.getEmoteByCode(emoteCode);
        const randomPosition = position ? position : new Vector2(this.randomNumberBetween(0, this.getViewWidth()), this.getViewHeight());

        const xVelocityDirection = randomPosition.x < this.getViewWidth() / 2 ? 1 : -1;

        const randomVelocity = velocity ? velocity : new Vector2(this.randomNumberBetween(1, 2) * xVelocityDirection, this.randomNumberBetween(2, 4.5) * -1);
        const randomLifespan = lifespan ? lifespan : this.randomNumberBetween(3, 4.2);
        const randomAngularVelocity = angularVelocity ? angularVelocity : this.randomNumberBetween(1, 2);

        const scalar = scale ? scale : this.randomNumberBetween(2, 3)
        emote.setScale(scalar);
        emote.setUrl();
        const emoteSize = emote.convertScaleToPixels();
        const fireworkEmote = new FireworkEmote(randomPosition, randomVelocity, randomLifespan, emoteSize, emote.url, randomAngularVelocity);
        fireworkEmote.code = emoteCode;
        return fireworkEmote;
    }

    createRainingEmote(emoteCode: string, position?: Vector2, velocity?: Vector2, lifespan?: number, angularVelocity?: number, scale?: number): RainingEmote {
        const emote = this.getEmoteByCode(emoteCode);
        const randomPosition = position ? position : new Vector2(this.randomNumberBetween(0, this.getViewWidth()), 0);
        const randomVelocity = velocity ? velocity : new Vector2(0, this.randomNumberBetween(1, 5));
        const randomLifespan = lifespan ? lifespan : this.randomNumberBetween(1, 6);
        const randomAngularVelocity = angularVelocity ? angularVelocity : this.randomNumberBetween(1, 4);

        const scalar = scale ? scale : this.randomNumberBetween(1, 3)
        emote.setScale(scalar);
        emote.setUrl();
        const emoteSize = emote.convertScaleToPixels();

        return new RainingEmote(randomPosition, randomVelocity, randomLifespan, emoteSize, emote.url, randomAngularVelocity);
    }

    createWavyEmote(emoteCode: string, position?: Vector2, velocity?: Vector2, lifespan?: number, angularVelocity?: number, scale?: number): RainingEmote {
        const emote = this.getEmoteByCode(emoteCode);
        const randomVelocity = velocity ? velocity : new Vector2(this.randomNumberBetween(1, 5), this.randomNumberBetween(1, 5));
        const randomLifespan = lifespan ? lifespan : this.randomNumberBetween(3, 9);
        const randomAngularVelocity = angularVelocity ? angularVelocity : this.randomNumberBetween(1, 4);

        const scalar = scale ? scale : this.randomNumberBetween(1, 3)
        emote.setScale(scalar);
        emote.setUrl();
        const emoteSize = emote.convertScaleToPixels();
        const randomPosition = position ? position : new Vector2(0, this.randomNumberBetween(0, this.getViewHeight() - emoteSize.y));

        const max = 2;
        const toggle = this.randomNumberBetween(1, max); //left
        if (toggle % max === 1) { // right
            randomPosition.x = this.getViewWidth();
            randomVelocity.x *= -1;
        }
        // else if (toggle % max === 2) { // top
        //     randomPosition.x = this.randomNumberBetween(0, this.getViewWidth());
        //     randomPosition.y = 0;
        // } else if (toggle % max === 3) {// bot
        //     randomPosition.x = this.randomNumberBetween(0, this.getViewWidth());
        //     randomPosition.y = this.getViewHeight();
        //     randomVelocity.y *= -1;
        // }

        return new WavyEmote(randomPosition, randomVelocity, randomLifespan, emoteSize, emote.url, randomAngularVelocity);
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
        let numEmotes = this.randomNumberBetween(1, 3);
        for (let index = 0; index < numEmotes; index++) {
            const drawableEmote = this.getDrawableEmoteByCode(emoteCode);
            this.addEmoteToCanvasAndDrawables(drawableEmote);
        }
    }

    public addGroupedEmoteToContainer(emoteCodes: string[]) {
        const drawables: RenderableObject[] = [];
        const position = new Vector2(this.randomNumberBetween(0, this.getViewWidth()), this.randomNumberBetween(0, this.getViewHeight()));
        const velocity = new Vector2(this.randomNumberBetween(1, 5), this.randomNumberBetween(1, 5));
        const lifespan = this.randomNumberBetween(2, 5);
        const angularVelocity = 0;
        const scale = this.randomNumberBetween(1, 3);
        const group = this.randomNumberBetween(1, 3);
        const pixelSize = 28;
        let emoteCounter = 0;
        emoteCodes.forEach((emoteCode) => {
            position.x = position.x + (((pixelSize * scale) * emoteCounter) * 2);
            const drawable = this.getDrawableEmoteByCode(emoteCode, position, velocity, lifespan, angularVelocity, scale, group);
            drawables.push(drawable);
        });

        drawables.forEach((drawable) => {
            this.addEmoteToCanvasAndDrawables(drawable);
        });
    }

    addEmoteToCanvasAndDrawables(drawable: RenderableObject) {
        if (drawable?.htmlElement) {
            setTimeout(() => {
                if (drawable.htmlElement) {
                    $(`.emote-container`).append(drawable.htmlElement);
                }
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
        this.checkForExplodedEmotes();
        this.pruneRemainingEmotes();
    }

    explodedEmotes: any[] = [];
    pruneRemainingEmotes() {
        this.emotesToDraw = this.emotesToDraw.filter((emote: any) => {
            return emote?.lifespan > 0;
        });
    }

    checkForExplodedEmotes() {
        const explodedEmotes = this.emotesToDraw.filter((emote: any) => {
            if (emote instanceof FireworkEmote) {
                return emote.opacity < 1 && !emote.isExploded;
            }
        });
        explodedEmotes.forEach((explodedEmote: any) => {
            this.explodeIntoEmotes(explodedEmote.code, explodedEmote.position);
            explodedEmote.isExploded = true;
        });
    }

    explodeIntoEmotes(emoteCode: string, position: Vector2) {
        const twoPi = Math.PI * 2;
        const radians = twoPi / 360;
        const emote = this.getEmoteByCode(emoteCode);

        const randomNumberOfEmoteParticles = this.randomNumberBetween(5, 12);
        for (let numEmotes = 0; numEmotes < randomNumberOfEmoteParticles; numEmotes++) {
            const randomLifespan = this.randomNumberBetween(1, 2);
            const randomAngularVelocity = this.randomNumberBetween(-4, 4);
            emote.setScale(this.randomNumberBetween(1, 2));
            emote.setUrl();
            const emoteSize = emote.convertScaleToPixels();
            const randomDegrees = this.randomNumberBetween(0, 360);
            const theta = randomDegrees * radians; // some random number between 0 and 2pi
            const randomVelocity = new Vector2(Math.cos(theta), Math.sin(theta));

            const fireworkEmote = new RainingEmote(position, randomVelocity, randomLifespan, emoteSize, emote.url, randomAngularVelocity);
            this.addEmoteToCanvasAndDrawables(fireworkEmote);
        }
    }
}