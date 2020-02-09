import { EmoteWidgetConfig } from './emote-widget-config';
import { Vector2, RenderableObject } from './emotes/emote-interfaces';
import { RainingEmote } from './emotes/raining-emote';
import { FireworkEmote } from './emotes/firework-emote';
import { randomNumberBetween } from '../../helpers/math-helper';

import { EmoteFactory } from './emotes/emote-factory';

export class EmoteWidget {
    emoteFactory: EmoteFactory;
    emoteConfig: EmoteWidgetConfig;
    emotesToDraw: RenderableObject[] = [];

    constructor(emoteConfig: EmoteWidgetConfig, emoteFactory: EmoteFactory) {
        this.emoteConfig = emoteConfig;
        this.emoteFactory = emoteFactory;
    }

    private getDrawableEmoteByCode(emoteCodes: string[]): RenderableObject {
        let drawable: RenderableObject = this.emoteFactory.createFireworkEmote(emoteCodes, this.getViewWidth(), this.getViewHeight());
        const randomAnimationType = randomNumberBetween(1, 3);
        if (randomAnimationType === 2) {
            drawable = this.emoteFactory.createWavyEmote(emoteCodes, this.getViewWidth(), this.getViewHeight());
        } if (randomAnimationType === 3) {
            drawable = this.emoteFactory.createFireworkEmote(emoteCodes, this.getViewWidth(), this.getViewHeight());
        }
        return drawable;
    }

    public addEmoteToContainer(emoteCodes: string[]) {
        let numEmotes = randomNumberBetween(1, 2);
        for (let index = 0; index < numEmotes; index++) {
            emoteCodes.forEach((emote) => {
                const drawableEmote = this.getDrawableEmoteByCode([emote]);
                this.addEmoteToCanvasAndDrawables(drawableEmote);
            });
        }
    }

    public addGroupedEmoteToContainer(emoteCodes: string[]) {
        let numEmotes = randomNumberBetween(1, 2);
        for (let index = 0; index < numEmotes; index++) {
            const drawableEmote = this.getDrawableEmoteByCode(emoteCodes);
            this.addEmoteToCanvasAndDrawables(drawableEmote);
        }
    }

    addEmoteToCanvasAndDrawables(drawable: RenderableObject) {
        if (drawable?.htmlElement) {
            setTimeout(() => {
                if (drawable.htmlElement) {
                    $(`.emote-container`).append(drawable.htmlElement);
                }
            }, randomNumberBetween(100, 500));
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
        const emote = this.emoteFactory.getEmoteByCode(emoteCode);

        const randomNumberOfEmoteParticles = randomNumberBetween(5, 12);
        for (let numEmotes = 0; numEmotes < randomNumberOfEmoteParticles; numEmotes++) {
            const randomLifespan = randomNumberBetween(1, 2);
            const randomAngularVelocity = randomNumberBetween(-4, 4);
            emote.setScale(randomNumberBetween(1, 2));
            emote.setUrl();
            const emoteSize = emote.convertScaleToPixels();
            const randomDegrees = randomNumberBetween(0, 360);
            const theta = randomDegrees * radians; // some random number between 0 and 2pi
            const randomVelocity = new Vector2(Math.cos(theta), Math.sin(theta));

            const fireworkEmote = new RainingEmote(position, randomVelocity, randomLifespan, emoteSize, [emote.url], randomAngularVelocity);
            this.addEmoteToCanvasAndDrawables(fireworkEmote);
        }
    }
}