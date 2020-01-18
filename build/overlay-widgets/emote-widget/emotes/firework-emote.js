"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_interfaces_1 = require("./emote-interfaces");
class FireworkEmote extends emote_interfaces_1.RenderableObject {
    constructor(position = new emote_interfaces_1.Vector2(), velocity = new emote_interfaces_1.Vector2(), lifespan = 0, size, imageSrc, angularVelocity) {
        super();
        this.code = '';
        this.opacity = 1;
        this.angularVelocityDegrees = 0;
        this.degreesRotation = 0;
        this.acceleration = new emote_interfaces_1.Vector2(0, -1);
        this.isExploded = false;
        this.position = position;
        this.velocity = velocity;
        this.lastFrameVelocity = velocity;
        this.lifespan = lifespan;
        this.imageSrc = imageSrc;
        this.angularVelocityDegrees = angularVelocity;
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
    accelerate(dt) {
        // this.acceleration.x -= dt;
        this.acceleration.y += dt;
        this.lastFrameVelocity = new emote_interfaces_1.Vector2(this.velocity.x, this.velocity.y);
        this.velocity = new emote_interfaces_1.Vector2(this.velocity.x + (this.acceleration.x * dt), this.velocity.y + (this.acceleration.y * dt));
        // console.log(`Accel: ${this.acceleration} Last Frame: ${this.lastFrameVelocity} Current: ${this.velocity}`);
    }
    applyTransform() {
        const translation = this.translate(this.position.x, this.position.y);
        const rotation = this.rotate(this.degreesRotation);
        this.htmlElement.css('transform', `${translation} ${rotation}`);
        this.htmlElement.css('opacity', `${this.opacity}`);
    }
    calculateNextMoveFrame(dt) {
        this.accelerate(dt);
        return new emote_interfaces_1.Vector2(this.position.x + this.velocity.x, this.position.y + this.velocity.y);
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
        this.opacity -= dt * 2;
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
exports.FireworkEmote = FireworkEmote;
