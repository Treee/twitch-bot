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
                return new emote_1.BttvEmoteResponse(data.urlTemplate, formattedEmotes).emotes;
            }), (error) => {
                return new emote_1.BttvEmoteResponse('', []).emotes;
            });
        });
    }
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
        return emotes;
    }
}
exports.TwitchApiV5 = TwitchApiV5;
