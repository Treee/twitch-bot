(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_1 = require("./emote");
class BttvEmoteResponse {
    constructor(urlTemplate, emotes) {
        this.urlTemplate = urlTemplate;
        this.emotes = emotes;
    }
}
exports.BttvEmoteResponse = BttvEmoteResponse;
class BttvEmote extends emote_1.Emote {
    constructor(channel, code, id, imageType) {
        super(1, '', code);
        this.channel = channel;
        this.code = code;
        this.id = id;
        this.imageType = imageType;
        this.setUrl();
    }
    setUrl() {
        this.url = `https://cdn.betterttv.net/emote/${this.id}/${this.scale}x`;
    }
    clone() {
        const clonedEmote = new BttvEmote(this.channel, this.code, this.id, this.imageType);
        clonedEmote.lifespan = this.lifespan;
        clonedEmote.velocity = this.velocity;
        clonedEmote.htmlElement = this.htmlElement;
        return clonedEmote;
    }
}
exports.BttvEmote = BttvEmote;

},{"./emote":6}],2:[function(require,module,exports){
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
        clonedEmote.velocity = this.velocity;
        clonedEmote.htmlElement = this.htmlElement;
        return clonedEmote;
    }
}
exports.TwitchEmote = TwitchEmote;

},{"./emote":6}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmoteWidgetClient {
    constructor(serverUrl, emoteWidget) {
        this.serverUrl = 'ws://localhost:8080';
        this.emoteCodesToLookFor = [];
        this.serverUrl = serverUrl;
        this.emoteWidget = emoteWidget;
        this.socket = new WebSocket(serverUrl);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
    }
    onOpen(event) {
        const emoteCodes = this.emoteWidget.getEmoteCodes();
        console.log('[open] Connection established');
        console.log('Sending list of emotes to look for', emoteCodes);
        this.socket.send(JSON.stringify({ dataType: 'emoteCodes', data: emoteCodes }));
    }
    onMessage(event) {
        console.log(`[message] Data received from server: ${event.data}`);
        // TODO handle when json parse fails
        const invokedEmotes = JSON.parse(event.data.toString());
        if (!!invokedEmotes && invokedEmotes.length > 0) {
            invokedEmotes.forEach((emoteCode) => {
                this.emoteWidget.addEmoteToContainer(emoteCode);
            });
        }
    }
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmoteWidget {
    constructor(emoteConfig) {
        this.masterEmotes = [];
        this.emotesToDraw = [];
        this.emoteSuffixes = ['_SA', '_BW', '_HF', '_VF', '_SQ', '_TK', '_SG', '_RD'];
        this.emoteConfig = emoteConfig;
    }
    getEmoteCodes() {
        return this.masterEmotes.map((emote) => {
            return emote.code;
        });
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
        foundEmote.createHtmlElement('emote');
        return foundEmote.clone();
    }
    getRandomEmote() {
        const randomIndex = this.randomNumberBetween(0, this.masterEmotes.length - 1);
        if (this.masterEmotes.length < 1) {
            throw new Error('No Emotes in the master list.');
        }
        const randomEmote = this.masterEmotes[randomIndex];
        randomEmote.setScale(this.randomNumberBetween(1, 3));
        randomEmote.setUrl();
        randomEmote.createHtmlElement('emote');
        return randomEmote.clone();
    }
    randomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    addEmoteToContainer(emoteCode) {
        var _a, _b, _c;
        let newEmote = this.getRandomEmote();
        let numEmotes = 1;
        if (emoteCode !== '') {
            newEmote = this.getEmoteByCode(emoteCode);
            numEmotes = this.randomNumberBetween(2, 7);
        }
        for (let index = 0; index < numEmotes; index++) {
            (_a = newEmote) === null || _a === void 0 ? void 0 : _a.randomizeEmoteAnimation();
            if ((_b = newEmote) === null || _b === void 0 ? void 0 : _b.htmlElement) {
                $(`.emote-container`).append(newEmote.htmlElement);
            }
            // remove the elment
            setTimeout((emote) => {
                emote.htmlElement.hide(1);
            }, (((_c = newEmote) === null || _c === void 0 ? void 0 : _c.lifespan) || 0) * 1000 + 1000, newEmote);
        }
    }
    addEmoteToCanvasAndDrawables(emote) {
        var _a;
        if ((_a = emote) === null || _a === void 0 ? void 0 : _a.htmlElement) {
            $(`.emote-container`).append(emote.htmlElement);
            emote.moveTo(this.randomNumberBetween(0, this.getViewWidth()), 0);
            emote.velocity.y = this.randomNumberBetween(1, 7);
        }
        this.emotesToDraw.push(emote);
    }
    getViewHeight() {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }
    getViewWidth() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    startSimulation() {
        this.addEmoteToCanvasAndDrawables(this.getEmoteByCode('itsatrEeCool'));
        this.addEmoteToCanvasAndDrawables(this.getEmoteByCode('itsatrEeCool'));
        // let dt = 0.016;
        setInterval(() => {
            this.oneLoop();
        }, 1000 / 60);
    }
    oneLoop() {
        this.emotesToDraw.forEach((emote) => {
            const nextFrame = emote.calculateNextMoveFrame();
            emote.moveTo(nextFrame.x, nextFrame.y);
        });
    }
}
exports.EmoteWidget = EmoteWidget;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Emote {
    constructor(scale, url, code) {
        this.lifespan = 0;
        // position: { x: number, y: number } = { x: 0, y: 0 };
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
        }
    }
    setUrl() {
        throw new Error('Set Url Not Implemented In Abstract Class');
    }
    calculateNextMoveFrame() {
        var _a, _b, _c, _d, _e, _f;
        const left = (_c = (_b = (_a = this.htmlElement) === null || _a === void 0 ? void 0 : _a.offset()) === null || _b === void 0 ? void 0 : _b.left, (_c !== null && _c !== void 0 ? _c : 0));
        const top = (_f = (_e = (_d = this.htmlElement) === null || _d === void 0 ? void 0 : _d.offset()) === null || _e === void 0 ? void 0 : _e.top, (_f !== null && _f !== void 0 ? _f : 0));
        return { x: (left + this.velocity.x), y: (top + this.velocity.y) };
    }
    randomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    clone() {
        throw new Error('Not Implemented in abstract class.');
    }
}
exports.Emote = Emote;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const twitch_api_v5_1 = require("../../twitch-connectors/twitch-api-v5");
const emote_widget_config_1 = require("./emote-widget-config");
const emote_widget_1 = require("./emote-widget");
const emote_widget_client_1 = require("./emote-widget-client");
const twitchApiV5 = new twitch_api_v5_1.TwitchApiV5();
const emoteWidgetConfig = new emote_widget_config_1.EmoteWidgetConfig();
emoteWidgetConfig.setConfigFrom(window.location.search.substring(1));
const emoteWidget = new emote_widget_1.EmoteWidget(emoteWidgetConfig);
Promise.all([
    twitchApiV5.getTwitchEmotes(emoteWidgetConfig.clientId, emoteWidgetConfig.channel),
    twitchApiV5.getBttvEmotes(emoteWidgetConfig.channel),
    twitchApiV5.getTwitchEmotesBySets(emoteWidgetConfig.clientId, [0, 42])
]).then((values) => {
    // emoteWidget.twitchSubBadges = values[0].subBadges;
    emoteWidget.masterEmotes = emoteWidget.masterEmotes.concat(values[0]).concat(values[1]).concat(values[2]);
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
        // emoteWidget.startSimulation();
    }
});

},{"../../twitch-connectors/twitch-api-v5":8,"./emote-widget":5,"./emote-widget-client":3,"./emote-widget-config":4}],8:[function(require,module,exports){
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
const emote_twitch_1 = require("../overlay-widgets/emote-widget/emote-twitch");
const emote_bttv_1 = require("../overlay-widgets/emote-widget/emote-bttv");
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
                            formattedEmotes.push(new emote_twitch_1.TwitchEmote(emote.code, emote.emoticon_set, emote.id));
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
                    formattedEmotes.push(new emote_twitch_1.TwitchEmote(emote.code, emote.emoticon_set, emote.id));
                });
                formattedEmotes = formattedEmotes.concat(this.loadEmotesFromConfig());
                Object.keys(subBadges).forEach((objectKey) => {
                    const subLoyaltyImages = [subBadges[objectKey].image_url_1x, subBadges[objectKey].image_url_2x, subBadges[objectKey].image_url_4x];
                    formattedSubBadges.push(new emote_twitch_1.SubBadge(objectKey, subBadges[objectKey].title, subLoyaltyImages));
                });
                return new emote_twitch_1.TwitchEmoteResponse(data.channel_id, data.channel_name, data.display_name, formattedEmotes, formattedSubBadges).emotes;
            }), (error) => {
                return new emote_twitch_1.TwitchEmoteResponse('', '', '', [], []).emotes;
            });
        });
    }
    getBttvEmotes(channelName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch(`https://api.betterttv.net/2/channels/${channelName}`).then((response) => __awaiter(this, void 0, void 0, function* () {
                // console.log('unmanaged emotes', data);
                let data = yield response.json();
                const emotes = data.emotes || [];
                const formattedEmotes = [];
                emotes.forEach((emote) => {
                    formattedEmotes.push(new emote_bttv_1.BttvEmote(emote.channel, emote.code, emote.id, emote.imageType));
                });
                return new emote_bttv_1.BttvEmoteResponse(data.urlTemplate, formattedEmotes).emotes;
            }), (error) => {
                return new emote_bttv_1.BttvEmoteResponse('', []).emotes;
            });
        });
    }
    loadEmotesFromConfig() {
        const emotes = [];
        const hahahalidaysEmoteSet = 472873131;
        emotes.push(new emote_twitch_1.TwitchEmote('HahaSleep', hahahalidaysEmoteSet, 301108041));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaThink', hahahalidaysEmoteSet, 301108032));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaTurtledove', hahahalidaysEmoteSet, 301108011));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaBaby', hahahalidaysEmoteSet, 301108084));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaDoge', hahahalidaysEmoteSet, 301108082));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaHide', hahahalidaysEmoteSet, 301108072));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaSweat', hahahalidaysEmoteSet, 301108037));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaCat', hahahalidaysEmoteSet, 301108083));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaLean', hahahalidaysEmoteSet, 301108068));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaShrugRight', hahahalidaysEmoteSet, 301108045));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaShrugMiddle', hahahalidaysEmoteSet, 301108046));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaDreidel', hahahalidaysEmoteSet, 301112663));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaShrugLeft', hahahalidaysEmoteSet, 301108047));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaBall', hahahalidaysEmoteSet, 301112669));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaNyandeer', hahahalidaysEmoteSet, 301114312));
        emotes.push(new emote_twitch_1.TwitchEmote('Haha2020', hahahalidaysEmoteSet, 301112670));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaThisisfine', hahahalidaysEmoteSet, 301108013));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaPoint', hahahalidaysEmoteSet, 301108057));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaReindeer', hahahalidaysEmoteSet, 301108048));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaElf', hahahalidaysEmoteSet, 301108081));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaNutcracker', hahahalidaysEmoteSet, 301108063));
        emotes.push(new emote_twitch_1.TwitchEmote('HahaGoose', hahahalidaysEmoteSet, 301108075));
        return emotes;
    }
}
exports.TwitchApiV5 = TwitchApiV5;

},{"../overlay-widgets/emote-widget/emote-bttv":1,"../overlay-widgets/emote-widget/emote-twitch":2}]},{},[7]);
