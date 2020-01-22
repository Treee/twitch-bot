import WebSocket = require('ws');

import { client, Client, ChatUserstate } from 'tmi.js';
import SECRETS from '../../secrets';

import { TwitchChatbot } from './chatbot/twitch-chatbot';
import { SteamApi } from '../steam/steam-api';
import { SocketMessageEnum } from './socket-message-enum';

// Define configuration options
const opts = {
    identity: {
        username: 'itsatreee',
        password: SECRETS.oAuthPassword
    },
    channels: [
        'itsatreee'
    ]
};

// Create a client with our options
const twitchClient: Client = client(opts);
const steamApi = new SteamApi();
const twitchChatbot = new TwitchChatbot(steamApi);

// Register our event handlers (defined below)
twitchClient.on('message', onMessageHandler);
twitchClient.on('connected', onConnectedHandler);

// Connect to Twitch:
twitchClient.connect();

// Called every time a message comes in
function onMessageHandler(target: string, context: ChatUserstate, msg: string, self: boolean) {
    twitchChatbot.handleMessage(target, context, msg, self, websocketSend, twitchClientSay);
}

function websocketSend(dataType: SocketMessageEnum, data: any): void {
    emoteWidgetSocketServer.clients.forEach((client) => {
        client.send(JSON.stringify({ dataType: dataType, data: data }));
    });
}

function twitchClientSay(msg: string): void {
    twitchClient.say(opts.channels[0], `${msg}`);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr: string, port: number): void {
    console.log(`* Connected to ${addr}:${port}`);
}

let emoteWidgetSocketServer = new WebSocket.Server({ port: 8080 });

emoteWidgetSocketServer.on('connection', (ws) => {
    emoteWidgetSocketServer.clients.add(ws);

    emoteWidgetSocketServer.clients.forEach((client) => {

        client.on('message', (message: string) => {
            const data = JSON.parse(message);
            console.log('received: %s', message);
            if (data.dataType === SocketMessageEnum.EmoteCodes) {
                twitchChatbot.setEmoteCodes(data.data);
            }
            else if (data.dataType === SocketMessageEnum.CheckEmoteCache) {
                if (twitchChatbot.emotesExist()) {
                    console.log(`Cached ${twitchChatbot.getEmoteCodes().length} emotes`);
                    client.send(JSON.stringify({ dataType: SocketMessageEnum.CheckEmoteCache, data: twitchChatbot.getEmoteCodes() }));
                } else {
                    console.log(`No emotes in list`);
                    client.send(JSON.stringify({ dataType: SocketMessageEnum.CheckEmoteCache, data: [] }));
                }
            }
        });

        client.on('error', (error) => {
            console.log(error);
        });

        client.send(JSON.stringify({ dataType: 'connected', data: 'client connected' }));
    });
});