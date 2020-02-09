"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `(${this.x},${this.y})`;
    }
}
exports.Vector2 = Vector2;
class RenderableObject {
    constructor() { }
    createHtmlElements(cssClass, imageUrls, size) {
        throw new Error('createHtmlElements is not implemented in abstract class RenderableObject');
    }
    createHtmlElement(cssClass, imageSrc, size) {
        throw new Error('createHtmlElement is not implemented in abstract class RenderableObject');
    }
    doUpdate(dt) {
        throw new Error('doUpdate is not implemented in abstract class RenderableObject');
    }
    draw() {
        throw new Error('draw is not implemented in abstract class RenderableObject');
    }
}
exports.RenderableObject = RenderableObject;
