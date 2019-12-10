(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emote_1 = require("./emote");
class EmoteWidget {
    constructor(emoteConfig) {
        this.twitchSubBadges = [];
        this.twitchEmotes = [];
        this.bttvEmotes = [];
        this.emoteConfig = emoteConfig;
    }
    getEmoteCodes() {
        const emoteCodes = [];
        this.twitchEmotes.forEach((emote) => {
            emoteCodes.push(emote.code);
        });
        this.bttvEmotes.forEach((emote) => {
            emoteCodes.push(emote.code);
        });
        return emoteCodes;
    }
    getSpecificTwitchEmote(emoteCode) {
        let emote = this.twitchEmotes.find((emote) => {
            return emote.code === emoteCode;
        });
        if (!!emote) {
            emote.setScale(this.randomNumberBetween(1, 3));
            emote.setUrl();
        }
        else {
            emote = new emote_1.TwitchEmote('', -999, -999);
        }
        return emote;
    }
    getRandomTwitchEmote() {
        const emote = this.twitchEmotes[this.randomNumberBetween(0, this.twitchEmotes.length - 1)];
        emote.setScale(this.randomNumberBetween(1, 3));
        emote.setUrl();
        return emote;
    }
    getSpecificBttvEmote(emoteCode) {
        let emote = this.bttvEmotes.find((emote) => {
            return emote.code === emoteCode;
        });
        if (!!emote) {
            emote.setScale(this.randomNumberBetween(1, 3));
            emote.setUrl();
        }
        else {
            emote = new emote_1.BttvEmote('', '', '', '');
        }
        return emote;
    }
    getRandomBttvEmote() {
        const emote = this.bttvEmotes[this.randomNumberBetween(0, this.bttvEmotes.length - 1)];
        emote.setScale(this.randomNumberBetween(1, 3));
        emote.setUrl();
        return emote;
    }
    getRandomEmote() {
        const emoteChoices = [];
        if (this.emoteConfig.showTwitch && this.twitchEmotes.length > 0) {
            emoteChoices.push(this.getRandomTwitchEmote());
        }
        if (this.emoteConfig.showBttv && this.bttvEmotes.length > 0) {
            emoteChoices.push(this.getRandomBttvEmote());
        }
        if (emoteChoices.length === 0) {
            emoteChoices.push(new emote_1.Emote(1, this.emoteConfig.defaultImageUrl));
        }
        // pick a random number, if it is even make a twitch emote otherwise bttv emote. toggle
        return emoteChoices[this.randomNumberBetween(0, emoteChoices.length - 1)];
    }
    addEmoteToContainer(emoteContainerClass, emoteCssClass, specificEmote) {
        let emote;
        if (specificEmote instanceof Function) {
            emote = specificEmote();
        }
        else {
            emote = specificEmote;
        }
        const newEmote = $('<div></div>').addClass(emoteCssClass);
        const emoteSize = emote.convertScaleToPixels();
        newEmote.width(`${emoteSize.width}px`);
        newEmote.height(`${emoteSize.height}px`);
        newEmote.css('background', `url("${emote.url}")`);
        newEmote.css('background-size', 'cover');
        const lifetimeOfElement = emote.randomizeEmoteAnimation(newEmote);
        $(`.${emoteContainerClass}`).append(newEmote);
        // remove the elment
        setTimeout((emote) => {
            emote.remove();
        }, lifetimeOfElement * 1000, newEmote);
    }
    randomNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
exports.EmoteWidget = EmoteWidget;

},{"./emote":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Emote {
    constructor(scale = 1, url = '') {
        this.scale = 1;
        this.url = url;
        this.scale = scale;
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
    randomizeEmoteAnimation(emoteElement) {
        // move across the top of the screen
        // randomize the lifetime of the animation
        const randomAnmimationLifetime = this.randomNumberBetween(2.5, 8.5);
        emoteElement.css({
            'left': `${this.randomNumberBetween(0, 95)}vw`,
            'top': `-${this.convertScaleToPixels().height}px`,
            '-webkit-animation': `raining-rotating ${randomAnmimationLifetime}s none linear, fade-out ${randomAnmimationLifetime}s none linear`,
        });
        // return the lifetime of the animation so we can kill it via DOM removal
        return randomAnmimationLifetime;
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
    setUrl() {
        this.url = `https://static-cdn.jtvnw.net/emoticons/v1/${this.id}/${this.scale}.0`;
    }
}
exports.TwitchEmote = TwitchEmote;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const twitch_api_v5_1 = require("../../twitch-connectors/twitch-api-v5");
const emote_widget_config_1 = require("./emote-widget-config");
const emote_widget_1 = require("./emote-widget");
const twitchApiV5 = new twitch_api_v5_1.TwitchApiV5();
const emoteWidgetConfig = new emote_widget_config_1.EmoteWidgetConfig();
emoteWidgetConfig.setConfigFrom(window.location.search.substring(1));
const emoteWidget = new emote_widget_1.EmoteWidget(emoteWidgetConfig);
Promise.all([
    twitchApiV5.getTwitchEmotes(emoteWidgetConfig.clientId, emoteWidgetConfig.channel),
    twitchApiV5.getBttvEmotes(emoteWidgetConfig.channel),
    twitchApiV5.getTwitchEmotesBySets(emoteWidgetConfig.clientId, [0, 42])
]).then((values) => {
    // console.log('values', values);
    if (emoteWidgetConfig.showGlobal) {
        const combinedTwitchEmotes = values[0].emotes.concat(values[2]);
        emoteWidget.twitchEmotes = combinedTwitchEmotes;
    }
    else {
        emoteWidget.twitchEmotes = values[0].emotes;
    }
    emoteWidget.twitchSubBadges = values[0].subBadges;
    emoteWidget.bttvEmotes = values[1].emotes;
}).then(() => {
    if (!emoteWidgetConfig.botMode) {
        // this first interval makes it so emotes rain immediately instead of waiting for the second interval to start
        let interval = setInterval(emoteWidget.addEmoteToContainer, ((emoteWidgetConfig.secondsToRain * 1000) / emoteWidgetConfig.totalEmotes), 'emote-container', 'emote', () => { return emoteWidget.getRandomEmote(); });
        if (emoteWidgetConfig.numTimesToRepeat != -1) {
            // timeout to ensure the raining emotes stop after a certain amount of time
            setTimeout(() => {
                clearInterval(interval);
                emoteWidgetConfig.numTimesToRepeat--;
            }, emoteWidgetConfig.secondsToRain * 1000);
            // this interval will continually start and stop the raining of emotes.
            setInterval(() => {
                if (emoteWidgetConfig.numTimesToRepeat > 0) {
                    interval = setInterval(emoteWidget.addEmoteToContainer, ((emoteWidgetConfig.secondsToRain * 1000) / emoteWidgetConfig.totalEmotes), 'emote-container', 'emote', () => { return emoteWidget.getRandomEmote(); });
                    setTimeout(() => {
                        clearInterval(interval);
                        emoteWidgetConfig.numTimesToRepeat--;
                    }, emoteWidgetConfig.secondsToRain * 1000);
                }
            }, emoteWidgetConfig.secondsToWaitForRain * 1000);
        }
    }
});

},{"../../twitch-connectors/twitch-api-v5":5,"./emote-widget":2,"./emote-widget-config":1}],5:[function(require,module,exports){
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
const emote_1 = require("../overlay-widgets/emote-widget/emote");
class TwitchApiV5 {
    constructor() {
    }
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
                const formattedEmotes = [];
                const formattedSubBadges = [];
                emotes.forEach((emote) => {
                    formattedEmotes.push(new emote_1.TwitchEmote(emote.code, emote.emoticon_set, emote.id));
                });
                Object.keys(subBadges).forEach((objectKey) => {
                    const subLoyaltyImages = [subBadges[objectKey].image_url_1x, subBadges[objectKey].image_url_2x, subBadges[objectKey].image_url_4x];
                    formattedSubBadges.push(new emote_1.SubBadge(objectKey, subBadges[objectKey].title, subLoyaltyImages));
                });
                return new emote_1.TwitchEmoteResponse(data.channel_id, data.channel_name, data.display_name, formattedEmotes, formattedSubBadges);
            }), (error) => {
                return new emote_1.TwitchEmoteResponse('', '', '', [], []);
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
                    formattedEmotes.push(new emote_1.BttvEmote(emote.channel, emote.code, emote.id, emote.imageType));
                });
                return new emote_1.BttvEmoteResponse(data.urlTemplate, formattedEmotes);
            }), (error) => {
                return new emote_1.BttvEmoteResponse('', []);
            });
        });
    }
}
exports.TwitchApiV5 = TwitchApiV5;

},{"../overlay-widgets/emote-widget/emote":3}]},{},[4]);
