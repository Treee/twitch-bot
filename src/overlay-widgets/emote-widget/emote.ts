import { Vector2 } from "./emote-interfaces";

export abstract class Emote {

    code: string;
    url: string;
    scale: number;

    constructor(scale: number, url: string, code: string) {
        this.url = url;
        this.scale = scale;
        this.code = code;
    }

    setScale(size: number) {
        this.scale = size;
    }

    convertScaleToPixels(): Vector2 {
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
        return new Vector2(emoteWidth, emoteHeight);
    }

    // randomizeEmoteAnimation() {
    //     // move across the top of the screen
    //     // randomize the lifetime of the animation
    //     this.lifespan = this.randomNumberBetween(2.5, 8.5);
    //     this.htmlElement?.css({
    //         'left': `${this.randomNumberBetween(0, 95)}vw`,
    //         'top': `-${this.convertScaleToPixels().y}px`,
    //         '-webkit-animation': `raining-rotating ${this.lifespan}s none linear, fade-out ${this.lifespan}s none linear`,
    //     });
    // }

    setUrl() {
        throw new Error('Set Url Not Implemented In Abstract Class');
    }
}
