import { TwitchEmote, SubBadge, TwitchEmoteResponse, BttvEmote, BttvEmoteResponse } from "../../overlay-widgets/emote-widget/emotes/emote";
import { TwitchSubscriber } from "./twitch-subscriber";
import fetch from 'node-fetch';
import { extraEmotes } from "./chatbot/extra-emotes";

export class TwitchApiV5 {

    oAuthToken: string = '';

    constructor() { }

    test(clientId: string) {
        const t = new TwitchSubscriber();
        t.subscribeToWebhook('https://api.twitch.tv/helix/users/follows?first=1&to_id=114260623', 'subscribe', clientId).then((data) => {
            console.log('data', data);
        });
    }

    getTwitchRequestHeaders(clientId: string, oauthToken: string) {
        const headers = {
            'Client-ID': clientId,
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Authorization': `Bearer ${oauthToken}`
        };
        return headers;
    }

    async checkoAuthToken(clientId: string, clientSecret: string) {
        return await this.validateoAuthToken(this.oAuthToken).then(async (response) => {
            if (response.status && (response.status === 401 || response.status === 403)) {
                return await this.getoAuthToken(clientId, clientSecret);
            } else if (response.access_token) {
                return response;
            }
        });
    }

    private async getoAuthToken(clientId: string, clientSecret: string, scope: string = '', grantType: string = 'client_credentials') {
        let url = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=${grantType}`;
        if (scope !== '') {
            url = `${url}&scope=${scope}`;
        }
        return await fetch(url, {
            method: 'post'
        }).then((response) => {
            return response.json();
            // { access_token: 'abcdefghijklmnopqrstuvwxyz',
            //   expires_in: 5186058,
            //   token_type: 'bearer' }
        });
    }

    private async validateoAuthToken(token: string) {
        return await fetch('https://id.twitch.tv/oauth2/validate', {
            headers: {
                'Authorization': `OAuth ${token}`
            }
        }).then((response) => {
            return response.json();
        });
    }

    async getTwitchEmotesBySets(clientId: string, setIds: number[]): Promise<TwitchEmote[]> {
        const headers = this.getTwitchRequestHeaders(clientId, this.oAuthToken);
        return await fetch(`https://api.twitch.tv/kraken/chat/emoticon_images?emotesets=${setIds.join(',')}`, { headers }).then(async (response) => {
            let data = await response.json();
            // console.log('emotes by set emotes', data);
            const emoticonSets = data.emoticon_sets || {};
            const formattedEmotes: TwitchEmote[] = [];
            setIds.forEach((setId: number) => {
                if (emoticonSets[setId]) {
                    emoticonSets[setId].forEach((emote: any) => {
                        formattedEmotes.push(new TwitchEmote(emote.code, emote.emoticon_set, emote.id));
                    });
                }
            });
            return formattedEmotes;
        }, () => {
            return [];
        });
    }

    async getTwitchEmotes(clientId: string, channelName: string) {
        const headers = this.getTwitchRequestHeaders(clientId, this.oAuthToken);
        return await fetch(`https://api.twitch.tv/kraken/users?login=${channelName}`, { headers }).then(async (response: any) => {
            // console.log('user', data.users);
            let data = await response.json();
            let userId = -9999;
            if (data.users.length > 0) {
                userId = data.users[0]._id;
            }
            return userId;
        }).then(async (resolvedUserId: any) => {
            return await fetch(`https://api.twitchemotes.com/api/v4/channels/${resolvedUserId}`);
        }).then(async (response: any) => {
            let data = await response.json();
            const emotes = data.emotes || [];
            const subBadges = data.subscriber_badges || [];
            let formattedEmotes: TwitchEmote[] = [];
            const formattedSubBadges: SubBadge[] = [];
            emotes.forEach((emote: any) => {
                formattedEmotes.push(new TwitchEmote(emote.code, emote.emoticon_set, emote.id));
            });
            formattedEmotes = formattedEmotes.concat(this.loadEmotesFromConfig());
            Object.keys(subBadges).forEach((objectKey: any) => {
                const subLoyaltyImages = [subBadges[objectKey].image_url_1x, subBadges[objectKey].image_url_2x, subBadges[objectKey].image_url_4x];
                formattedSubBadges.push(new SubBadge(objectKey, subBadges[objectKey].title, subLoyaltyImages));
            });
            return new TwitchEmoteResponse(data.channel_id, data.channel_name, data.display_name, formattedEmotes, formattedSubBadges).emotes;
        }, () => {
            return new TwitchEmoteResponse('', '', '', [], []).emotes;
        });
    }

    async getBttvEmotesByChannel(channelName: string) {
        return await fetch(`https://api.betterttv.net/2/channels/${channelName}`).then(async (response) => {
            // console.log('unmanaged emotes', data);
            let data = await response.json();
            const emotes = data.emotes || [];
            const formattedEmotes: BttvEmote[] = [];
            emotes.forEach((emote: any) => {
                formattedEmotes.push(new BttvEmote(emote.channel, emote.code, emote.id, emote.imageType));
            });
            return new BttvEmoteResponse(data.urlTemplate, formattedEmotes).emotes;
        }, (error) => {
            return new BttvEmoteResponse('', []).emotes;
        });
    }

    async getGlobalBttvEmotes() {
        return await fetch(`https://api.betterttv.net/3/cached/emotes/global`).then(async (response) => {
            // console.log('unmanaged emotes', data);
            let data = await response.json();
            const emotes = data || [];
            const formattedEmotes: BttvEmote[] = [];
            emotes.forEach((emote: any) => {
                formattedEmotes.push(new BttvEmote(emote.channel, emote.code, emote.id, emote.imageType));
            });
            return new BttvEmoteResponse(data.urlTemplate, formattedEmotes).emotes;
        }, (error) => {
            return new BttvEmoteResponse('', []).emotes;
        });
    }

    // get all bttv emotes available
    // https://api.betterttv.net/3/emotes/shared?limit=100
    // https://api.betterttv.net/3/emotes/shared?before=5e176c89b9741121048064c0&limit=100

    loadEmotesFromConfig(): TwitchEmote[] {
        const emotes = [];
        for (const emoteSetKey in extraEmotes) {
            const emoteSetId = extraEmotes[emoteSetKey].id;
            for (const emoteKey in extraEmotes[emoteSetKey]) {
                emotes.push(new TwitchEmote(emoteKey, emoteSetId, extraEmotes[emoteSetKey][emoteKey]));
            }
        }
        return emotes;
    }

}