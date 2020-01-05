"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}
exports.Vector2 = Vector2;
class RenderableObject {
    constructor() { }
    doUpdate(dt) {
        throw new Error('doUpdate is not implemented in abstract class RenderableObject');
    }
    draw() {
        throw new Error('draw is not implemented in abstract class RenderableObject');
    }
}
exports.RenderableObject = RenderableObject;
