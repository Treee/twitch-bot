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
exports.SteamApi = void 0;
// https://steamcommunity.com/dev
const fetch = require('node-fetch');
const player_summary_1 = require("./player-summary");
class SteamApi {
    constructor() { }
    // if you are invisible in steam, this will return no lobby
    getSteamJoinableLobbyLink(apiKey, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getPlayerSummaries(apiKey, userId).then((playerSummarys) => {
                if (playerSummarys.length > 0) {
                    return playerSummarys[0].getJoinableGameLink();
                }
            }, (error) => {
                console.error('Error', error);
                return '';
            });
        });
    }
    getPlayerSummaries(apiKey, steamUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamUserId}`).then((response) => __awaiter(this, void 0, void 0, function* () {
                const data = yield response.json();
                const playerSummariesRaw = data.response.players;
                const playerSummaries = [];
                playerSummariesRaw.forEach((playerSummary) => {
                    playerSummaries.push(new player_summary_1.PlayerSummary(playerSummary));
                });
                return playerSummaries;
            }), (error) => {
                console.error('Error', error);
                return [];
            });
        });
    }
}
exports.SteamApi = SteamApi;
