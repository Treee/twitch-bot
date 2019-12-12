import { Engine, Render, Bodies, World } from 'matter-js';

export class PhysicsEngine {
    engine: Engine;
    render: Render;
    constructor() {

        this.engine = Engine.create();

        this.render = Render.create({
            element: document.getElementById('physicsWidgetDisplay') || undefined,
            engine: this.engine,
            options: {
                width: 1280,
                height: 720
            }
        });
        this.createObjects();
        Engine.run(this.engine);
        Render.run(this.render);
    }

    createObjects() {
        const vw = this.getViewWidth();
        const vh = this.getViewHeight();
        const boxA = Bodies.rectangle(400, 100, 80, 80);
        const boxB = Bodies.rectangle(450, 25, 80, 80);
        var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
        World.add(this.engine.world, [boxA, boxB, ground]);
    }

    getViewHeight() {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }

    getViewWidth() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
}

new PhysicsEngine();