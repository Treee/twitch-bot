"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_message_enum_1 = require("../socket-message-enum");
const secrets_1 = __importDefault(require("../../../secrets"));
const emote_parser_1 = require("./parsers/emote-parser");
class TwitchChatbot {
    constructor(steamApi, debugMode = false) {
        this.debugMode = false;
        this.chatCommands = ['!joinlobby'];
        this.emoteCodesToLookFor = [];
        this.emoteParser = new emote_parser_1.EmoteParser();
        this.steamApi = steamApi;
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
    handleMessage(target, context, msg, self, webSocketCb, twitchClientCb) {
        if (this.debugMode) {
            this.debugMessages(target, context, msg, self);
        } // print if debug
        if (self) {
            return;
        } // Ignore messages from the bot
        console.log('msg', msg);
        const invokedCommands = this.parseForCommands(msg);
        const invokedEmotes = this.emoteParser.parseComplete(msg, this.emoteCodesToLookFor);
        if (this.debugMode) {
            this.debugMessages(invokedCommands, invokedEmotes);
        }
        console.log('invoked emotes', invokedEmotes);
        if (invokedEmotes.length > 0 && webSocketCb) {
            webSocketCb(socket_message_enum_1.SocketMessageEnum.FoundEmotes, invokedEmotes);
        }
        if (invokedCommands.length > 0 && twitchClientCb) {
            invokedCommands.forEach((command) => {
                this.commandManager(command, twitchClientCb);
            });
        }
    }
    commandManager(command, twitchClientCb) {
        if (command.toLowerCase() === '!joinlobby') {
            this.steamApi.getSteamJoinableLobbyLink(secrets_1.default.steam.apiKey, secrets_1.default.steam.userId).then((steamJoinLink) => {
                var _a;
                if ((_a = steamJoinLink) === null || _a === void 0 ? void 0 : _a.startsWith('steam://joinlobby/')) {
                    twitchClientCb('Copy and paste the below into your browser to join my game directly through steam!!');
                }
                twitchClientCb(steamJoinLink);
            });
        }
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
