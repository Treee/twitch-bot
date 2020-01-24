"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_interfaces_1 = require("./emote-interfaces");
class RainingEmote extends emote_interfaces_1.RenderableObject {
    constructor(position = new emote_interfaces_1.Vector2(), velocity = new emote_interfaces_1.Vector2(), lifespan = 0, size, imageSrcs, angularVelocity) {
        super();
        this.opacity = 1;
        this.angularVelocityDegrees = 0;
        this.degreesRotation = 0;
        this.position = position;
        this.velocity = velocity;
        this.lifespan = lifespan;
        this.imageSrc = imageSrcs;
        this.angularVelocityDegrees = angularVelocity;
        this.htmlElement = this.createHtmlElements('emote', imageSrcs, size);
        this.translate(position.x, position.y);
    }
    createHtmlElements(cssClass, imageUrls, size) {
        if (imageUrls.length > 1) {
            const element = $('<div></div>').addClass('grouped-emote');
            element.height(`${size.y}px`);
            element.width(`${size.x * imageUrls.length}px`);
            imageUrls.forEach((imageUrl) => {
                element.append(this.createHtmlElement('grouped-emote-icon', imageUrl, size));
            });
            return element;
        }
        else {
            return this.createHtmlElement(cssClass, imageUrls[0], size);
        }
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
        this.htmlElement.css('opacity', `${this.opacity}`);
    }
    calculateNextMoveFrame(dt) {
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
        this.opacity -= dt;
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
exports.RainingEmote = RainingEmote;
