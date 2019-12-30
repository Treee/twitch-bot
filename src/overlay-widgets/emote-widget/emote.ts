export abstract class Emote {
    code: string;
    url: string;
    scale: number;
    lifespan: number = 0;
    htmlElement: JQuery | undefined;

    constructor(scale: number, url: string, code: string) {
        this.url = url;
        this.scale = scale;
        this.code = code;
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

    randomizeEmoteAnimation() {
        // move across the top of the screen
        // randomize the lifetime of the animation
        this.lifespan = this.randomNumberBetween(2.5, 8.5);
        this.htmlElement?.css({
            'left': `${this.randomNumberBetween(0, 95)}vw`,
            'top': `-${this.convertScaleToPixels().height}px`,
            '-webkit-animation': `raining-rotating ${this.lifespan}s none linear, fade-out ${this.lifespan}s none linear`,
        });
    }

    createHtmlElement(emoteCssClass: string) {
        this.htmlElement = $('<div></div>').addClass(emoteCssClass);
        const emoteSize = this.convertScaleToPixels();
        this.htmlElement.width(`${emoteSize.width}px`);
        this.htmlElement.height(`${emoteSize.height}px`);
        this.htmlElement.css('background', `url("${this.url}")`);
        this.htmlElement.css('background-size', 'cover');
    }

    // x and y should be in pixel coordinates
    moveTo(x: number, y: number) {
        if (this.htmlElement) {
            this.htmlElement.css('transform', `translate(${x}px, ${y}px)`);
        }
    }

    setUrl() {
        throw new Error('Set Url Not Implemented In Abstract Class');
    }

    // calculateNextMoveFrame() {
    //     const emotePixelScale = this.convertScaleToPixels();
    //     return { x: (this.position.x + this.velocity.x + emotePixelScale.width), y: (this.position.y + this.velocity.y + emotePixelScale.height) };
    // }

    private randomNumberBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
