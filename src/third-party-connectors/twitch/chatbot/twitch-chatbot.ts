import { ChatUserstate } from "tmi.js";
import { SocketMessageEnum } from '../socket-message-enum';

export class TwitchChatbot {

    private debugMode: boolean = false;
    private chatCommands: string[] = ['!joinlobby'];
    private emoteCodesToLookFor: string[] = [];
    private emoteSuffixes = ['_SA', '_BW', '_HF', '_VF', '_SQ', '_TK', '_SG', '_RD'];

    constructor(debugMode: boolean = false) {
        this.debugMode = debugMode;
    }

    handleMessage(target: string, context: ChatUserstate, msg: string, self: boolean) {
        if (this.debugMode) { this.debugMessages(target, context, msg, self); } // print if debug
        if (self) { return; } // Ignore messages from the bot

        const invokedCommands = this.parseForCommands(msg);
        const invokedEmotes = this.parseForEmotes(msg);
        if (this.debugMode) { this.debugMessages(invokedCommands, invokedEmotes); }

        return { commands: invokedCommands, emotes: invokedEmotes };
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
        args.forEach((arg: any) => {
            console.log(`Param${++messageCounter}: ${arg}`);
        });
    }

}