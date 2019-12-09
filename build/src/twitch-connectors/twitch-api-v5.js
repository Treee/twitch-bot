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
    getTwitchEmotes(emoteConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = this.getTwitchRequestHeaders(emoteConfig.clientId);
            return yield fetch(`https://api.twitch.tv/kraken/users?login=${emoteConfig.channel}`, { headers }).then((response) => __awaiter(this, void 0, void 0, function* () {
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
    getBttvEmotes(emoteConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch(`https://api.betterttv.net/2/channels/${emoteConfig.channel}`).then((response) => __awaiter(this, void 0, void 0, function* () {
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
