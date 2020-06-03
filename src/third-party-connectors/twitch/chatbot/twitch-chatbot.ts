import { ChatUserstate } from "tmi.js";

import { SteamApi } from '../../steam/steam-api';
import { SocketMessageEnum } from "../socket-message-enum";
import { SECRETS } from '../../../secrets';
import { EmoteParser } from "./parsers/emote-parser";
import { TwitchApiV5 } from "../twitch-api-v5";
import { Emote } from "../../../helpers/emote";

export class TwitchChatbot {

    private steamApi: SteamApi;
    private twitchApi: TwitchApiV5;
    private debugMode: boolean = false;
    private chatCommands: string[] = ['!joinlobby'];
    emotesToLookFor: Emote[] = [];

    private emoteParser = new EmoteParser();

    constructor(twitchApi: TwitchApiV5, steamApi: SteamApi, debugMode: boolean = false) {
        this.twitchApi = twitchApi;
        this.steamApi = steamApi;
        this.debugMode = debugMode;
    }

    async pullAllEmotes(channel: string, emoteSetIds: number[] = []): Promise<Emote[]> {
        console.log(`params 1: ${channel} 2: ${emoteSetIds}`);
        const twitchEmotes = await this.twitchApi.getTwitchEmotes(channel);
        const twitchEmoteSets = await this.twitchApi.getTwitchEmotesBySets(emoteSetIds);
        const bttvChannelEmotes = await this.twitchApi.getBttvEmotesByChannel(channel);
        const bttvGlobalEmotes = await this.twitchApi.getGlobalBttvEmotes();

        // emoteWidget.twitchSubBadges = values[0].subBadges;
        let emotes: Emote[] = [];
        emotes = emotes.concat(twitchEmotes).concat(twitchEmoteSets).concat(bttvChannelEmotes).concat(bttvGlobalEmotes);
        this.setEmoteCodes(emotes);
        return emotes;
    }

    setEmoteCodes(emotes: Emote[]): void {
        this.emotesToLookFor = emotes;
    }

    getEmoteCodes(): string[] {
        const emoteCodes = this.emotesToLookFor.slice(0).map((emote) => {
            return emote.code;
        });
        return emoteCodes;
    }

    emotesExist(): boolean {
        return this.emotesToLookFor.length > 0;
    }

    handleMessage(target: string, context: ChatUserstate, msg: string, self: boolean, webSocketCb?: Function, twitchClientCb?: Function): void {
        if (this.debugMode) { this.debugMessages(target, context, msg, self); } // print if debug
        if (self) { return; } // Ignore messages from the bot

        const invokedCommands = this.parseForCommands(msg);
        const invokedEmotes = this.emoteParser.parseComplete(msg, this.getEmoteCodes());
        if (this.debugMode) { this.debugMessages(invokedCommands, invokedEmotes); }
        if (invokedEmotes.length > 0 && webSocketCb) {
            webSocketCb(SocketMessageEnum.FoundEmotes, invokedEmotes);
        }

        if (invokedCommands.length > 0 && twitchClientCb) {
            invokedCommands.forEach((command) => {
                this.commandManager(command, twitchClientCb);
            });
        }
    }

    private commandManager(command: string, twitchClientCb: Function): void {
        if (command.toLowerCase() === '!joinlobby') {
            this.steamApi.getSteamJoinableLobbyLink(SECRETS.steam.apiKey, SECRETS.steam.userId).then((steamJoinLink) => {
                if (steamJoinLink?.startsWith('steam://joinlobby/')) {
                    twitchClientCb('Copy and paste the below into your browser to join my game directly through steam!!');
                }
                twitchClientCb(steamJoinLink);
            });
        }
    }

    private parseForCommands(msg: string): string[] {
        const invokedCommands: string[] = [];
        const commandName = msg.trim();
        this.chatCommands.forEach((command: string) => {
            if (commandName.startsWith(command)) {
                invokedCommands.push(command);
            }
        });
        return invokedCommands;
    }

    private debugMessages(...args: any) {
        let messageCounter = 0;
        let message = '';
        args.forEach((arg: any) => {
            message = message.concat(`Param${++messageCounter}: ${JSON.stringify(arg)}, `);
        });
        console.log('Debug Log: ', message);
    }

}