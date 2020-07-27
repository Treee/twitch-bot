import WebSocket = require("ws");
import NativeExtension = require("bindings");

import { client, Client, ChatUserstate, Options } from "tmi.js";
import { SECRETS } from "../../secrets";

import { TwitchChatbot } from "./chatbot/twitch-chatbot";
import { SteamApi } from "../steam/steam-api";
import { SocketMessageEnum } from "./socket-message-enum";
import { TwitchApiV5 } from "./twitch-api-v5";

// Define configuration options
const opts: Options = {
    identity: {
        username: SECRETS.irc.user,
        password: SECRETS.irc.userOAuthPassword
    },
    channels: SECRETS.irc.channelsToListenTo
};
const debugMode = false;
const socketServerPort = parseInt(SECRETS.serverPort || '80');

// Create a client with our options
const twitchClient: Client = client(opts);
const steamApi = new SteamApi();
const twitchApi = new TwitchApiV5(debugMode);
const twitchChatbot = new TwitchChatbot(twitchApi, steamApi, debugMode);

// Register our event handlers (defined below)
twitchClient.on("message", onMessageHandler);
twitchClient.on("connected", onConnectedHandler);

// Connect to Twitch:
twitchClient.connect();

// Called every time a message comes in
function onMessageHandler(target: string, context: ChatUserstate, msg: string, self: boolean) {
    twitchChatbot.handleMessage(target, context, msg, self, websocketSend, twitchClientSay);
}

function anongiftpaidupgradeHandler(channel: string, username: string, userstate: any) {
    console.log(`The bot says ${username} is continuing the Gift Sub they got from an anonymous user in channel! THIS IS A TEST`);
    twitchClientSay(`The bot says ${username} is continuing the Gift Sub they got from an anonymous user in channel! THIS IS A TEST`);
}

function banHandler(channel: string, username: string, reason: string) {
    // reason is deprecated. always null as per docs
    console.log(`The bot says ${username} has been banned on a channel! Suck it! THIS IS A TEST`);
    twitchClientSay(`The bot says ${username} has been banned on a channel! Suck it! THIS IS A TEST`);
}

function cheerHandler(channel: string, userstate: any, message: string) {
    console.log(`The bot says ${userstate.username} is chearing ${userstate.bits} wooo THIS IS A TEST`);
    twitchClientSay(`The bot says ${userstate.username} is chearing ${userstate.bits} wooo THIS IS A TEST`);
}

function clearchatHandler(channel: string) {
    console.log(`Oooooooooo BUSTED!!`)
    twitchClientSay(`Oooooooooo BUSTED!!`);
}

function emoteonlyHandler(channel: string, enabled: boolean) {
    if (enabled) {
        twitchClientSay(`Spam Those Treeemotes! itsatrEeTeee itsatrEeTeee itsatrEeTeee itsatrEeTeee `);
    }
}

function emotesetsHandler(sets: any, obj: any) {
    // Here are the emotes I can use:
    console.log("my emote sets", sets);
    console.log("my emote obj", obj);
}

function giftpaidupgradeHandler(channel: string, username: string, sender: string, userstate: any) {
    // Do your stuff.
    console.log(`The bot says ${username} is continuing the Gift Sub they got from ${sender} in channel. THIS IS A TEST`);
    twitchClientSay(`The bot says ${username} is continuing the Gift Sub they got from ${sender} in channel. THIS IS A TEST`);
}

function resubHandler(channel: string, username: string, streakMonths: number, message: string, userstate: any, methods: any) {
    // Do your stuff.
    let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
    console.log(`The bot says ${username} is resubbing! Their current streak is ${streakMonths} and subbed for a total of ${cumulativeMonths}. THIS IS A TEST`);
    twitchClientSay(`The bot says ${username} is resubbing! Their current streak is ${streakMonths} and subbed for a total of ${cumulativeMonths}. THIS IS A TEST`);
}

function subgiftHandler(channel: string, username: string, streakMonths: number, recipient: string, methods: any, userstate: any) {
    // Do your stuff.
    let senderCount = ~~userstate["msg-param-sender-count"];
    console.log(`The bot says ${username} is gifting subs! Their current streak is ${streakMonths} for a total of ${senderCount}. Lucky ${recipient}!. THIS IS A TEST`);
    twitchClientSay(`The bot says ${username} is gifting subs! Their current streak is ${streakMonths} for a total of ${senderCount}. Lucky ${recipient}!. THIS IS A TEST`);
}

function submysterygiftHandler(channel: string, username: string, numbOfSubs: number, methods: any, userstate: any) {
    // Do your stuff.
    let senderCount = ~~userstate["msg-param-sender-count"];
    twitchClient.say(username, `I know what you did ;) Thank you. THIS IS A TEST`);
}

