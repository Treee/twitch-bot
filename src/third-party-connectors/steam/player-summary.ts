export class PlayerSummary {
    steamId!: string;
    communityVisibilityState!: number;
    profileState!: number;
    personaName!: string;
    lastlogoff!: number;
    profileurl!: string;
    avatar!: string;
    avatarMedium!: string;
    avatarFull!: string;
    personaState!: number;
    primaryClanId!: string;
    timeCreated!: number;
    personaStateFlags!: number;
    gameExtraInfo!: string;
    gameId!: string;
    lobbySteamId!: string;
    locCountryCode!: string;
    locStateCode!: string;
    locCityId!: number;

    constructor() { }
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
