import { TwitchEmote, SubBadge, TwitchEmoteResponse, BttvEmote, BttvEmoteResponse } from "../../overlay-widgets/emote-widget/emotes/emote";

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
        }, (error) => {
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
        const hahahalidaysEmoteSet = 472873131;
        emotes.push(new TwitchEmote('HahaSleep', hahahalidaysEmoteSet, '301108041'));
        emotes.push(new TwitchEmote('HahaThink', hahahalidaysEmoteSet, '301108032'));
        emotes.push(new TwitchEmote('HahaTurtledove', hahahalidaysEmoteSet, '301108011'));
        emotes.push(new TwitchEmote('HahaBaby', hahahalidaysEmoteSet, '301108084'));
        emotes.push(new TwitchEmote('HahaDoge', hahahalidaysEmoteSet, '301108082'));
        emotes.push(new TwitchEmote('HahaHide', hahahalidaysEmoteSet, '301108072'));
        emotes.push(new TwitchEmote('HahaSweat', hahahalidaysEmoteSet, '301108037'));
        emotes.push(new TwitchEmote('HahaCat', hahahalidaysEmoteSet, '301108083'));
        emotes.push(new TwitchEmote('HahaLean', hahahalidaysEmoteSet, '301108068'));
        emotes.push(new TwitchEmote('HahaShrugRight', hahahalidaysEmoteSet, '301108045'));
        emotes.push(new TwitchEmote('HahaShrugMiddle', hahahalidaysEmoteSet, '301108046'));
        emotes.push(new TwitchEmote('HahaDreidel', hahahalidaysEmoteSet, '301112663'));
        emotes.push(new TwitchEmote('HahaShrugLeft', hahahalidaysEmoteSet, '301108047'));
        emotes.push(new TwitchEmote('HahaBall', hahahalidaysEmoteSet, '301112669'));
        emotes.push(new TwitchEmote('HahaNyandeer', hahahalidaysEmoteSet, '301114312'));
        emotes.push(new TwitchEmote('Haha2020', hahahalidaysEmoteSet, '301112670'));
        emotes.push(new TwitchEmote('HahaThisisfine', hahahalidaysEmoteSet, '301108013'));
        emotes.push(new TwitchEmote('HahaPoint', hahahalidaysEmoteSet, '301108057'));
        emotes.push(new TwitchEmote('HahaReindeer', hahahalidaysEmoteSet, '301108048'));
        emotes.push(new TwitchEmote('HahaElf', hahahalidaysEmoteSet, '301108081'));
        emotes.push(new TwitchEmote('HahaNutcracker', hahahalidaysEmoteSet, '301108063'));
        emotes.push(new TwitchEmote('HahaGoose', hahahalidaysEmoteSet, '301108075'));
        emotes.push(new TwitchEmote('HahaGingercat', hahahalidaysEmoteSet, '301108078'));

        const prideEmoteSet = 472873131;
        emotes.push(new TwitchEmote('PrideWingL', prideEmoteSet, '300354442'));
        emotes.push(new TwitchEmote('PrideWingR', prideEmoteSet, '300354435'));
        emotes.push(new TwitchEmote('PrideShine', prideEmoteSet, '300354448'));
        emotes.push(new TwitchEmote('PrideCheers', prideEmoteSet, '300354469'));
        emotes.push(new TwitchEmote('PrideBalloons', prideEmoteSet, '300352359'));
        emotes.push(new TwitchEmote('PrideLionHey', prideEmoteSet, '300352355'));
        emotes.push(new TwitchEmote('PrideLionYay', prideEmoteSet, '300352343'));

        const rpgEmoteSet = 472873132;
        emotes.push(new TwitchEmote('RPGBukka', rpgEmoteSet, '300904281'));
        emotes.push(new TwitchEmote('RPGFei', rpgEmoteSet, '300904288'));
        emotes.push(new TwitchEmote('RPGGhosto', rpgEmoteSet, '300904290'));
        emotes.push(new TwitchEmote('RPGStaff', rpgEmoteSet, '300904299'));
        emotes.push(new TwitchEmote('RPGYonger', rpgEmoteSet, '300904302'));
        emotes.push(new TwitchEmote('RPGEpicStaff', rpgEmoteSet, '300904286'));

        return emotes;
    }

}