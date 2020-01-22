"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const tmi_js_1 = require("tmi.js");
const secrets_1 = __importDefault(require("../../secrets"));
const twitch_chatbot_1 = require("./chatbot/twitch-chatbot");
const steam_api_1 = require("../steam/steam-api");
const socket_message_enum_1 = require("./socket-message-enum");
// Define configuration options
const opts = {
    identity: {
        username: 'itsatreee',
        password: secrets_1.default.oAuthPassword
    },
    channels: [
        'itsatreee'
    ]
};
// Create a client with our options
const twitchClient = tmi_js_1.client(opts);
const steamApi = new steam_api_1.SteamApi();
const twitchChatbot = new twitch_chatbot_1.TwitchChatbot(steamApi);
// Register our event handlers (defined below)
twitchClient.on('message', onMessageHandler);
twitchClient.on('connected', onConnectedHandler);
// Connect to Twitch:
twitchClient.connect();
// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    twitchChatbot.handleMessage(target, context, msg, self, websocketSend, twitchClientSay);
}
function websocketSend(dataType, data) {
    emoteWidgetSocketServer.clients.forEach((client) => {
        client.send(JSON.stringify({ dataType: dataType, data: data }));
    });
}
function twitchClientSay(msg) {
    twitchClient.say(opts.channels[0], `${msg}`);
}
// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}
let emoteWidgetSocketServer = new WebSocket.Server({ port: 8080 });
emoteWidgetSocketServer.on('connection', (ws) => {
    emoteWidgetSocketServer.clients.add(ws);
    emoteWidgetSocketServer.clients.forEach((client) => {
        client.on('message', (message) => {
            const data = JSON.parse(message);
            console.log('received: %s', message);
            if (data.dataType === socket_message_enum_1.SocketMessageEnum.EmoteCodes) {
                twitchChatbot.setEmoteCodes(data.data);
            }
            else if (data.dataType === socket_message_enum_1.SocketMessageEnum.CheckEmoteCache) {
                if (twitchChatbot.emotesExist()) {
                    console.log(`Cached ${twitchChatbot.getEmoteCodes().length} emotes`);
                    client.send(JSON.stringify({ dataType: socket_message_enum_1.SocketMessageEnum.CheckEmoteCache, data: twitchChatbot.getEmoteCodes() }));
                }
                else {
                    console.log(`No emotes in list`);
                    client.send(JSON.stringify({ dataType: socket_message_enum_1.SocketMessageEnum.CheckEmoteCache, data: [] }));
                }
            }
        });
        client.on('error', (error) => {
            console.log(error);
        });
        client.send(JSON.stringify({ dataType: 'connected', data: 'client connected' }));
    });
});
