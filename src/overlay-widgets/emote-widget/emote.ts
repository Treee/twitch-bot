export class Emote {
    url: string;
    scale: number = 1;
    position: { x: number, y: number } = { x: 0, y: 0 };
    velocity: { x: number, y: number } = { x: 0, y: 0 };
    lifespan: number = 0;
    htmlElement: JQuery | undefined;

    constructor(scale: number = 1, url: string = '') {
        this.url = url;
        this.scale = scale;
    }

    setPosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
    }

    setVelocity(x: number, y: number) {
        this.velocity.x = x;
        this.velocity.y = y;
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

    move() {
        if (this.htmlElement) {
            this.htmlElement.css('transform', `translate(${this.position.x += this.velocity.x}px, ${this.position.y += this.velocity.y}px)`);
        }
    }

    calculateNextMoveFrame() {
        const emotePixelScale = this.convertScaleToPixels();
        return { x: (this.position.x + this.velocity.x + emotePixelScale.width), y: (this.position.y + this.velocity.y + emotePixelScale.height) };
    }

    private randomNumberBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
