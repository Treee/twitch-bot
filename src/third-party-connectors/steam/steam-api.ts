// https://steamcommunity.com/dev
import { PlayerSummary } from "./player-summary";

export class SteamApi {
    constructor() { }

    private getSteamRequestHeaders(): Headers {
        const headers = new Headers();
        headers.append('mode', 'no-cors');
        return headers;
    }

    async getAoEJoinLink(apiKey: string, steamUserId: string): Promise<string> {
        const headers = this.getSteamRequestHeaders();
        return await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamUserId}`, { headers }).then((response) => {

            return '';
        }, (error) => {
            throw new Error(error);
        });
    }


    async getPlayerSummaries(apiKey: string, steamUserId: string): Promise<PlayerSummary[]> {
        const headers = this.getSteamRequestHeaders();
        return await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamUserId}`).then((response) => {
            console.log('steam resposne', response);
            return [];
        }, (error) => {
            console.error('Error', error);
            return [];
        });
    }
    // async getTwitchEmotesBySets(clientId: string, setIds: number[]): Promise<TwitchEmote[]> {
    //     const headers = this.getTwitchRequestHeaders(clientId);
    //     return await fetch(`https://api.twitch.tv/kraken/chat/emoticon_images?emotesets=${setIds.join(',')}`, { headers }).then(async (response) => {
    //         let data = await response.json();
    //         // console.log('emotes by set emotes', data);
    //         const emoticonSets = data.emoticon_sets || {};
    //         const formattedEmotes: TwitchEmote[] = [];
    //         setIds.forEach((setId: number) => {
    //             if (emoticonSets[setId]) {
    //                 emoticonSets[setId].forEach((emote: any) => {
    //                     formattedEmotes.push(new TwitchEmote(emote.code, emote.emoticon_set, emote.id));
    //                 });
    //             }
    //         });
    //         return formattedEmotes;
    //     }, (error) => {
    //         return [];
    //     });
    // }
}