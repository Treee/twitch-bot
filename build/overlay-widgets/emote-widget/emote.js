"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_interfaces_1 = require("./emote-interfaces");
class Emote {
    constructor(scale, url, code) {
        this.url = url;
        this.scale = scale;
        this.code = code;
    }
    setScale(size) {
        this.scale = size;
    }
    convertScaleToPixels() {
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
        return new emote_interfaces_1.Vector2(emoteWidth, emoteHeight);
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
exports.Emote = Emote;
