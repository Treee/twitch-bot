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
class SteamApi {
    constructor() { }
    getSteamRequestHeaders() {
        const headers = new Headers();
        headers.append('mode', 'no-cors');
        return headers;
    }
    getAoEJoinLink(apiKey, steamUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = this.getSteamRequestHeaders();
            return yield fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamUserId}`, { headers }).then((response) => {
                return '';
            }, (error) => {
                throw new Error(error);
            });
        });
    }
    getPlayerSummaries(apiKey, steamUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = this.getSteamRequestHeaders();
            return yield fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamUserId}`).then((response) => {
                console.log('steam resposne', response);
                return [];
            }, (error) => {
                console.error('Error', error);
                return [];
            });
        });
    }
}
exports.SteamApi = SteamApi;
