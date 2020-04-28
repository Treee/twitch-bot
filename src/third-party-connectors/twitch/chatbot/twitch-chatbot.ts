import { ChatUserstate } from "tmi.js";

import { SteamApi } from '../../steam/steam-api';
import { SocketMessageEnum } from "../socket-message-enum";
import { SECRETS } from '../../../secrets';
import { EmoteParser } from "./parsers/emote-parser";
import { TwitchApiV5 } from "../twitch-api-v5";
import { Emote } from "../../../overlay-widgets/emote-widget/emotes/emote";

export class TwitchChatbot {

    private steamApi: SteamApi;
    private twitchApi: TwitchApiV5;
    private debugMode: boolean = false;
    private chatCommands: string[] = ['!joinlobby'];
    private emoteCodesToLookFor: string[] = [];

    private emoteParser = new EmoteParser();

    constructor(twitchApi: TwitchApiV5, steamApi: SteamApi, debugMode: boolean = false) {
        this.twitchApi = twitchApi;
        this.steamApi = steamApi;
        this.debugMode = debugMode;
    }

    pullAllEmotes(clientId: string, channel: string, emoteSetIds: number[] = []): Promise<Emote[]> {
        return Promise.all([
            this.twitchApi.getTwitchEmotes(clientId, channel),
            this.twitchApi.getTwitchEmotesBySets(clientId, emoteSetIds),
            this.twitchApi.getBttvEmotesByChannel(channel),
            this.twitchApi.getGlobalBttvEmotes()
        ]).then((values) => {
            // emoteWidget.twitchSubBadges = values[0].subBadges;
            const emotes: Emote[] = [];
            return emotes.concat(values[0]).concat(values[1]).concat(values[2]).concat(values[3]);
        }, (error) => {
            const emotes: Emote[] = [];
            return emotes;
        });
    }

    setEmoteCodes(emotes: string[]): void {
        this.emoteCodesToLookFor = emotes;
    }

    getEmoteCodes(): string[] {
        return this.emoteCodesToLookFor;
    }

    emotesExist(): boolean {
        return this.emoteCodesToLookFor.length > 0;
    }

    handleMessage(target: string, context: ChatUserstate, msg: string, self: boolean, webSocketCb?: Function, twitchClientCb?: Function): void {
        if (this.debugMode) { this.debugMessages(target, context, msg, self); } // print if debug
        if (self) { return; } // Ignore messages from the bot

        const invokedCommands = this.parseForCommands(msg);
        const invokedEmotes = this.emoteParser.parseComplete(msg, this.emoteCodesToLookFor);
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