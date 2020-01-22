// https://steamcommunity.com/dev
const fetch = require('node-fetch');
import { PlayerSummary } from "./player-summary";

export class SteamApi {
    constructor() { }

    // if you are invisible in steam, this will return no lobby
    async getSteamJoinableLobbyLink(apiKey: string, userId: string) {
        return this.getPlayerSummaries(apiKey, userId).then((playerSummarys) => {
            if (playerSummarys.length > 0) {
                return playerSummarys[0].getJoinableGameLink();
            }
        }, (error) => {
            console.error('Error', error);
            return '';
        });
    }

    private async getPlayerSummaries(apiKey: string, steamUserId: string): Promise<PlayerSummary[]> {
        return await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamUserId}`).then(async (response: any) => {
            const data = await response.json();
            const playerSummariesRaw = data.response.players;
            const playerSummaries: PlayerSummary[] = [];
            playerSummariesRaw.forEach((playerSummary: any) => {
                playerSummaries.push(new PlayerSummary(playerSummary));
            });
            return playerSummaries;
        }, (error: any) => {
            console.error('Error', error);
            return [];
        });
    }
}