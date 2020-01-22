"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TwitchChatbot {
    constructor(debugMode = false) {
        this.debugMode = false;
        this.chatCommands = ['!joinlobby'];
        this.emoteCodesToLookFor = [];
        this.emoteSuffixes = ['_SA', '_BW', '_HF', '_VF', '_SQ', '_TK', '_SG', '_RD'];
        this.debugMode = debugMode;
    }
    setEmoteCodes(emotes) {
        this.emoteCodesToLookFor = emotes;
    }
    getEmoteCodes() {
        return this.emoteCodesToLookFor;
    }
    emotesExist() {
        return this.emoteCodesToLookFor.length > 0;
    }
    handleMessage(target, context, msg, self) {
        if (this.debugMode) {
            this.debugMessages(target, context, msg, self);
        } // print if debug
        if (self) {
            return;
        } // Ignore messages from the bot
        const invokedCommands = this.parseForCommands(msg);
        const invokedEmotes = this.parseForEmotes(msg);
        if (this.debugMode) {
            this.debugMessages(invokedCommands, invokedEmotes);
        }
        return { commands: invokedCommands, emotes: invokedEmotes };
    }
    parseForCommands(msg) {
        const invokedCommands = [];
        const commandName = msg.trim();
        this.chatCommands.forEach((command) => {
            if (commandName.startsWith(command)) {
                invokedCommands.push(command);
            }
        });
        return invokedCommands;
    }
    parseForEmotes(msg) {
        const invokedEmotes = [];
        const words = msg.split(' ');
        words.forEach((word) => {
            this.emoteCodesToLookFor.forEach((emoteCode) => {
                if (word.toLowerCase() === emoteCode.toLowerCase()) {
                    invokedEmotes.push(emoteCode);
                }
                else { // check for modified emote codes (like _SA or _RD or BW or _SQ)
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
    debugMessages(...args) {
        let messageCounter = 0;
        let message = '';
        args.forEach((arg) => {
            message = message.concat(`Param${++messageCounter}: ${JSON.stringify(arg)}, `);
        });
        console.log('Debug Log: ', message);
    }
}
exports.TwitchChatbot = TwitchChatbot;
