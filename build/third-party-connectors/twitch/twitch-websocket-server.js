"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tmi_js_1 = require("tmi.js");
const secrets_1 = __importDefault(require("../../secrets"));
const WebSocket = require("ws");
// const WebSocket = require('ws');
// // Define configuration options
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
// Register our event handlers (defined below)
twitchClient.on('message', onMessageHandler);
twitchClient.on('connected', onConnectedHandler);
// Connect to Twitch:
twitchClient.connect();
// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    if (self) {
        return;
    } // Ignore messages from the bot
    console.log(`target: ${target} msg: ${msg} self: ${self}`);
    console.log('context:', context);
    // Remove whitespace from chat message
    const commandName = msg.trim();
    console.log('commandName', commandName);
    // If the command is known, let's execute it
    if (commandName === '!dice') {
        const num = rollDice();
        twitchClient.say(target, `You rolled a ${num}`);
        console.log(`* Executed ${commandName} command`);
    }
    else {
        console.log(`* Unknown command ${commandName}`);
    }
}
// Function called when the "dice" command is issued
function rollDice() {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
}
// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}
let emoteCodesToLookFor = [];
let emoteWidgetSocketServer = new WebSocket.Server({ port: 8080 });
emoteWidgetSocketServer.on('connection', (ws) => {
    emoteWidgetSocketServer.clients.add(ws);
    emoteWidgetSocketServer.clients.forEach((client) => {
        client.on('message', (message) => {
            const data = JSON.parse(message);
            console.log('received: %s', message);
            if (data.dataType === 'emoteCodes') {
                emoteCodesToLookFor = data.data;
            }
            else if (data.dataType === 'checkEmoteCache') {
                if (emoteCodesToLookFor.length > 0) {
                    console.log(`Cached ${emoteCodesToLookFor.length} emotes`);
                    client.send(JSON.stringify({ dataType: 'checkEmoteCache', data: emoteCodesToLookFor }));
                }
                else {
                    console.log(`No emotes in list`);
                    client.send(JSON.stringify({ dataType: 'checkEmoteCache', data: [] }));
                }
            }
        });
        client.on('error', (error) => {
            console.log(error);
        });
        client.send(JSON.stringify({ dataType: 'connected', data: 'client connected' }));
    });
});
