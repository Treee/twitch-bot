export class SteamApi {
    constructor() { }


    async getAoEJoinLink(apiKey: string, steamUserId: string): Promise<string> {
        return await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamUserId}`).then((response) => {
            return '';
        }, (error) => {
            throw new Error(error);
        });
    }


    private async getPlayerSummaries(): Promise<any> {

    }
    // getTwitchRequestHeaders(clientId: string): Headers {
    //     const headers = new Headers();
    //     headers.append('Client-ID', clientId);
    //     headers.append('Accept', 'application/vnd.twitchtv.v5+json');
    //     return headers;
    // }

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