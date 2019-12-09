"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/tmi.js/index.d.ts
const tmi_js_1 = require("tmi.js");
const WebSocket = require("ws");
class TwitchWebSocketServer {
    constructor(clientOptions) {
        this.emoteCodesToLookFor = [];
        this.clientOptions = clientOptions;
        this.twitchChatClient = tmi_js_1.client(clientOptions);
        this.startTwitchChatClient();
        this.emoteWidgetSocketServer = new WebSocket.Server({ port: 8080 });
        this.startEmoteWidgetSocketServer();
    }
    startTwitchChatClient() {
        this.twitchChatClient.on('message', this.onTwitchMessageReceived);
        this.twitchChatClient.on('connected', this.onConnectionToTwitch);
        this.twitchChatClient.connect();
    }
    // Called every time a message comes in
    onTwitchMessageReceived(channel, userState, msg, self) {
        if (self) {
            return;
        } // Ignore messages from the bot
        // Remove whitespace from chat message
        const message = msg.trim();
        const parsedEmotes = this.parseForEmoteCodes(message);
        console.log('found these emotes', parsedEmotes);
        // If the command is known, let's execute it
        if (message === '!dice') {
            const num = this.rollDice();
            this.twitchChatClient.say(channel, `You rolled a ${num}`);
            console.log(`* Executed ${message} command`);
        }
        else if (parsedEmotes.length > 0) {
            // broadcast to the client side
            if (!!this.emoteWidgetSocketClient) {
                this.emoteWidgetSocketClient.send(JSON.stringify(parsedEmotes));
            }
        }
        else {
            console.log(`* Unknown command ${message}`);
        }
    }
    // Called every time the bot connects to Twitch chat
    onConnectionToTwitch(address, port) {
        console.log(`* Connected to ${address}:${port}`);
    }
    startEmoteWidgetSocketServer() {
        this.emoteWidgetSocketServer.on('connection', (ws) => {
            this.emoteWidgetSocketClient = ws;
            this.emoteWidgetSocketClient.on('message', (message) => {
                console.log('received: %s', message);
            });
            this.emoteWidgetSocketClient.on('error', (error) => {
                console.log(error);
            });
            this.emoteWidgetSocketClient.send(JSON.stringify({ dataType: 'connected', data: 'client connected' }));
        });
    }
    rollDice() {
        const sides = 6;
        return Math.floor(Math.random() * sides) + 1;
    }
    parseForEmoteCodes(message) {
        const invokedEmotes = [];
        const words = message.split(' ');
        words.forEach((word) => {
            this.emoteCodesToLookFor.forEach((emoteCode) => {
                if (word === emoteCode) {
                    invokedEmotes.push(emoteCode);
                }
            });
        });
        return invokedEmotes;
    }
}
exports.TwitchWebSocketServer = TwitchWebSocketServer;
