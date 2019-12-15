(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Emote {
    constructor(scale = 1, url = '') {
        this.scale = 1;
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.lifespan = 0;
        this.url = url;
        this.scale = scale;
    }
    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }
    setVelocity(x, y) {
        this.velocity.x = x;
        this.velocity.y = y;
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
    move() {
        if (this.htmlElement) {
            this.htmlElement.css('transform', `translate(${this.position.x += this.velocity.x}px, ${this.position.y += this.velocity.y}px)`);
        }
    }
    calculateNextMoveFrame() {
        const emotePixelScale = this.convertScaleToPixels();
        return { x: (this.position.x + this.velocity.x + emotePixelScale.width), y: (this.position.y + this.velocity.y + emotePixelScale.height) };
    }
    randomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
exports.Emote = Emote;
class BttvEmoteResponse {
    constructor(urlTemplate, emotes) {
        this.urlTemplate = urlTemplate;
        this.emotes = emotes;
    }
}
exports.BttvEmoteResponse = BttvEmoteResponse;
class BttvEmote extends Emote {
    constructor(channel, code, id, imageType) {
        super();
        this.channel = channel;
        this.code = code;
        this.id = id;
        this.imageType = imageType;
    }
    setUrl() {
        this.url = `https://cdn.betterttv.net/emote/${this.id}/${this.scale}x`;
    }
}
exports.BttvEmote = BttvEmote;
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
class TwitchEmote extends Emote {
    constructor(code, emoticon_set, id) {
        super();
        this.code = code;
        this.emoticon_set = emoticon_set;
        this.id = id;
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
        this.url = `https://static-cdn.jtvnw.net/emoticons/v1/${this.id}/${this.scale}.0`;
    }
}
exports.TwitchEmote = TwitchEmote;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_1 = require("../emote-widget/emote");
class PhysicsEngine {
    constructor() {
        this.emotes = [];
        this.startSimulation();
    }
    startSimulation() {
        this.addEmotesToContainer(10);
        setInterval(() => {
            // console.log('bounds', this.bouncingWidget);
            this.oneLoop();
        }, 1000 / 60);
    }
    addEmotesToContainer(numEmotesToAdd) {
        for (let index = 0; index < numEmotesToAdd; index++) {
            const newEmote = new emote_1.Emote(2, 'https://cdn.betterttv.net/emote/5d3c7708c77b14468fe92fc4/2x');
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
    checkForEmoteCollision(emote, nextFrame, otherEmote) {
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
    checkForWindowCollision(emote, nextFrame) {
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
exports.PhysicsEngine = PhysicsEngine;
new PhysicsEngine();

},{"../emote-widget/emote":1}]},{},[2]);
