"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_1 = require("../emote-widget/emote");
const axis_aligned_bounding_box_1 = require("./axis-aligned-bounding-box");
const tree_math_1 = require("./tree-math");
class MovableEmote {
    constructor(emote, aabb) {
        this.emote = emote;
        this.aabb = aabb;
    }
}
exports.MovableEmote = MovableEmote;
class PhysicsEngine {
    constructor() {
        this.emotes = [];
        this.emotes1 = [];
        this.startSimulation();
    }
    startSimulation() {
        this.addEmotesToContainer(1);
        let dt = 0.016;
        setInterval(() => {
            // console.log('bounds', this.bouncingWidget);
            this.oneLoop(dt);
        }, 1000 / 60);
    }
    addEmotesToContainer(numEmotesToAdd) {
        // for (let index = 0; index < numEmotesToAdd; index++) {
        //     const newEmote = new Emote(2, 'https://cdn.betterttv.net/emote/5d3c7708c77b14468fe92fc4/2x');
        //     newEmote.createHtmlElement('default-emote');
        //     newEmote.setPosition(Math.random() * 500, Math.random() * 500);
        //     newEmote.setVelocity(Math.random() * 7 + 1, Math.random() * 7 + 1);
        //     this.emotes.push(newEmote);
        // }
        for (let index = 0; index < numEmotesToAdd; index++) {
            const newEmote = new emote_1.Emote(2, 'https://cdn.betterttv.net/emote/5d3c7708c77b14468fe92fc4/2x');
            newEmote.createHtmlElement('default-emote');
            const center = new tree_math_1.Vector2(Math.random() * 500, Math.random() * 500);
            const radius = new tree_math_1.Vector2(28, 28);
            const velocity = new tree_math_1.Vector2(0, 1);
            const acceleration = new tree_math_1.Vector2();
            const aabb = new axis_aligned_bounding_box_1.AABB(center, radius, velocity, acceleration);
            newEmote.moveTo(center.values[0] - radius.values[0], center.values[1] - radius.values[1]);
            this.emotes1.push(new MovableEmote(newEmote, aabb));
        }
        // this.emotes.forEach((emote) => {
        //     if (emote.htmlElement) {
        //         $('#physicsWidgetDisplay').append(emote.htmlElement);
        //     }
        // });
        this.emotes1.forEach((movableEmote) => {
            if (movableEmote.emote.htmlElement) {
                $('#physicsWidgetDisplay').append(movableEmote.emote.htmlElement);
            }
        });
    }
    oneLoop(dt) {
        // this.emotes.forEach((emote) => {
        //     const nextFrame = emote.calculateNextMoveFrame();
        //     this.checkForWindowCollision(emote, nextFrame);
        //     this.emotes.forEach((otherEmote) => {
        //         if (emote === otherEmote) {
        //             return;
        //         }
        //         this.checkForEmoteCollision(emote, nextFrame, otherEmote);
        //     });
        //     emote.move();
        // });
        this.emotes1.forEach((movableEmote) => {
            this.checkForWindowCollision(movableEmote, dt);
            this.emotes1.forEach((otherMovableEmote) => {
                if (movableEmote === otherMovableEmote) {
                    return;
                }
                this.checkForEmoteCollision(movableEmote, otherMovableEmote, dt);
            });
            movableEmote.aabb.center.values[0] += (movableEmote.aabb.velocity.values[0]);
            movableEmote.aabb.center.values[1] -= (movableEmote.aabb.velocity.values[1]);
            movableEmote.emote.moveTo(movableEmote.aabb.center.values[0], movableEmote.aabb.center.values[1]);
        });
    }
    checkForEmoteCollision(movable, otherMovable, dt) {
        if (movable.aabb.isCollidingWith(otherMovable.aabb, dt)) {
            const tempValues = movable.aabb.velocity.values.slice();
            movable.aabb.velocity.values = otherMovable.aabb.velocity.values;
            otherMovable.aabb.velocity.values = tempValues;
            console.log('collide with emote');
        }
    }
    // checkForEmoteCollision(emote: Emote, nextFrame: { x: number, y: number }, otherEmote: Emote) {
    //     const emotePixelScale = emote.convertScaleToPixels();
    //     const otherEmotePixelScale = otherEmote.convertScaleToPixels();
    //     const otherNextFrame = otherEmote.calculateNextMoveFrame();
    //     const middleXY = { x: nextFrame.x + emotePixelScale.width / 2, y: nextFrame.y + emotePixelScale.height / 2 };
    //     const otherMiddleXY = { x: otherNextFrame.x + otherEmotePixelScale.width / 2, y: otherNextFrame.y + otherEmotePixelScale.height / 2 };
    //     const powX = (otherMiddleXY.x - middleXY.x) * (otherMiddleXY.x - middleXY.x);
    //     const powY = (otherMiddleXY.y - middleXY.y) * (otherMiddleXY.y - middleXY.y);
    //     const distance = Math.sqrt((powX + powY));
    //     if (distance < ((emotePixelScale.width / 2) + (otherEmotePixelScale.width / 2))) {
    //         emote.velocity.x *= -1;
    //         otherEmote.velocity.x *= -1;
    //     }
    //     if (distance < ((emotePixelScale.height / 2) + (otherEmotePixelScale.height / 2))) {
    //         emote.velocity.y *= -1;
    //         otherEmote.velocity.y *= -1;
    //     }
    // }
    checkForWindowCollision(movable, dt) {
        const vw = this.getViewWidth() * 0.75;
        const halfVW = vw / 2;
        const vh = this.getViewHeight();
        const halfVH = vh / 2;
        const northWall = new axis_aligned_bounding_box_1.AABB(new tree_math_1.Vector2(halfVW, 0), new tree_math_1.Vector2(halfVW, 1));
        const southWall = new axis_aligned_bounding_box_1.AABB(new tree_math_1.Vector2(halfVW, vh), new tree_math_1.Vector2(halfVW, 1));
        const eastWall = new axis_aligned_bounding_box_1.AABB(new tree_math_1.Vector2(vw, halfVH), new tree_math_1.Vector2(1, halfVH));
        const westWall = new axis_aligned_bounding_box_1.AABB(new tree_math_1.Vector2(0, halfVH), new tree_math_1.Vector2(1, halfVH));
        // document.getElementById('north')?.setAttribute('style', `top:${northWall.center.values[1] - northWall.extents.values[1]}px; left:${northWall.center.values[0] - northWall.extents.values[0]}px; width:${northWall.extents.values[0] * 2}px; height:${northWall.extents.values[1] * 2}px`);
        // document.getElementById('south')?.setAttribute('style', `top:${southWall.center.values[1] - southWall.extents.values[1]}px; left:${southWall.center.values[0] - southWall.extents.values[0]}px; width:${southWall.extents.values[0] * 2}px; height:${southWall.extents.values[1] * 2}px`);
        // document.getElementById('east')?.setAttribute('style', `top:${eastWall.center.values[1] - eastWall.extents.values[1]}px; left:${eastWall.center.values[0] - eastWall.extents.values[0]}px; width:${eastWall.extents.values[0] * 2}px; height:${eastWall.extents.values[1] * 2}px`);
        // document.getElementById('west')?.setAttribute('style', `top:${westWall.center.values[1] - westWall.extents.values[1]}px; left:${westWall.center.values[0] - westWall.extents.values[0]}px; width:${westWall.extents.values[0] * 2}px; height:${westWall.extents.values[1] * 2}px`);
        if (movable.aabb.isCollidingWith(northWall, dt)) {
            movable.aabb.velocity.values[1] *= -1;
            console.log('north wall collision');
        }
        else if (movable.aabb.isCollidingWith(southWall, dt)) {
            movable.aabb.velocity.values[1] *= -1;
            console.log('south wall collision');
        }
        else if (movable.aabb.isCollidingWith(eastWall, dt)) {
            movable.aabb.velocity.values[0] *= -1;
            console.log('east wall collision');
        }
        else if (movable.aabb.isCollidingWith(westWall, dt)) {
            movable.aabb.velocity.values[0] *= -1;
            console.log('west wall collision');
        }
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
