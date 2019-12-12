"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matter_js_1 = require("matter-js");
class PhysicsEngine {
    constructor() {
        this.engine = matter_js_1.Engine.create();
        this.render = matter_js_1.Render.create({
            element: document.getElementById('physicsWidgetDisplay') || undefined,
            engine: this.engine,
            options: {
                width: 1280,
                height: 720
            }
        });
        this.createObjects();
        matter_js_1.Engine.run(this.engine);
        matter_js_1.Render.run(this.render);
    }
    createObjects() {
        const vw = this.getViewWidth();
        const vh = this.getViewHeight();
        const boxA = matter_js_1.Bodies.rectangle(400, 100, 80, 80);
        const boxB = matter_js_1.Bodies.rectangle(450, 25, 80, 80);
        var ground = matter_js_1.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
        matter_js_1.World.add(this.engine.world, [boxA, boxB, ground]);
    }
    getViewHeight() {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }
    getViewWidth() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
}
exports.PhysicsEngine = PhysicsEngine;
new PhysicsEngine();
