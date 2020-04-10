import WebSocket = require('ws');
import NativeExtension = require('bindings');

import { client, Client, ChatUserstate } from 'tmi.js';
import { SECRETS } from '../../secrets';

import { TwitchChatbot } from './chatbot/twitch-chatbot';
import { SteamApi } from '../steam/steam-api';
import { SocketMessageEnum } from './socket-message-enum';
import { TwitchPublisher } from './twitch-publisher';

// const publisherServer: TwitchPublisher = new TwitchPublisher();
// publisherServer.startServer();
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
        client.send(JSON.stringify({ type: dataType, data: data }));
    });
}

function twitchClientSay(msg: string): void {
    twitchClient.say(opts.channels[0], `${msg}`);
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr: string, port: number): void {
    console.log(`* Connected to ${addr}:${port}`);
}

let emoteWidgetSocketServer = new WebSocket.Server({ port: 8446 });

emoteWidgetSocketServer.on('connection', (ws) => {
    emoteWidgetSocketServer.clients.add(ws);

    emoteWidgetSocketServer.clients.forEach((client) => {

        client.on('message', (message: string) => {
            if (message === 'PING') {
                client.send('PONG');
            } else {
                const data = JSON.parse(message);
                console.log('received: %s', message);
                if (data.type === SocketMessageEnum.EmoteCodes) {
                    twitchChatbot.setEmoteCodes(data.data);
                }
                else if (data.type === SocketMessageEnum.CheckEmoteCache) {
                    if (twitchChatbot.emotesExist()) {
                        console.log(`Cached ${twitchChatbot.getEmoteCodes().length} emotes`);
                        client.send(JSON.stringify({ type: SocketMessageEnum.CheckEmoteCache, data: twitchChatbot.getEmoteCodes() }));
                    } else {
                        console.log(`No emotes in list`);
                        client.send(JSON.stringify({ type: SocketMessageEnum.CheckEmoteCache, data: [] }));
                    }
                }
            }
        });

        client.on('error', (error) => {
            console.log(error);
        });

        client.send(JSON.stringify({ type: 'connected', data: 'client connected' }));
    });
});

// const nativeExtension = NativeExtension('NativeExtension');
// let keyboardWidgetSocketServer = new WebSocket.Server({ port: 8081 });

// keyboardWidgetSocketServer.on('connection', (ws) => {
//     keyboardWidgetSocketServer.clients.add(ws);

//     keyboardWidgetSocketServer.clients.forEach((client) => {

//         client.on('message', (message: string) => {
//             const data = JSON.parse(message);
//             console.log('received: %s', message);
//             if (data.type === SocketMessageEnum.HookInput) {
//                 setTimeout(() => {
//                     nativeExtension.attachToKeyboard(() => {
//                         console.log('attached to keyboardf');
//                         const rawData = nativeExtension.getPressedKeys();
//                         try {
//                             const parsed = JSON.parse(rawData);
//                             // console.log('parse', parsed);
//                             client.send(JSON.stringify({ type: SocketMessageEnum.HandleInput, data: JSON.stringify(parsed) }));
//                         } catch (error) {
//                             // console.log('attempt to parse', rawData);
//                             // console.log('error', error);
//                         }
//                     });
//                 }, 1000);
//             }
//         });

//         client.on('error', (error) => {
//             console.log(error);
//         });

//         client.send(JSON.stringify({ dataType: 'connected', data: 'client connected' }));
//     });
// });