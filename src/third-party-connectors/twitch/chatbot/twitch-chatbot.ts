import { ChatUserstate } from "tmi.js";

import { SteamApi } from '../../steam/steam-api';
import { SocketMessageEnum } from "../socket-message-enum";
import SECRETS from '../../../secrets';

export class TwitchChatbot {

    private steamApi: SteamApi;
    private debugMode: boolean = false;
    private chatCommands: string[] = ['!joinlobby'];
    private emoteCodesToLookFor: string[] = [];
    private emoteSuffixes = ['_SA', '_BW', '_HF', '_VF', '_SQ', '_TK', '_SG', '_RD'];

    constructor(steamApi: SteamApi, debugMode: boolean = false) {
        this.steamApi = steamApi;
        this.debugMode = debugMode;
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
        const invokedEmotes = this.parseForEmotes(msg);
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

    private parseForEmotes(msg: string): string[] {
        const invokedEmotes: string[] = [];
        const words = msg.split(' ');
        words.forEach((word: string) => {
            this.emoteCodesToLookFor.forEach((emoteCode) => {
                if (word.toLowerCase() === emoteCode.toLowerCase()) {
                    invokedEmotes.push(emoteCode);
                } else { // check for modified emote codes (like _SA or _RD or BW or _SQ)
                    this.emoteSuffixes.forEach((suffix) => {
                        if (word.toLowerCase() === `${emoteCode}${suffix}`.toLowerCase()) {
                            invokedEmotes.push(`${emoteCode}${suffix}`);
                        }
                    });
                }
            });
        });
        return invokedEmotes;
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