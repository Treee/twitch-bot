"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}
exports.Vector2 = Vector2;
class DrawableEmote {
    constructor(position = new Vector2(), velocity = new Vector2(), lifespan = 0, size, imageSrc) {
        this.opacity = 1;
        this.angularVelocityDegrees = 0;
        this.degreesRotation = 0;
        this.position = position;
        this.velocity = velocity;
        this.lifespan = lifespan;
        this.imageSrc = imageSrc;
        this.htmlElement = this.createHtmlElement('emote', imageSrc, size);
        this.translate(position.x, position.y);
    }
    createHtmlElement(cssClass, imageUrl, size) {
        const element = $('<div></div>').addClass(cssClass);
        element.width(`${size.x}px`);
        element.height(`${size.y}px`);
        element.css('background', `url("${imageUrl}")`);
        element.css('background-size', 'cover');
        return element;
    }
    translate(x, y) {
        return `translate(${x}px, ${y}px)`;
    }
    rotate(degrees) {
        return `rotate(${degrees}deg)`;
    }
    applyTransform() {
        const translation = this.translate(this.position.x, this.position.y);
        const rotation = this.rotate(this.degreesRotation);
        this.htmlElement.css('transform', `${translation} ${rotation}`);
    }
    calculateNextMoveFrame(dt) {
        return new Vector2(this.position.x + this.velocity.x, this.position.y + this.velocity.y);
    }
    calculateNextRotationFrame(dt) {
        let nextRotation = this.degreesRotation + this.angularVelocityDegrees;
        if (nextRotation > 360) {
            nextRotation = nextRotation - 360;
        }
        return nextRotation;
    }
    isHidden() {
        return this.lifespan < 0;
    }
    modifyOpacity(dt) {
        this.opacity -= dt;
        this.htmlElement.css('opacity', `${this.opacity}`);
    }
    doUpdate(dt) {
        this.lifespan -= dt;
        if (!this.isHidden()) {
            this.position = this.calculateNextMoveFrame(dt);
            this.degreesRotation = this.calculateNextRotationFrame(dt);
        }
        if (this.lifespan < 1) {
            this.modifyOpacity(dt);
        }
    }
    draw() {
        this.applyTransform();
    }
}
exports.DrawableEmote = DrawableEmote;
