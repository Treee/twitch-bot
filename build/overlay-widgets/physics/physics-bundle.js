(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_1 = require("./emote");
class TwitchEmoteResponse {
    constructor(channelId, channeName, channelDisplayName, emotes, subBadges) {
        this.channelId = channelId;
        this.channelName = channeName;
        this.channelDisplayName = channelDisplayName;
        this.emotes = emotes;
        this.subBadges = subBadges;
    }
}
exports.TwitchEmoteResponse = TwitchEmoteResponse;
class SubBadge {
    constructor(tier, displayName, imageSizes) {
        this.tier = tier;
        this.displayName = displayName;
        this.imageSizes = imageSizes;
    }
}
exports.SubBadge = SubBadge;
class TwitchEmote extends emote_1.Emote {
    constructor(code = 'FrankerZ', emoticon_set, id, scale = 1, url = '') {
        super(scale, url, code);
        this.channelPointModifier = '';
        this.emoticon_set = emoticon_set;
        this.id = id;
        this.setUrl();
    }
    convertScaleToPixels() {
        if (this.emoticon_set === 42) {
            return { width: 20 * this.scale, height: 18 * this.scale };
        }
        else {
            return super.convertScaleToPixels();
        }
    }
    setUrl() {
        this.url = `https://static-cdn.jtvnw.net/emoticons/v1/${this.id}${this.channelPointModifier}/${this.scale}.0`;
    }
    clone() {
        const clonedEmote = new TwitchEmote(this.code, this.emoticon_set, this.id, this.scale, this.url);
        clonedEmote.channelPointModifier = this.channelPointModifier;
        clonedEmote.lifespan = this.lifespan;
        clonedEmote.position = this.position;
        clonedEmote.velocity = this.velocity;
        clonedEmote.htmlElement = this.htmlElement;
        return clonedEmote;
    }
}
exports.TwitchEmote = TwitchEmote;

},{"./emote":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Emote {
    constructor(scale, url, code) {
        this.lifespan = 0;
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 1 };
        this.url = url;
        this.scale = scale;
        this.code = code;
    }
    setScale(size) {
        this.scale = size;
    }
    convertScaleToPixels() {
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
        var _a;
        // move across the top of the screen
        // randomize the lifetime of the animation
        this.lifespan = this.randomNumberBetween(2.5, 8.5);
        (_a = this.htmlElement) === null || _a === void 0 ? void 0 : _a.css({
            'left': `${this.randomNumberBetween(0, 95)}vw`,
            'top': `-${this.convertScaleToPixels().height}px`,
            '-webkit-animation': `raining-rotating ${this.lifespan}s none linear, fade-out ${this.lifespan}s none linear`,
        });
    }
    createHtmlElement(emoteCssClass) {
        this.htmlElement = $('<div></div>').addClass(emoteCssClass);
        const emoteSize = this.convertScaleToPixels();
        this.htmlElement.width(`${emoteSize.width}px`);
        this.htmlElement.height(`${emoteSize.height}px`);
        this.htmlElement.css('background', `url("${this.url}")`);
        this.htmlElement.css('background-size', 'cover');
    }
    // x and y should be in pixel coordinates
    moveTo(x, y) {
        if (this.htmlElement) {
            this.htmlElement.css('transform', `translate(${x}px, ${y}px)`);
            this.position.x = x;
            this.position.y = y;
        }
    }
    setUrl() {
        throw new Error('Set Url Not Implemented In Abstract Class');
    }
    calculateNextMoveFrame() {
        return { x: (this.position.x + this.velocity.x), y: (this.position.y + this.velocity.y) };
    }
    randomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    clone() {
        throw new Error('Not Implemented in abstract class.');
    }
}
exports.Emote = Emote;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tree_math_1 = require("./tree-math");
class AABB {
    constructor(center, extents, velocity = new tree_math_1.Vector2(), acceleration = new tree_math_1.Vector2()) {
        this.center = center;
        this.extents = extents;
        this.velocity = velocity;
        this.acceleration = acceleration;
    }
    isMoving() {
        return this.velocity.values[0] !== 0 || this.velocity.values[1] !== 0;
    }
    min() {
        return new tree_math_1.Vector2(this.center.values[0] - this.extents.values[0], this.center.values[1] - this.extents.values[1]);
    }
    max() {
        return new tree_math_1.Vector2(this.center.values[0] + this.extents.values[0], this.center.values[1] + this.extents.values[1]);
    }
    size() {
        return new tree_math_1.Vector2(this.extents.values[0] * 2, this.extents.values[1] * 2);
    }
    minkowskiDifference(other) {
        const topLeft = this.min().subtract(other.max());
        const fullSize = this.size().add(other.size());
        return new AABB(topLeft.add(fullSize.divideScalar(2)), fullSize.divideScalar(2));
    }
    isCollidingWith(other, dt) {
        const difference = this.minkowskiDifference(other);
        let colliding = false;
        const min = difference.min();
        const max = difference.max();
        let rvRayIntersection = null;
        // console.log(`dt:${dt} velocityA:${this.velocity.print()} velocityB:${other.velocity.print()}`);
        let rvRay = this.velocity.subtract(other.velocity).multiplyScalar(dt);
        // this checks if the AABBs are currently colliding (static)
        if (min.values[0] <= 0 && max.values[0] >= 0 && min.values[1] <= 0 && max.values[1] >= 0) {
            colliding = true;
            // console.log(`minx:${min.values[0]} minY:${max.values[0]} maxX:${min.values[1]} maxY:${max.values[1]}`);
        }
        else if (this.isMoving() || other.isMoving()) { // this checks quickly moving AABBs
            // https://blog.hamaluik.ca/posts/swept-aabb-collision-using-minkowski-difference/
            // see if there WILL be a collision
            const intersectFraction = this.getRayIntersectionFraction(new tree_math_1.Vector2(), rvRay);
            if (intersectFraction) {
                // yup, there WILL be a collision this frame
                rvRayIntersection = rvRay.multiplyScalar(intersectFraction);
                // move the boxes appropriately
                // this.center = this.center.add(this.velocity.multiplyScalar(dt).multiplyScalar(intersectFraction));
                // other.center = other.center.add(other.velocity.multiplyScalar(dt).multiplyScalar(intersectFraction));
                colliding = true;
                // zero out the normal of the collision
                // var nrvRay = rvRay.normalize();
                // var tangent = new Vector2(-nrvRay.values[1], nrvRay.values[0]);
                // this.velocity = tangent.multiplyScalar(this.velocity.dot(tangent));
                // other.velocity = tangent.multiplyScalar(tangent.dot(other.velocity));
            }
        }
        return colliding;
    }
    getRayIntersectionFraction(origin, direction) {
        var end = origin.add(direction);
        // console.log(`origin: ${origin.print()} direction: ${direction.print()} end: ${end.print()}`);
        const min = this.min();
        const max = this.max();
        // check each face of a square
        var minT = this.checkEdge(null, origin, end, new tree_math_1.Vector2(min.values[0], min.values[1]), new tree_math_1.Vector2(min.values[0], max.values[1]));
        minT = this.checkEdge(minT, origin, end, new tree_math_1.Vector2(min.values[0], max.values[1]), new tree_math_1.Vector2(max.values[0], max.values[1]));
        minT = this.checkEdge(minT, origin, end, new tree_math_1.Vector2(max.values[0], max.values[1]), new tree_math_1.Vector2(max.values[0], min.values[1]));
        minT = this.checkEdge(minT, origin, end, new tree_math_1.Vector2(max.values[0], min.values[1]), new tree_math_1.Vector2(min.values[0], min.values[1]));
        // ok, now we should have found the fractional component along the ray where we collided
        return minT;
    }
    checkEdge(minT, origin, end, originB, endB) {
        let x = this.getRayIntersectionFractionOfFirstRay(origin, end, originB, endB);
        // console.log(`minT:${minT} x:${x}`);
        // if minT is null and x is something
        if (!minT && x) {
            // console.log('minT is null so default accept a good value');
            minT = x;
        }
        else if (x && minT && x < minT) {
            // console.log('we found a fraction that is closer to the collision');
            minT = x;
        }
        return minT;
    }
    // taken from https://github.com/pgkelley4/line-segments-intersect/blob/master/js/line-segments-intersect.js
    // returns the point where they intersect (if they intersect)
    // returns null if they don't intersect
    getRayIntersectionFractionOfFirstRay(originA, endA, originB, endB) {
        var r = endA.subtract(originA);
        var s = endB.subtract(originB);
        var numerator = originB.subtract(originA).crossProduct(r);
        var denominator = r.crossProduct(s);
        console.log(`checking intersection between startA:${originA.print()} endA:${endA.print()} startB:${originB.print()} endB:${endB.print()}`);
        if (numerator === 0 && denominator === 0) {
            // the lines are co-linear
            // check if they overlap
            /*return	((originB.x - originA.x < 0) != (originB.x - endA.x < 0) != (endB.x - originA.x < 0) != (endB.x - endA.x < 0)) ||
            ((originB.y - originA.y < 0) != (originB.y - endA.y < 0) != (endB.y - originA.y < 0) != (endB.y - endA.y < 0));*/
            return null;
        }
        if (denominator === 0) {
            // lines are parallel
            return null;
        }
        var u = numerator / denominator;
        var t = originB.subtract(originA).crossProduct(s) / denominator;
        if ((t >= 0) && (t <= 1) && (u >= 0) && (u <= 1)) {
            console.log(`==========> t: ${t} u: ${u}`);
            console.log('=============> collision!!!');
            //return originA + (r * t);
            return t;
        }
        return null;
    }
}
exports.AABB = AABB;

},{"./tree-math":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axis_aligned_bounding_box_1 = require("./axis-aligned-bounding-box");
const tree_math_1 = require("./tree-math");
const emote_twitch_1 = require("../emote-widget/emote-twitch");
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
            const newEmote = new emote_twitch_1.TwitchEmote('', 0, 0, 2, 'https://cdn.betterttv.net/emote/5d3c7708c77b14468fe92fc4/2x');
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

},{"../emote-widget/emote-twitch":1,"./axis-aligned-bounding-box":3,"./tree-math":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClockDirection;
(function (ClockDirection) {
    // clockwise, counter clockwise
    ClockDirection[ClockDirection["CW"] = 0] = "CW";
    ClockDirection[ClockDirection["CCW"] = 1] = "CCW";
})(ClockDirection = exports.ClockDirection || (exports.ClockDirection = {}));
class Vector2 {
    constructor(x = 0, y = 0) {
        this.values = [x, y];
    }
    add(other) {
        return new Vector2((this.values[0] + other.values[0]), (this.values[1] + other.values[1]));
    }
    subtract(other) {
        return new Vector2((this.values[0] - other.values[0]), (this.values[1] - other.values[1]));
    }
    magnitude() {
        return Math.sqrt((this.values[0] * this.values[0]) + (this.values[1] * this.values[1]));
    }
    multiplyScalar(scalar) {
        return new Vector2(this.values[0] * scalar, this.values[1] * scalar);
    }
    divideScalar(scalar) {
        if (scalar === 0) {
            throw new Error('Cannont divide by 0');
        }
        return new Vector2(this.values[0] / scalar, this.values[1] / scalar);
    }
    normalize() {
        const magnitude = this.magnitude();
        if (magnitude > 0) {
            return new Vector2(this.values[0] / magnitude, this.values[1] / magnitude);
        }
        else {
            throw new Error('Cannot normalize a vector with 0 magnitude.');
        }
    }
    normal(direction) {
        if (direction === ClockDirection.CW) {
            return new Vector2(this.values[1], -this.values[0]);
        }
        else if (direction === ClockDirection.CCW) {
            return new Vector2(-this.values[1], this.values[0]);
        }
        else {
            throw new Error('Cannot return normal');
        }
    }
    dot(other) {
        const aNorm = this.normalize();
        const oNorm = other.normalize();
        // console.log(`(${aNorm.values[0]}, ${aNorm.values[1]}) dot (${oNorm.values[0]}, ${oNorm.values[1]})`);
        return ((aNorm.values[0] * oNorm.values[0]) + (aNorm.values[1] * oNorm.values[1]));
    }
    crossProduct(other) {
        const aNorm = this.normalize();
        const oNorm = other.normalize();
        return ((aNorm.values[0] * oNorm.values[1]) - (aNorm.values[1] * oNorm.values[0]));
    }
    angleBetween(other) {
        return (Math.acos(this.dot(other)) * (180 / Math.PI));
    }
    print() {
        return `[${this.values[0]}, ${this.values[1]}]`;
    }
    checkBoundaries(aVec, listOfBoundaries) {
        const collidedSides = [];
        let colliding = false;
        listOfBoundaries.forEach((boundary) => {
            // console.log(boundary, aVec.dot(boundary));
            if (aVec.dot(boundary) < 0) {
                colliding = true;
                collidedSides.push(boundary);
            }
        });
        return { colliding: colliding, collidedSides: collidedSides };
    }
}
exports.Vector2 = Vector2;

},{}]},{},[4]);
