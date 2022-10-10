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
exports.TwitchChatbot = void 0;
const socket_message_enum_1 = require("../socket-message-enum");
const secrets_1 = require("../../../secrets");
const emote_parser_1 = require("./parsers/emote-parser");
class TwitchChatbot {
    constructor(twitchApi, steamApi, debugMode = false) {
        this.debugMode = false;
        this.chatCommands = ["!joinlobby"];
        this.emotesToLookFor = [];
        this.emoteParser = new emote_parser_1.EmoteParser();
        this.twitchApi = twitchApi;
        this.steamApi = steamApi;
        this.debugMode = debugMode;
    }
    pullAllEmotes(channel, emoteSetIds = [], override = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.emotesExist() && !override) {
                console.log(`The cache has ${this.getEmoteCodes().length} emotes.`);
                return this.emotesToLookFor;
            }
            else {
                console.log(`params 1: ${channel} 2: ${emoteSetIds}`);
                const twitchEmotes = yield this.twitchApi.getTwitchEmotes(channel);
                // const twitchEmoteSets = await this.twitchApi.getTwitchEmotesBySets(emoteSetIds);
                const bttvChannelEmotes = yield this.twitchApi.getBttvEmotesByChannel(channel);
                const bttvGlobalEmotes = yield this.twitchApi.getGlobalBttvEmotes();
                // emoteWidget.twitchSubBadges = values[0].subBadges;
                let emotes = [];
                emotes = emotes.concat(twitchEmotes).concat(bttvChannelEmotes).concat(bttvGlobalEmotes); //.concat(twitchEmoteSets)
                this.setEmoteCodes(emotes);
                return emotes;
            }
        });
    }
    setEmoteCodes(emotes) {
        this.emotesToLookFor = emotes;
    }
    getEmoteCodes() {
        // console.log("emotesToLookFor", this.emotesToLookFor.length);
        const emoteCodes = this.emotesToLookFor.slice(0).map((emote) => {
            return emote.code;
        });
        // console.log("emote codes: ", emoteCodes.length);
        return emoteCodes;
    }
    emotesExist() {
        return this.emotesToLookFor.length > 0;
    }
    handleMessage(target, context, msg, self, webSocketCb, twitchClientCb) {
        if (this.debugMode) {
            this.debugMessages(target, context, msg, self);
        } // print if debug
        // if (self) { return; } // Ignore messages from the bot
        const invokedCommands = this.parseForCommands(msg);
        const invokedEmotes = this.emoteParser.parseComplete(msg, this.getEmoteCodes());
        if (this.debugMode) {
            console.log("invoked commands", invokedCommands);
            console.log("invoked emotes", invokedEmotes);
            this.debugMessages(invokedCommands, invokedEmotes);
        }
        if (invokedEmotes.length > 0 && webSocketCb) {
            webSocketCb(socket_message_enum_1.SocketMessageEnum.FoundEmotes, invokedEmotes, "treee");
        }
        if (invokedCommands.length > 0 && twitchClientCb) {
            invokedCommands.forEach((command) => {
                this.commandManager(command, twitchClientCb);
            });
        }
    }
    commandManager(command, twitchClientCb) {
        if (command.toLowerCase() === "!joinlobby") {
            this.steamApi.getSteamJoinableLobbyLink(secrets_1.SECRETS.steam.apiKey, secrets_1.SECRETS.steam.userId).then((steamJoinLink) => {
                if (steamJoinLink === null || steamJoinLink === void 0 ? void 0 : steamJoinLink.startsWith("steam://joinlobby/")) {
                    twitchClientCb("Copy and paste the below into your browser to join my game directly through steam!!");
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
        let message = "";
        args.forEach((arg) => {
            message = message.concat(`Param${++messageCounter}: ${JSON.stringify(arg)}, `);
        });
        console.log("Debug Log: ", message);
    }
}
exports.TwitchChatbot = TwitchChatbot;
