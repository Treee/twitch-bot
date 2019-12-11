import { TwitchEmote, TwitchEmoteResponse, BttvEmoteResponse, BttvEmote, SubBadge } from "../overlay-widgets/emote-widget/emote";

export class TwitchApiV5 {
    constructor() { }

    getTwitchRequestHeaders(clientId: string): Headers {
        const headers = new Headers();
        headers.append('Client-ID', clientId);
        headers.append('Accept', 'application/vnd.twitchtv.v5+json');
        return headers;
    }

    async getTwitchEmotesBySets(clientId: string, setIds: number[]): Promise<TwitchEmote[]> {
        const headers = this.getTwitchRequestHeaders(clientId);
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
        }, (error) => {
            return [];
        });
    }

    async getTwitchEmotes(clientId: string, channelName: string) {
        const headers = this.getTwitchRequestHeaders(clientId);
        return await fetch(`https://api.twitch.tv/kraken/users?login=${channelName}`, { headers }).then(async (response) => {
            // console.log('user', data.users);
            let data = await response.json();
            let userId = -9999;
            if (data.users.length > 0) {
                userId = data.users[0]._id;
            }
            return userId;
        }).then(async (resolvedUserId) => {
            return await fetch(`https://api.twitchemotes.com/api/v4/channels/${resolvedUserId}`);
        }).then(async (response) => {
            let data = await response.json();
            const emotes = data.emotes || [];
            const subBadges = data.subscriber_badges || [];
            const formattedEmotes: TwitchEmote[] = [];
            const formattedSubBadges: SubBadge[] = [];
            emotes.forEach((emote: any) => {
                formattedEmotes.push(new TwitchEmote(emote.code, emote.emoticon_set, emote.id));
            });
            Object.keys(subBadges).forEach((objectKey: any) => {
                const subLoyaltyImages = [subBadges[objectKey].image_url_1x, subBadges[objectKey].image_url_2x, subBadges[objectKey].image_url_4x];
                formattedSubBadges.push(new SubBadge(objectKey, subBadges[objectKey].title, subLoyaltyImages));
            });
            return new TwitchEmoteResponse(data.channel_id, data.channel_name, data.display_name, formattedEmotes, formattedSubBadges);
        }, (error) => {
            return new TwitchEmoteResponse('', '', '', [], []);
        });
    }

    async getBttvEmotes(channelName: string) {
        return await fetch(`https://api.betterttv.net/2/channels/${channelName}`).then(async (response) => {
            // console.log('unmanaged emotes', data);
            let data = await response.json();
            const emotes = data.emotes || [];
            const formattedEmotes: BttvEmote[] = [];
            emotes.forEach((emote: any) => {
                formattedEmotes.push(new BttvEmote(emote.channel, emote.code, emote.id, emote.imageType));
            });
            return new BttvEmoteResponse(data.urlTemplate, formattedEmotes);
        }, (error) => {
            return new BttvEmoteResponse('', []);
        });
    }

}