function subscriptionHandler(channel: string, username: string, method: any, message: string, userstate: any) {
    console.log(`The bot says ${username} just subbed! THIS IS A TEST`);
    twitchClientSay(`The bot says ${username} just subbed! THIS IS A TEST`);
}

function vipsHandler(channel: string, vips: any[]) {
    console.log("here are the vips", vips);
}

function websocketSend(dataType: SocketMessageEnum, data: any): void {
    emoteWidgetSocketServer.clients.forEach((client) => {
        client.send(JSON.stringify({ type: dataType, data: data }));
    });
}

function twitchClientSay(msg: string): void {
    console.log(`channels ${opts.channels} msg: ${msg}`);
    if (opts.channels) {
        twitchClient.say(opts.channels[0], `${msg}`);
    }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr: string, port: number): void {
    console.log(`* Connected to ${addr}:${port}`);
    console.log(`attempting to subscribe to additional events if you are treeeee:${opts.channels}.`)
    if (opts.channels && opts.channels[0] === 'itsatreee') {
        twitchClient.on("anongiftpaidupgrade", anongiftpaidupgradeHandler);
        twitchClient.on("ban", banHandler);
        twitchClient.on("cheer", cheerHandler);
        twitchClient.on("clearchat", clearchatHandler);
        twitchClient.on("emoteonly", emoteonlyHandler);
        twitchClient.on("emotesets", emotesetsHandler);
        twitchClient.on("giftpaidupgrade", giftpaidupgradeHandler);
        twitchClient.on("resub", resubHandler);
        twitchClient.on("subgift", subgiftHandler);
        twitchClient.on("submysterygift", submysterygiftHandler);
        twitchClient.on("subscription", subscriptionHandler);
        twitchClient.on("vips", vipsHandler);
    }
}

const serverOptions: WebSocket.ServerOptions = {
    port: socketServerPort || undefined
};

let emoteWidgetSocketServer = new WebSocket.Server(serverOptions);

emoteWidgetSocketServer.on("connection", (ws) => {
    emoteWidgetSocketServer.clients.add(ws);

    emoteWidgetSocketServer.clients.forEach((client) => {

        client.on("message", (message: string) => {
            if (message === "PING") {
                client.send("PONG");
            } else {
                const payload = JSON.parse(message);
                console.log("received: %s", message);
                if (payload.type === SocketMessageEnum.EmoteCodes) {
                    twitchChatbot.setEmoteCodes(payload.data);
                }
                else if (payload.type === SocketMessageEnum.CheckEmoteCache) {
                    if (twitchChatbot.emotesExist()) {
                        console.log(`Cached ${twitchChatbot.getEmoteCodes().length} emotes`);
                        client.send(JSON.stringify({ type: SocketMessageEnum.CheckEmoteCache, data: twitchChatbot.emotesToLookFor }));
                    } else {
                        twitchChatbot.pullAllEmotes(payload.data.channelName, payload.data.emoteSetIds).then((emotes) => {
                            client.send(JSON.stringify({ type: SocketMessageEnum.CheckEmoteCache, data: twitchChatbot.emotesToLookFor }));
                        });
                    }
                }
            }
        });

        client.on("error", (error) => {
            console.log(error);
        });

        client.send(JSON.stringify({ type: "connected", data: "client connected" }));
    });
});

// const nativeExtension = NativeExtension("NativeExtension");
// let keyboardWidgetSocketServer = new WebSocket.Server({ port: 8081 });

// keyboardWidgetSocketServer.on("connection", (ws) => {
//     keyboardWidgetSocketServer.clients.add(ws);

//     keyboardWidgetSocketServer.clients.forEach((client) => {

//         client.on("message", (message: string) => {
//             const data = JSON.parse(message);
//             console.log("received: %s", message);
//             if (data.type === SocketMessageEnum.HookInput) {
//                 setTimeout(() => {
//                     nativeExtension.attachToKeyboard(() => {
//                         console.log("attached to keyboardf");
//                         const rawData = nativeExtension.getPressedKeys();
//                         try {
//                             const parsed = JSON.parse(rawData);
//                             // console.log("parse", parsed);
//                             client.send(JSON.stringify({ type: SocketMessageEnum.HandleInput, data: JSON.stringify(parsed) }));
//                         } catch (error) {
//                             // console.log("attempt to parse", rawData);
//                             // console.log("error", error);
//                         }
//                     });
//                 }, 1000);
//             }
//         });

//         client.on("error", (error) => {
//             console.log(error);
//         });

//         client.send(JSON.stringify({ dataType: "connected", data: "client connected" }));
//     });
// });