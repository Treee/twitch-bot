// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/tmi.js/index.d.ts
import { Client, Options, client, ChatUserstate } from 'tmi.js';
import WebSocket = require('ws');

export class TwitchWebSocketServer {

    twitchChatClient: Client;
    clientOptions: Options;

    emoteWidgetSocketServer: WebSocket.Server;
    emoteWidgetSocketClient: WebSocket | undefined;

    emoteCodesToLookFor: string[] = [];

    constructor(clientOptions: Options) {
        this.clientOptions = clientOptions;
        this.twitchChatClient = client(clientOptions);
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
    onTwitchMessageReceived(channel: string, userState: ChatUserstate, msg: string, self: boolean) {
        if (self) { return; } // Ignore messages from the bot

        // Remove whitespace from chat message
        const message = msg.trim();
        const parsedEmotes = this.parseForEmoteCodes(message);
        console.log('found these emotes', parsedEmotes);
        // If the command is known, let's execute it
        if (message === '!dice') {
            const num = this.rollDice();
            this.twitchChatClient.say(channel, `You rolled a ${num}`);
            console.log(`* Executed ${message} command`);
        } else if (parsedEmotes.length > 0) {
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
    onConnectionToTwitch(address: string, port: number) {
        console.log(`* Connected to ${address}:${port}`);
    }

    startEmoteWidgetSocketServer() {
        this.emoteWidgetSocketServer.on('connection', (ws: WebSocket) => {
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

    parseForEmoteCodes(message: string) {
        const invokedEmotes: string[] = [];
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