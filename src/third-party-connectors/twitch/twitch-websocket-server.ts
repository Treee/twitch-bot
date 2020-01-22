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
const twitchChatbot = new TwitchChatbot();
const steamApi = new SteamApi();

// Register our event handlers (defined below)
twitchClient.on('message', onMessageHandler);
twitchClient.on('connected', onConnectedHandler);

// Connect to Twitch:
twitchClient.connect();

// Called every time a message comes in
function onMessageHandler(target: string, context: ChatUserstate, msg: string, self: boolean) {
    const handledResult = twitchChatbot.handleMessage(target, context, msg, self);
    console.log(handledResult);
    if (handledResult?.emotes && handledResult.emotes.length > 0) {
        emoteWidgetSocketServer.clients.forEach((client) => {
            client.send(JSON.stringify({ dataType: SocketMessageEnum.FoundEmotes, data: handledResult.emotes }));
        });
    }

    if (handledResult?.commands && handledResult.commands.length > 0) {
        handledResult.commands.forEach((command) => {
            if (command.toLowerCase() === '!joinlobby') {
                steamApi.getSteamJoinableLobbyLink(SECRETS.steam.apiKey, SECRETS.steam.userId).then((steamJoinLink) => {
                    if (steamJoinLink?.startsWith('steam://joinlobby/')) {
                        twitchClient.say(opts.channels[0], 'Copy and paste the below into your browser to join my game directly through steam!!');
                    }
                    twitchClient.say(opts.channels[0], `${steamJoinLink}`);
                });
            }
        });
    }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr: string, port: number) {
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