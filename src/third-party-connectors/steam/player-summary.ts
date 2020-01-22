export class PlayerSummary {
    private steamId!: string;
    private communityVisibilityState!: number;
    private profileState!: number;
    private personaName!: string;
    private lastLogoff!: number;
    private profileUrl!: string;
    private avatar!: string;
    private avatarMedium!: string;
    private avatarFull!: string;
    private personaState!: number;
    private primaryClanId!: string;
    private timeCreated!: number;
    private personaStateFlags!: number;
    private gameExtraInfo!: string;
    private gameId!: string;
    private lobbySteamId!: string;
    private locCountryCode!: string;
    private locStateCode!: string;
    private locCityId!: number;

    constructor(rawJsonData: string) {
        this.convertJsonToObject(rawJsonData);
    }

    getJoinableGameLink(): string {
        let result = `${this.personaName} does not have an open lobby.`;
        if (this.lobbySteamId && this.gameId && this.steamId) {
            result = `steam://joinlobby/${this.gameId}/${this.lobbySteamId}/${this.steamId}`;
        }
        return result;
    }

    private convertJsonToObject(rawJson: any): void {
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
