(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
"use strict";

// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var global = getGlobal();

module.exports = exports = global.fetch;

// Needed for TypeScript and Webpack.
exports.default = global.fetch.bind(global);

exports.Headers = global.Headers;
exports.Request = global.Request;
exports.Response = global.Response;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_message_enum_1 = require("../../third-party-connectors/twitch/socket-message-enum");
class EmoteWidgetClient {
    constructor(serverUrl, emoteWidget) {
        this.serverUrl = 'ws://localhost:8080';
        this.serverUrl = serverUrl;
        this.emoteWidget = emoteWidget;
        this.socket = new WebSocket(serverUrl);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
    }
    onOpen(event) {
        console.log('[open] Connection established');
        console.log('Checking server for cached emotes');
        this.socket.send(JSON.stringify({ dataType: socket_message_enum_1.SocketMessageEnum.CheckEmoteCache, data: '' }));
    }
    onMessage(event) {
        console.log(`[message] Data received from server: ${event.data}`);
        const eventData = JSON.parse(event.data);
        if (eventData.dataType === socket_message_enum_1.SocketMessageEnum.CheckEmoteCache) {
            if (eventData.data.length < 1) {
                const emoteCodes = this.emoteWidget.getEmoteCodes();
                console.log('Sending list of emotes to look for', emoteCodes);
                this.socket.send(JSON.stringify({ dataType: socket_message_enum_1.SocketMessageEnum.EmoteCodes, data: emoteCodes }));
            }
        }
        else if (eventData.dataType === socket_message_enum_1.SocketMessageEnum.FoundEmotes) {
            const invokedEmotes = eventData.data;
            if (!!invokedEmotes && invokedEmotes.length > 0) {
                invokedEmotes.forEach((emoteCode) => {
                    emoteCode.forEach((emote) => {
                        this.emoteWidget.addEmoteToContainer(emote);
                    });
                });
            }
        }
    }
    // need to handle cwhen clients close their conenction
    onClose(event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        }
        else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log('[close] Connection died');
        }
    }
    onError(event) {
        console.log(`[error] ${event.message}`);
    }
}
exports.EmoteWidgetClient = EmoteWidgetClient;

},{"../../third-party-connectors/twitch/socket-message-enum":13}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmoteWidgetConfig {
    constructor() {
        this.clientId = '';
        this.single = '';
        this.channel = 'itsatreee';
        this.defaultImageUrl = 'https://cdn.betterttv.net/emote/5d3c7708c77b14468fe92fc4/2x';
        this.showTwitch = true;
        this.showBttv = true;
        this.showGlobal = false;
        this.botMode = false;
        this.totalEmotes = 100;
        this.secondsToRain = 10;
        this.secondsToWaitForRain = 23;
        this.numTimesToRepeat = 1;
    }
    setConfigFrom(queryString) {
        queryString.split('&').forEach((param) => {
            const paramKey = param.split('=')[0];
            const paramValue = param.split('=')[1];
            if (!paramValue) {
                return;
            }
            else if (paramValue === 'true' || paramValue === 'false') {
                Object.defineProperty(this, paramKey, {
                    value: paramValue === 'true',
                    writable: true
                });
            }
            else {
                Object.defineProperty(this, paramKey, {
                    value: paramValue,
                    writable: true
                });
            }
        });
        return this;
    }
}
exports.EmoteWidgetConfig = EmoteWidgetConfig;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_interfaces_1 = require("./emotes/emote-interfaces");
const raining_emote_1 = require("./emotes/raining-emote");
const wavy_emote_1 = require("./emotes/wavy-emote");
const firework_emote_1 = require("./emotes/firework-emote");
class EmoteWidget {
    constructor(emoteConfig) {
        this.masterEmotes = [];
        this.emotesToDraw = [];
        this.emoteSuffixes = ['_SA', '_BW', '_HF', '_VF', '_SQ', '_TK', '_SG', '_RD'];
        this.explodedEmotes = [];
        this.emoteConfig = emoteConfig;
    }
    getEmoteCodes() {
        return this.masterEmotes.map((emote) => {
            return emote.code;
        });
    }
    getDrawableEmoteByCode(emoteCode) {
        let drawable = this.createRainingEmote(emoteCode);
        const randomAnimationType = this.randomNumberBetween(1, 3);
        if (randomAnimationType === 2) {
            drawable = this.createWavyEmote(emoteCode);
        }
        if (randomAnimationType === 3) {
            drawable = this.createFireworkEmote(emoteCode);
        }
        return drawable;
    }
    createFireworkEmote(emoteCode) {
        const emote = this.getEmoteByCode(emoteCode);
        const randomPosition = new emote_interfaces_1.Vector2(this.randomNumberBetween(0, this.getViewWidth()), this.getViewHeight());
        const xVelocityDirection = randomPosition.x < this.getViewWidth() / 2 ? 1 : -1;
        const randomVelocity = new emote_interfaces_1.Vector2(this.randomNumberBetween(1, 2) * xVelocityDirection, this.randomNumberBetween(2, 4.5) * -1);
        const randomLifespan = this.randomNumberBetween(3, 4.2);
        const randomAngularVelocity = this.randomNumberBetween(1, 2);
        emote.setScale(this.randomNumberBetween(2, 3));
        emote.setUrl();
        const emoteSize = emote.convertScaleToPixels();
        const fireworkEmote = new firework_emote_1.FireworkEmote(randomPosition, randomVelocity, randomLifespan, emoteSize, emote.url, randomAngularVelocity);
        fireworkEmote.code = emoteCode;
        return fireworkEmote;
    }
    createRainingEmote(emoteCode) {
        const emote = this.getEmoteByCode(emoteCode);
        const randomPosition = new emote_interfaces_1.Vector2(this.randomNumberBetween(0, this.getViewWidth()), 0);
        const randomVelocity = new emote_interfaces_1.Vector2(0, this.randomNumberBetween(1, 5));
        const randomLifespan = this.randomNumberBetween(1, 6);
        const randomAngularVelocity = this.randomNumberBetween(1, 4);
        emote.setScale(this.randomNumberBetween(1, 3));
        emote.setUrl();
        const emoteSize = emote.convertScaleToPixels();
        return new raining_emote_1.RainingEmote(randomPosition, randomVelocity, randomLifespan, emoteSize, emote.url, randomAngularVelocity);
    }
    createWavyEmote(emoteCode) {
        const emote = this.getEmoteByCode(emoteCode);
        const randomVelocity = new emote_interfaces_1.Vector2(this.randomNumberBetween(1, 5), this.randomNumberBetween(1, 5));
        const randomLifespan = this.randomNumberBetween(3, 9);
        const randomAngularVelocity = this.randomNumberBetween(1, 4);
        emote.setScale(this.randomNumberBetween(1, 3));
        emote.setUrl();
        const emoteSize = emote.convertScaleToPixels();
        const randomPosition = new emote_interfaces_1.Vector2(0, this.randomNumberBetween(0, this.getViewHeight() - emoteSize.y));
        const max = 2;
        const toggle = this.randomNumberBetween(1, max); //left
        if (toggle % max === 1) { // right
            randomPosition.x = this.getViewWidth();
            randomVelocity.x *= -1;
        }
        // else if (toggle % max === 2) { // top
        //     randomPosition.x = this.randomNumberBetween(0, this.getViewWidth());
        //     randomPosition.y = 0;
        // } else if (toggle % max === 3) {// bot
        //     randomPosition.x = this.randomNumberBetween(0, this.getViewWidth());
        //     randomPosition.y = this.getViewHeight();
        //     randomVelocity.y *= -1;
        // }
        return new wavy_emote_1.WavyEmote(randomPosition, randomVelocity, randomLifespan, emoteSize, emote.url, randomAngularVelocity);
    }
    getEmoteByCode(emoteCode) {
        const splitCode = emoteCode.split('_');
        if (splitCode.length === 2) {
            emoteCode = splitCode[0];
        }
        const foundEmote = this.masterEmotes.find((emote) => {
            return emote.code === emoteCode;
        });
        if (splitCode.length === 2) {
            foundEmote.channelPointModifier = `_${splitCode[1]}`;
        }
        if (!foundEmote) {
            throw new Error(`No emote found for code: ${emoteCode}.`);
        }
        foundEmote.setScale(this.randomNumberBetween(1, 3));
        foundEmote.setUrl();
        return foundEmote;
    }
    getRandomEmote() {
        const randomIndex = this.randomNumberBetween(0, this.masterEmotes.length - 1);
        if (this.masterEmotes.length < 1) {
            throw new Error('No Emotes in the master list.');
        }
        const randomEmote = this.masterEmotes[randomIndex];
        randomEmote.setScale(this.randomNumberBetween(1, 3));
        randomEmote.setUrl();
        return randomEmote;
    }
    randomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    addEmoteToContainer(emoteCode) {
        let numEmotes = this.randomNumberBetween(1, 3);
        for (let index = 0; index < numEmotes; index++) {
            const drawableEmote = this.getDrawableEmoteByCode(emoteCode);
            this.addEmoteToCanvasAndDrawables(drawableEmote);
        }
    }
    addEmoteToCanvasAndDrawables(drawable) {
        var _a;
        if ((_a = drawable) === null || _a === void 0 ? void 0 : _a.htmlElement) {
            setTimeout(() => {
                if (drawable.htmlElement) {
                    $(`.emote-container`).append(drawable.htmlElement);
                }
            }, this.randomNumberBetween(100, 500));
        }
        this.emotesToDraw.push(drawable);
    }
    getViewHeight() {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }
    getViewWidth() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    startSimulation() {
        let dt = 0.016;
        setInterval(() => {
            this.oneLoop(dt);
        }, 1000 / 60);
    }
    oneLoop(dt) {
        this.emotesToDraw.forEach((emote) => {
            emote.doUpdate(dt);
            emote.draw();
        });
        this.checkForExplodedEmotes();
        this.pruneRemainingEmotes();
    }
    pruneRemainingEmotes() {
        this.emotesToDraw = this.emotesToDraw.filter((emote) => {
            var _a;
            return ((_a = emote) === null || _a === void 0 ? void 0 : _a.lifespan) > 0;
        });
    }
    checkForExplodedEmotes() {
        const explodedEmotes = this.emotesToDraw.filter((emote) => {
            if (emote instanceof firework_emote_1.FireworkEmote) {
                return emote.opacity < 1 && !emote.isExploded;
            }
        });
        explodedEmotes.forEach((explodedEmote) => {
            this.explodeIntoEmotes(explodedEmote.code, explodedEmote.position);
            explodedEmote.isExploded = true;
        });
    }
    explodeIntoEmotes(emoteCode, position) {
        const twoPi = Math.PI * 2;
        const radians = twoPi / 360;
        const emote = this.getEmoteByCode(emoteCode);
        const randomNumberOfEmoteParticles = this.randomNumberBetween(5, 12);
        for (let numEmotes = 0; numEmotes < randomNumberOfEmoteParticles; numEmotes++) {
            const randomLifespan = this.randomNumberBetween(1, 2);
            const randomAngularVelocity = this.randomNumberBetween(-4, 4);
            emote.setScale(this.randomNumberBetween(1, 2));
            emote.setUrl();
            const emoteSize = emote.convertScaleToPixels();
            const randomDegrees = this.randomNumberBetween(0, 360);
            const theta = randomDegrees * radians; // some random number between 0 and 2pi
            const randomVelocity = new emote_interfaces_1.Vector2(Math.cos(theta), Math.sin(theta));
            const fireworkEmote = new raining_emote_1.RainingEmote(position, randomVelocity, randomLifespan, emoteSize, emote.url, randomAngularVelocity);
            this.addEmoteToCanvasAndDrawables(fireworkEmote);
        }
    }
}
exports.EmoteWidget = EmoteWidget;

},{"./emotes/emote-interfaces":5,"./emotes/firework-emote":7,"./emotes/raining-emote":8,"./emotes/wavy-emote":9}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_interfaces_1 = require("./emote-interfaces");
class Emote {
    constructor(scale, url, code, id) {
        this.url = url;
        this.scale = scale;
        this.code = code;
        this.id = id;
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
        return new emote_interfaces_1.Vector2(emoteWidth, emoteHeight);
    }
    setUrl() {
        throw new Error('Set Url Not Implemented In Abstract Class');
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
        super(1, '', code, id);
        this.channel = channel;
        this.imageType = imageType;
        this.setUrl();
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
    constructor(code = 'FrankerZ', emoticon_set, id, scale = 1, url = '') {
        super(scale, url, code, id);
        this.channelPointModifier = '';
        this.emoticon_set = emoticon_set;
        this.setUrl();
    }
    convertScaleToPixels() {
        if (this.emoticon_set === 42) {
            return new emote_interfaces_1.Vector2(20 * this.scale, 18 * this.scale);
        }
        else {
            return super.convertScaleToPixels();
        }
    }
    setUrl() {
        this.url = `https://static-cdn.jtvnw.net/emoticons/v1/${this.id}${this.channelPointModifier}/${this.scale}.0`;
    }
}
exports.TwitchEmote = TwitchEmote;

},{"./emote-interfaces":5}],7:[function(require,module,exports){
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

},{"./emote-interfaces":5}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_interfaces_1 = require("./emote-interfaces");
class RainingEmote extends emote_interfaces_1.RenderableObject {
    constructor(position = new emote_interfaces_1.Vector2(), velocity = new emote_interfaces_1.Vector2(), lifespan = 0, size, imageSrc, angularVelocity) {
        super();
        this.opacity = 1;
        this.angularVelocityDegrees = 0;
        this.degreesRotation = 0;
        this.position = position;
        this.velocity = velocity;
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

},{"./emote-interfaces":5}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_interfaces_1 = require("./emote-interfaces");
class WavyEmote extends emote_interfaces_1.RenderableObject {
    constructor(position = new emote_interfaces_1.Vector2(), velocity = new emote_interfaces_1.Vector2(), lifespan = 0, size, imageSrc, angularVelocity) {
        super();
        this.opacity = 1;
        this.angularVelocityDegrees = 0;
        this.degreesRotation = 0;
        this.movementTheta = 0;
        this.movementToggle = true;
        this.position = position;
        this.velocity = velocity;
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
    applyTransform() {
        const translation = this.translate(this.position.x, this.position.y);
        const rotation = this.rotate(this.degreesRotation);
        this.htmlElement.css('transform', `${translation} ${rotation}`);
        this.htmlElement.css('opacity', `${this.opacity}`);
    }
    calculateNextMoveFrame(dt) {
        if (this.movementToggle) {
            this.movementTheta += dt;
        }
        else {
            this.movementTheta -= dt;
        }
        if (this.movementTheta > 1 || this.movementTheta < -1) {
            this.movementToggle = !this.movementToggle;
        }
        const x = this.position.x + (this.velocity.x * Math.cos(this.movementTheta));
        const y = this.position.y + (this.velocity.y * Math.sin(this.movementTheta));
        return new emote_interfaces_1.Vector2(x, y);
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
exports.WavyEmote = WavyEmote;

},{"./emote-interfaces":5}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const twitch_api_v5_1 = require("../../third-party-connectors/twitch/twitch-api-v5");
const steam_api_1 = require("../../third-party-connectors/steam/steam-api");
const emote_widget_config_1 = require("./emote-widget-config");
const emote_widget_1 = require("./emote-widget");
const emote_widget_client_1 = require("./emote-widget-client");
const twitchApiV5 = new twitch_api_v5_1.TwitchApiV5();
const steamApi = new steam_api_1.SteamApi();
const emoteWidgetConfig = new emote_widget_config_1.EmoteWidgetConfig();
emoteWidgetConfig.setConfigFrom(window.location.search.substring(1));
const emoteWidget = new emote_widget_1.EmoteWidget(emoteWidgetConfig);
Promise.all([
    twitchApiV5.getTwitchEmotes(emoteWidgetConfig.clientId, emoteWidgetConfig.channel),
    twitchApiV5.getTwitchEmotesBySets(emoteWidgetConfig.clientId, [0, 42]),
    twitchApiV5.getBttvEmotesByChannel(emoteWidgetConfig.channel),
    twitchApiV5.getGlobalBttvEmotes()
]).then((values) => {
    // emoteWidget.twitchSubBadges = values[0].subBadges;
    emoteWidget.masterEmotes = emoteWidget.masterEmotes.concat(values[0]).concat(values[1]).concat(values[2]).concat(values[3]);
}).then(() => {
    if (!emoteWidgetConfig.botMode) {
        // this first interval makes it so emotes rain immediately instead of waiting for the second interval to start
        let interval = setInterval(emoteWidget.addEmoteToContainer.bind(emoteWidget), ((emoteWidgetConfig.secondsToRain * 1000) / emoteWidgetConfig.totalEmotes), '');
        if (emoteWidgetConfig.numTimesToRepeat != -1) {
            // timeout to ensure the raining emotes stop after a certain amount of time
            setTimeout(() => {
                clearInterval(interval);
                emoteWidgetConfig.numTimesToRepeat--;
            }, emoteWidgetConfig.secondsToRain * 1000);
            // this interval will continually start and stop the raining of emotes.
            setInterval(() => {
                if (emoteWidgetConfig.numTimesToRepeat > 0) {
                    interval = setInterval(emoteWidget.addEmoteToContainer.bind(emoteWidget), ((emoteWidgetConfig.secondsToRain * 1000) / emoteWidgetConfig.totalEmotes), '');
                    setTimeout(() => {
                        clearInterval(interval);
                        emoteWidgetConfig.numTimesToRepeat--;
                    }, emoteWidgetConfig.secondsToRain * 1000);
                }
            }, emoteWidgetConfig.secondsToWaitForRain * 1000);
        }
    }
}).then(() => {
    if (emoteWidgetConfig.botMode) {
        new emote_widget_client_1.EmoteWidgetClient('ws://localhost:8080', emoteWidget);
        emoteWidget.startSimulation();
    }
});

},{"../../third-party-connectors/steam/steam-api":12,"../../third-party-connectors/twitch/twitch-api-v5":14,"./emote-widget":4,"./emote-widget-client":2,"./emote-widget-config":3}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlayerSummary {
    constructor(rawJsonData) {
        this.convertJsonToObject(rawJsonData);
    }
    getJoinableGameLink() {
        let result = `${this.personaName} does not have a joinable open lobby. Are you in offline mode?`;
        if (this.lobbySteamId && this.gameId && this.steamId) {
            result = `steam://joinlobby/${this.gameId}/${this.lobbySteamId}/${this.steamId}`;
        }
        return result;
    }
    convertJsonToObject(rawJson) {
        this.steamId = rawJson.steamid;
        this.communityVisibilityState = rawJson.communityvisibilitystate;
        this.profileState = rawJson.profilestate;
        this.personaName = rawJson.personaname;
        this.lastLogoff = rawJson.lastlogoff;
        this.profileUrl = rawJson.profileurl;
        this.avatar = rawJson.avatar;
        this.avatarMedium = rawJson.avatarmedium;
        this.avatarFull = rawJson.avatarfull;
        this.personaState = rawJson.personastate;
        this.primaryClanId = rawJson.primaryclanid;
        this.timeCreated = rawJson.timecreated;
        this.personaStateFlags = rawJson.personastateflags;
        this.gameExtraInfo = rawJson.gameextrainfo;
        this.gameId = rawJson.gameid;
        this.lobbySteamId = rawJson.lobbysteamid;
        this.locCountryCode = rawJson.loccountrycode;
        this.locStateCode = rawJson.locstatecode;
        this.locCityId = rawJson.loccityid;
    }
}
exports.PlayerSummary = PlayerSummary;
// example response
// "steamid": "76561197985160398",
// "communityvisibilitystate": 3,
// "profilestate": 1,
// "personaname": "Treeeeeee",
// "lastlogoff": 1579486408,
// "profileurl": "https://steamcommunity.com/id/itsatreee/",
// "avatar": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/f6/f632f7d542d2bf56a178a65eebc8e40ce40ad359.jpg",
// "avatarmedium": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/f6/f632f7d542d2bf56a178a65eebc8e40ce40ad359_medium.jpg",
// "avatarfull": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/f6/f632f7d542d2bf56a178a65eebc8e40ce40ad359_full.jpg",
// "personastate": 1,
// "primaryclanid": "103582791461182090",
// "timecreated": 1159150464,
// "personastateflags": 0,
// "gameextrainfo": "Age of Empires II: Definitive Edition",
// "gameid": "813780",
// "lobbysteamid": "109775241019660960",
// "loccountrycode": "US",
// "locstatecode": "AK",
// "loccityid": 61

},{}],12:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// https://steamcommunity.com/dev
const fetch = require('node-fetch');
const player_summary_1 = require("./player-summary");
class SteamApi {
    constructor() { }
    // if you are invisible in steam, this will return no lobby
    getSteamJoinableLobbyLink(apiKey, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getPlayerSummaries(apiKey, userId).then((playerSummarys) => {
                if (playerSummarys.length > 0) {
                    return playerSummarys[0].getJoinableGameLink();
                }
            }, (error) => {
                console.error('Error', error);
                return '';
            });
        });
    }
    getPlayerSummaries(apiKey, steamUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamUserId}`).then((response) => __awaiter(this, void 0, void 0, function* () {
                const data = yield response.json();
                const playerSummariesRaw = data.response.players;
                const playerSummaries = [];
                playerSummariesRaw.forEach((playerSummary) => {
                    playerSummaries.push(new player_summary_1.PlayerSummary(playerSummary));
                });
                return playerSummaries;
            }), (error) => {
                console.error('Error', error);
                return [];
            });
        });
    }
}
exports.SteamApi = SteamApi;

},{"./player-summary":11,"node-fetch":1}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketMessageEnum;
(function (SocketMessageEnum) {
    SocketMessageEnum[SocketMessageEnum["FoundEmotes"] = 0] = "FoundEmotes";
    SocketMessageEnum[SocketMessageEnum["CheckEmoteCache"] = 1] = "CheckEmoteCache";
    SocketMessageEnum[SocketMessageEnum["EmoteCodes"] = 2] = "EmoteCodes";
})(SocketMessageEnum = exports.SocketMessageEnum || (exports.SocketMessageEnum = {}));

},{}],14:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const emote_1 = require("../../overlay-widgets/emote-widget/emotes/emote");
class TwitchApiV5 {
    constructor() { }
    getTwitchRequestHeaders(clientId) {
        const headers = new Headers();
        headers.append('Client-ID', clientId);
        headers.append('Accept', 'application/vnd.twitchtv.v5+json');
        return headers;
    }
    getTwitchEmotesBySets(clientId, setIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = this.getTwitchRequestHeaders(clientId);
            return yield fetch(`https://api.twitch.tv/kraken/chat/emoticon_images?emotesets=${setIds.join(',')}`, { headers }).then((response) => __awaiter(this, void 0, void 0, function* () {
                let data = yield response.json();
                // console.log('emotes by set emotes', data);
                const emoticonSets = data.emoticon_sets || {};
                const formattedEmotes = [];
                setIds.forEach((setId) => {
                    if (emoticonSets[setId]) {
                        emoticonSets[setId].forEach((emote) => {
                            formattedEmotes.push(new emote_1.TwitchEmote(emote.code, emote.emoticon_set, emote.id));
                        });
                    }
                });
                return formattedEmotes;
            }), (error) => {
                return [];
            });
        });
    }
    getTwitchEmotes(clientId, channelName) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = this.getTwitchRequestHeaders(clientId);
            return yield fetch(`https://api.twitch.tv/kraken/users?login=${channelName}`, { headers }).then((response) => __awaiter(this, void 0, void 0, function* () {
                // console.log('user', data.users);
                let data = yield response.json();
                let userId = -9999;
                if (data.users.length > 0) {
                    userId = data.users[0]._id;
                }
                return userId;
            })).then((resolvedUserId) => __awaiter(this, void 0, void 0, function* () {
                return yield fetch(`https://api.twitchemotes.com/api/v4/channels/${resolvedUserId}`);
            })).then((response) => __awaiter(this, void 0, void 0, function* () {
                let data = yield response.json();
                const emotes = data.emotes || [];
                const subBadges = data.subscriber_badges || [];
                let formattedEmotes = [];
                const formattedSubBadges = [];
                emotes.forEach((emote) => {
                    formattedEmotes.push(new emote_1.TwitchEmote(emote.code, emote.emoticon_set, emote.id));
                });
                formattedEmotes = formattedEmotes.concat(this.loadEmotesFromConfig());
                Object.keys(subBadges).forEach((objectKey) => {
                    const subLoyaltyImages = [subBadges[objectKey].image_url_1x, subBadges[objectKey].image_url_2x, subBadges[objectKey].image_url_4x];
                    formattedSubBadges.push(new emote_1.SubBadge(objectKey, subBadges[objectKey].title, subLoyaltyImages));
                });
                return new emote_1.TwitchEmoteResponse(data.channel_id, data.channel_name, data.display_name, formattedEmotes, formattedSubBadges).emotes;
            }), (error) => {
                return new emote_1.TwitchEmoteResponse('', '', '', [], []).emotes;
            });
        });
    }
    getBttvEmotesByChannel(channelName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch(`https://api.betterttv.net/2/channels/${channelName}`).then((response) => __awaiter(this, void 0, void 0, function* () {
                // console.log('unmanaged emotes', data);
                let data = yield response.json();
                const emotes = data.emotes || [];
                const formattedEmotes = [];
                emotes.forEach((emote) => {
                    formattedEmotes.push(new emote_1.BttvEmote(emote.channel, emote.code, emote.id, emote.imageType));
                });
                return new emote_1.BttvEmoteResponse(data.urlTemplate, formattedEmotes).emotes;
            }), (error) => {
                return new emote_1.BttvEmoteResponse('', []).emotes;
            });
        });
    }
    getGlobalBttvEmotes() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch(`https://api.betterttv.net/3/cached/emotes/global`).then((response) => __awaiter(this, void 0, void 0, function* () {
                // console.log('unmanaged emotes', data);
                let data = yield response.json();
                const emotes = data || [];
                const formattedEmotes = [];
                emotes.forEach((emote) => {
                    formattedEmotes.push(new emote_1.BttvEmote(emote.channel, emote.code, emote.id, emote.imageType));
                });
                return new emote_1.BttvEmoteResponse(data.urlTemplate, formattedEmotes).emotes;
            }), (error) => {
                return new emote_1.BttvEmoteResponse('', []).emotes;
            });
        });
    }
    // get all bttv emotes available
    // https://api.betterttv.net/3/emotes/shared?limit=100
    // https://api.betterttv.net/3/emotes/shared?before=5e176c89b9741121048064c0&limit=100
    loadEmotesFromConfig() {
        const emotes = [];
        const hahahalidaysEmoteSet = 472873131;
        emotes.push(new emote_1.TwitchEmote('HahaSleep', hahahalidaysEmoteSet, '301108041'));
        emotes.push(new emote_1.TwitchEmote('HahaThink', hahahalidaysEmoteSet, '301108032'));
        emotes.push(new emote_1.TwitchEmote('HahaTurtledove', hahahalidaysEmoteSet, '301108011'));
        emotes.push(new emote_1.TwitchEmote('HahaBaby', hahahalidaysEmoteSet, '301108084'));
        emotes.push(new emote_1.TwitchEmote('HahaDoge', hahahalidaysEmoteSet, '301108082'));
        emotes.push(new emote_1.TwitchEmote('HahaHide', hahahalidaysEmoteSet, '301108072'));
        emotes.push(new emote_1.TwitchEmote('HahaSweat', hahahalidaysEmoteSet, '301108037'));
        emotes.push(new emote_1.TwitchEmote('HahaCat', hahahalidaysEmoteSet, '301108083'));
        emotes.push(new emote_1.TwitchEmote('HahaLean', hahahalidaysEmoteSet, '301108068'));
        emotes.push(new emote_1.TwitchEmote('HahaShrugRight', hahahalidaysEmoteSet, '301108045'));
        emotes.push(new emote_1.TwitchEmote('HahaShrugMiddle', hahahalidaysEmoteSet, '301108046'));
        emotes.push(new emote_1.TwitchEmote('HahaDreidel', hahahalidaysEmoteSet, '301112663'));
        emotes.push(new emote_1.TwitchEmote('HahaShrugLeft', hahahalidaysEmoteSet, '301108047'));
        emotes.push(new emote_1.TwitchEmote('HahaBall', hahahalidaysEmoteSet, '301112669'));
        emotes.push(new emote_1.TwitchEmote('HahaNyandeer', hahahalidaysEmoteSet, '301114312'));
        emotes.push(new emote_1.TwitchEmote('Haha2020', hahahalidaysEmoteSet, '301112670'));
        emotes.push(new emote_1.TwitchEmote('HahaThisisfine', hahahalidaysEmoteSet, '301108013'));
        emotes.push(new emote_1.TwitchEmote('HahaPoint', hahahalidaysEmoteSet, '301108057'));
        emotes.push(new emote_1.TwitchEmote('HahaReindeer', hahahalidaysEmoteSet, '301108048'));
        emotes.push(new emote_1.TwitchEmote('HahaElf', hahahalidaysEmoteSet, '301108081'));
        emotes.push(new emote_1.TwitchEmote('HahaNutcracker', hahahalidaysEmoteSet, '301108063'));
        emotes.push(new emote_1.TwitchEmote('HahaGoose', hahahalidaysEmoteSet, '301108075'));
        emotes.push(new emote_1.TwitchEmote('HahaGingercat', hahahalidaysEmoteSet, '301108078'));
        return emotes;
    }
}
exports.TwitchApiV5 = TwitchApiV5;

},{"../../overlay-widgets/emote-widget/emotes/emote":6}]},{},[10]);
