"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlayerSummary {
    constructor(rawJsonData) {
        this.convertJsonToObject(rawJsonData);
    }
    getJoinableGameLink() {
        let result = `${this.personaName} does not have a joinable open lobby. Are you in offline mode?`;
        if (this.lobbySteamId && this.gameId && this.steamId) {
            result = `steam://joinlobby/${this.gameId}/${this.lobbySteamId}/${this.steamId}`;
        }
        return result;
    }
    convertJsonToObject(rawJson) {
        this.steamId = rawJson.steamid;
        this.communityVisibilityState = rawJson.communityvisibilitystate;
        this.profileState = rawJson.profilestate;
        this.personaName = rawJson.personaname;
        this.lastLogoff = rawJson.lastlogoff;
        this.profileUrl = rawJson.profileurl;
        this.avatar = rawJson.avatar;
        this.avatarMedium = rawJson.avatarmedium;
        this.avatarFull = rawJson.avatarfull;
        this.personaState = rawJson.personastate;
        this.primaryClanId = rawJson.primaryclanid;
        this.timeCreated = rawJson.timecreated;
        this.personaStateFlags = rawJson.personastateflags;
        this.gameExtraInfo = rawJson.gameextrainfo;
        this.gameId = rawJson.gameid;
        this.lobbySteamId = rawJson.lobbysteamid;
        this.locCountryCode = rawJson.loccountrycode;
        this.locStateCode = rawJson.locstatecode;
        this.locCityId = rawJson.loccityid;
    }
}
exports.PlayerSummary = PlayerSummary;
// example response
// "steamid": "76561197985160398",
// "communityvisibilitystate": 3,
// "profilestate": 1,
// "personaname": "Treeeeeee",
// "lastlogoff": 1579486408,
// "profileurl": "https://steamcommunity.com/id/itsatreee/",
// "avatar": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/f6/f632f7d542d2bf56a178a65eebc8e40ce40ad359.jpg",
// "avatarmedium": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/f6/f632f7d542d2bf56a178a65eebc8e40ce40ad359_medium.jpg",
// "avatarfull": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/f6/f632f7d542d2bf56a178a65eebc8e40ce40ad359_full.jpg",
// "personastate": 1,
// "primaryclanid": "103582791461182090",
// "timecreated": 1159150464,
// "personastateflags": 0,
// "gameextrainfo": "Age of Empires II: Definitive Edition",
// "gameid": "813780",
// "lobbysteamid": "109775241019660960",
// "loccountrycode": "US",
// "locstatecode": "AK",
// "loccityid": 61
