import { Emote } from "../emote-widget/emote";

export class PhysicsEngine {
    emotes: Emote[] = [];

    constructor() {
        this.startSimulation();
    }

    startSimulation() {
        this.addEmotesToContainer(10);
        setInterval(() => {
            // console.log('bounds', this.bouncingWidget);
            this.oneLoop();
        }, 1000 / 60);
    }

    addEmotesToContainer(numEmotesToAdd: number) {
        for (let index = 0; index < numEmotesToAdd; index++) {
            const newEmote = new Emote(2, 'https://cdn.betterttv.net/emote/5d3c7708c77b14468fe92fc4/2x');
            newEmote.createHtmlElement('default-emote');
            newEmote.setPosition(Math.random() * 500, Math.random() * 500);
            newEmote.setVelocity(Math.random() * 7 + 1, Math.random() * 7 + 1);
            this.emotes.push(newEmote);
        }

        this.emotes.forEach((emote) => {
            if (emote.htmlElement) {
                $('#physicsWidgetDisplay').append(emote.htmlElement);
            }
        });
    }

    oneLoop() {
        this.emotes.forEach((emote) => {
            const nextFrame = emote.calculateNextMoveFrame();
            this.checkForWindowCollision(emote, nextFrame);

            this.emotes.forEach((otherEmote) => {
                if (emote === otherEmote) {
                    return;
                }
                this.checkForEmoteCollision(emote, nextFrame, otherEmote);
            });
            emote.move();
        });
    }

    checkForEmoteCollision(emote: Emote, nextFrame: { x: number, y: number }, otherEmote: Emote) {
        const emotePixelScale = emote.convertScaleToPixels();
        const otherEmotePixelScale = otherEmote.convertScaleToPixels();

        const otherNextFrame = otherEmote.calculateNextMoveFrame();
        const middleXY = { x: nextFrame.x + emotePixelScale.width / 2, y: nextFrame.y + emotePixelScale.height / 2 };
        const otherMiddleXY = { x: otherNextFrame.x + otherEmotePixelScale.width / 2, y: otherNextFrame.y + otherEmotePixelScale.height / 2 };

        const powX = (otherMiddleXY.x - middleXY.x) * (otherMiddleXY.x - middleXY.x);
        const powY = (otherMiddleXY.y - middleXY.y) * (otherMiddleXY.y - middleXY.y);
        const distance = Math.sqrt((powX + powY));
        if (distance < ((emotePixelScale.width / 2) + (otherEmotePixelScale.width / 2))) {
            emote.velocity.x *= -1;
            otherEmote.velocity.x *= -1;
        }
        if (distance < ((emotePixelScale.height / 2) + (otherEmotePixelScale.height / 2))) {
            emote.velocity.y *= -1;
            otherEmote.velocity.y *= -1;
        }
    }

    checkForWindowCollision(emote: Emote, nextFrame: { x: number, y: number }) {
        // check for window bounding box collision
        if (emote.position.x < 0 || nextFrame.x > this.getViewWidth()) {
            emote.velocity.x *= -1;
        }
        if (emote.position.y < 0 || nextFrame.y > this.getViewHeight()) {
            emote.velocity.y *= -1;
        }
    }

    getViewHeight() {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }

    getViewWidth() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
}

new PhysicsEngine();