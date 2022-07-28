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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emote_1 = require("../../helpers/emote");
const node_fetch_1 = __importDefault(require("node-fetch"));
const extra_emotes_1 = require("./chatbot/extra-emotes");
const secrets_1 = require("../../secrets");
class TwitchApiV5 {
    constructor(debugMode = false) {
        this.oAuthToken = "";
        this.helixBaseUrl = "https://api.twitch.tv/helix";
        this.pubSubCallbackUrl = "https://itsatreee.com/aoe2/api/twitchwebhook/";
        this.debugMode = debugMode;
    }
    getTwitchRequestHeaders() {
        const headers = {
            "Client-ID": secrets_1.SECRETS.botClientId,
            Accept: "application/vnd.twitchtv.v5+json",
            Authorization: `Bearer ${this.oAuthToken}`,
        };
        return headers;
    }
    checkoAuthToken(clientId, clientSecret, scope = "", grantType = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const validateOAuthTokenResponse = yield this.validateoAuthToken(this.oAuthToken);
            if (validateOAuthTokenResponse.status && (validateOAuthTokenResponse.status === 401 || validateOAuthTokenResponse.status === 403)) {
                const newOAuthToken = yield this.getoAuthToken(clientId, clientSecret, scope, grantType);
                return newOAuthToken;
            }
            else if (validateOAuthTokenResponse.client_id) {
                return validateOAuthTokenResponse;
            }
        });
    }
    getoAuthToken(clientId, clientSecret, scope = "", grantType = "client_credentials") {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(`getting oauth token start scope:${scope} grantType: ${grantType}`);
            let url = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=${grantType}`;
            if (scope !== "") {
                url = `${url}&scope=${scope}`;
            }
            const response = yield node_fetch_1.default(url, {
                method: "post",
            });
            const json = yield response.json();
            // console.log("getting oauth token end", json);
            this.oAuthToken = json.access_token;
            return json;
        });
    }
    validateoAuthToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("validate oauth token (" + token + ") start");
            const response = yield node_fetch_1.default("https://id.twitch.tv/oauth2/validate", {
                headers: {
                    Authorization: `OAuth ${token}`,
                },
            });
            const json = yield response.json();
            // console.log("validate oauth token end", json);
            return json;
        });
    }
    getTwitchEmotesBySets(setIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkoAuthToken(secrets_1.SECRETS.botClientId, secrets_1.SECRETS.botClientSecret);
            const headers = this.getTwitchRequestHeaders();
            const emoteSetResponse = yield node_fetch_1.default(`https://api.twitch.tv/kraken/chat/emoticon_images?emotesets=${setIds.join(",")}`, { headers });
            let jsonData = yield emoteSetResponse.json();
            // console.log('emotes by set emotes', jsonData);
            const emoticonSets = jsonData.emoticon_sets || {};
            const formattedEmotes = [];
            setIds.forEach((setId) => {
                if (emoticonSets[setId]) {
                    emoticonSets[setId].forEach((emote) => {
                        formattedEmotes.push(new emote_1.Emote(emote.scale, emote.url, emote.code, emote.id, "twitch", emote.emoticon_set));
                    });
                }
            });
            return formattedEmotes;
        });
    }
    getTwitchEmotes(broadcasterId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.oAuthToken = secrets_1.SECRETS.irc.userOAuthPassword;
            yield this.checkoAuthToken(secrets_1.SECRETS.botClientId, secrets_1.SECRETS.botClientSecret, "", "authorization_code");
            const headers = this.getTwitchRequestHeaders();
            const emoteResponse = yield node_fetch_1.default(`${this.helixBaseUrl}/chat/emotes?broadcaster_id=${broadcasterId}`, { headers });
            // console.log("twitch emote response", emoteResponse);
            let responseBody = yield emoteResponse.json();
            // console.log("emotes", responseBody?.data);
            let emotes = [];
            if (((_a = responseBody === null || responseBody === void 0 ? void 0 : responseBody.data) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                emotes = responseBody.data;
            }
            // const subBadges = data.subscriber_badges || [];
            let formattedEmotes = [];
            const formattedSubBadges = [];
            // console.log("emotes yayay: ", emotes);
            emotes.forEach((emote) => {
                formattedEmotes.push(new emote_1.Emote(1, emote.images.url_1x, emote.name, emote.id, "twitch", emote.emote_set_id));
            });
            formattedEmotes = formattedEmotes.concat(this.loadEmotesFromConfig());
            // Object.keys(subBadges).forEach((objectKey: any) => {
            //   const subLoyaltyImages = [subBadges[objectKey].image_url_1x, subBadges[objectKey].image_url_2x, subBadges[objectKey].image_url_4x];
            //   formattedSubBadges.push(new SubBadge(objectKey, subBadges[objectKey].title, subLoyaltyImages));
            // });
            return new emote_1.TwitchEmoteResponse(broadcasterId, "channel name", "display name", formattedEmotes, formattedSubBadges).emotes;
        });
    }
    getBttvEmotesByChannel(channelName) {
        return __awaiter(this, void 0, void 0, function* () {
            const bttvChannelResponse = yield node_fetch_1.default(`https://api.betterttv.net/2/channels/${channelName}`);
            // console.log('unmanaged emotes', data);
            let data = yield bttvChannelResponse.json();
            const emotes = data.emotes || [];
            const formattedEmotes = [];
            emotes.forEach((emote) => {
                const formattedEmote = new emote_1.Emote(1, "", emote.code, emote.id, "bttv");
                formattedEmote.channel = emote.channel;
                formattedEmote.imageType = emote.imageType;
                formattedEmotes.push(formattedEmote);
            });
            return new emote_1.BttvEmoteResponse(data.urlTemplate, formattedEmotes).emotes;
            // return new BttvEmoteResponse('', []).emotes;
        });
    }
    getGlobalBttvEmotes() {
        return __awaiter(this, void 0, void 0, function* () {
            const globalBttvEmotes = yield node_fetch_1.default(`https://api.betterttv.net/3/cached/emotes/global`);
            // console.log('unmanaged emotes', data);
            let data = yield globalBttvEmotes.json();
            const emotes = data || [];
            const formattedEmotes = [];
            emotes.forEach((emote) => {
                const formattedEmote = new emote_1.Emote(1, "", emote.code, emote.id, "bttv");
                formattedEmote.channel = emote.channel;
                formattedEmote.imageType = emote.imageType;
                formattedEmotes.push(formattedEmote);
            });
            return new emote_1.BttvEmoteResponse(data.urlTemplate, formattedEmotes).emotes;
            // return new BttvEmoteResponse('', []).emotes;
        });
    }
    getCurrentSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkoAuthToken(secrets_1.SECRETS.botClientId, secrets_1.SECRETS.botClientSecret);
            const headers = this.getTwitchRequestHeaders();
            return yield node_fetch_1.default(`${this.helixBaseUrl}webhooks/subscriptions`, { method: "GET", headers: headers });
        });
    }
    // i want this thing to monitor for new people following when i am live
    subscribeToTopic(subscribe, leaseTimeInMinutes, topicCallbackName, topicUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkoAuthToken(secrets_1.SECRETS.botClientId, secrets_1.SECRETS.botClientSecret);
            const headers = this.getTwitchRequestHeaders();
            headers["Content-Type"] = "application/json";
            const options = {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    "hub.callback": `${this.pubSubCallbackUrl}${topicCallbackName}`,
                    "hub.mode": subscribe ? "subscribe" : "unsubscribe",
                    "hub.topic": `${this.helixBaseUrl}${topicUrl}`,
                    "hub.lease_seconds": 60 * leaseTimeInMinutes,
                    "hub.secret": secrets_1.SECRETS.botPublisherSecret,
                }),
            };
            return yield node_fetch_1.default(`${this.helixBaseUrl}webhooks/hub`, options);
        });
    }
    // get all bttv emotes available
    // https://api.betterttv.net/3/emotes/shared?limit=100
    // https://api.betterttv.net/3/emotes/shared?before=5e176c89b9741121048064c0&limit=100
    loadEmotesFromConfig() {
        const emotes = [];
        for (const emoteSetKey in extra_emotes_1.extraEmotes) {
            const emoteSetId = extra_emotes_1.extraEmotes[emoteSetKey].id;
            for (const emoteKey in extra_emotes_1.extraEmotes[emoteSetKey]) {
                if (emoteKey !== "id") {
                    emotes.push(new emote_1.Emote(1, "", emoteKey, extra_emotes_1.extraEmotes[emoteSetKey][emoteKey], "twitch", emoteSetId));
                }
            }
        }
        return emotes;
    }
    handleError(error) {
        console.log("Error", error);
    }
}
exports.TwitchApiV5 = TwitchApiV5;
