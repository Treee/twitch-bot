"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const tmi_js_1 = require("tmi.js");
const uuid_1 = require("uuid");
const secrets_1 = require("../../secrets");
const twitch_chatbot_1 = require("./chatbot/twitch-chatbot");
const steam_api_1 = require("../steam/steam-api");
const socket_message_enum_1 = require("./socket-message-enum");
const twitch_api_v5_1 = require("./twitch-api-v5");
// Define configuration options
const opts = {
    identity: {
        username: secrets_1.SECRETS.irc.user,
        password: `oauth:${secrets_1.SECRETS.irc.userOAuthPassword}`,
    },
    channels: secrets_1.SECRETS.irc.channelsToListenTo,
};
const debugMode = false;
const socketServerPort = parseInt(secrets_1.SECRETS.serverPort || "80");
// Create a client with our options
const twitchClient = tmi_js_1.client(opts);
const steamApi = new steam_api_1.SteamApi();
const twitchApi = new twitch_api_v5_1.TwitchApiV5(debugMode);
const twitchChatbot = new twitch_chatbot_1.TwitchChatbot(twitchApi, steamApi, debugMode);
let clients = [];
// twitchApi.subscribeToTopic(false, 10, "follows", "users/follows?first=1&to_id=114260623").then((data) => {
//     console.log("Followers Topic UnSubscribed To Successfully");
//     return "";
// }).then((data) => {
//     return twitchApi.getCurrentSubscriptions();
// }).then((data) => {
//     return data.json();
// }).then((data) => {
//     console.log("data yo", data);
//     return data;
// });
// i have the ability to sub and unsub to interesting events
// what i want is to turn this on when i go live.
// how do i know when i go live?
// i would know because i subed to that event and it told me
// how would i know if i am usbbed to that event
// Register our event handlers (defined below)
twitchClient.on("message", onMessageHandler);
twitchClient.on("connected", onConnectedHandler);
// Connect to Twitch:
twitchClient.connect();
// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    twitchChatbot.handleMessage(target, context, msg, self, websocketSend, twitchClientSay);
}
function anongiftpaidupgradeHandler(channel, username, userstate) {
    console.log(`The bot says ${username} is continuing the Gift Sub they got from an anonymous user in channel! THIS IS A TEST`);
    twitchClientSay(`itsatreeFriends itsatreeVibe itsatreeFriends itsatreeVibe ${username} is continuing the Gift Sub they got from an anonymous user in channel! itsatreeFriends itsatreeVibe itsatreeFriends itsatreeVibe Thank You!`);
    websocketSend(socket_message_enum_1.SocketMessageEnum.MysteryGiftSubscriptionUpgrade, { username }, "treee");
}
function banHandler(channel, username, reason) {
    // reason is deprecated. always null as per docs
    twitchClientSay(`itsatreeCop itsatreeCop itsatreeCop |BANNED| --->${username}<--- |BANNED| FROM WHERE? ${channel} channel. itsatreeCop itsatreeCop itsatreeCop Suck it!`);
    websocketSend(socket_message_enum_1.SocketMessageEnum.Banned, { username }, "treee");
}
function cheerHandler(channel, userstate, message) {
    twitchClientSay(`itsatrEeTeee itsatrEeTeee Thank You ${userstate.username} for cheering ${userstate.bits} bits!! itsatrEeTeee itsatrEeTeee`);
    websocketSend(socket_message_enum_1.SocketMessageEnum.Bits, { username: userstate.username, bits: userstate.bits }, "treee");
}
function clearchatHandler(channel) {
    twitchClientSay(`itsatreeCop itsatreeCop itsatreeCop itsatreeCop OOOoooooo BUSTED!! itsatreeCop itsatreeCop itsatreeCop itsatreeCop`);
    websocketSend(socket_message_enum_1.SocketMessageEnum.ChatCleared, {}, "treee");
}
function emoteonlyHandler(channel, enabled) {
    if (enabled) {
        twitchClientSay(`Spam Those Treeemotes! itsatrEeTeee itsatrEeTeee itsatrEeTeee itsatrEeTeee itsatrEeTeee itsatrEeTeee itsatrEeTeee itsatrEeTeee itsatrEeTeee itsatrEeTeee itsatrEeTeee`);
        websocketSend(socket_message_enum_1.SocketMessageEnum.EmoteOnlyModeActive, {}, "treee");
    }
    else {
        websocketSend(socket_message_enum_1.SocketMessageEnum.EmoteOnlyModeDisabled, {}, "treee");
    }
}
function emotesetsHandler(sets, obj) {
    // Here are the emotes I can use:
    let emoteSetIds = sets.split(",");
    // console.log("my emote sets", emoteSetIds);
}
function giftpaidupgradeHandler(channel, username, sender, userstate) {
    // Do your stuff.
    twitchClientSay(`Gir Gir Gir Gir ${username} is continuing the Gift Sub they got from ${sender} Gir Gir Gir Gir Thank You!!`);
    websocketSend(socket_message_enum_1.SocketMessageEnum.GiftSubscriptionUpgrade, { username, sender }, "treee");
}
function resubHandler(channel, username, streakMonths, message, userstate, methods) {
    // Do your stuff.
    let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
    const years = Math.floor(cumulativeMonths / 12);
    const months = cumulativeMonths % 12;
    let cumulativeMsg = `${months} months!`;
    if (years > 0) {
        cumulativeMsg = `${years} years and ${months} months!!`;
    }
    twitchClientSay(`itsatrEeTeee itsatrEeTeee itsatrEeTeee ${username} is resubbing! Their current streak is ${streakMonths} and subbed for a total of ${cumulativeMsg}. itsatrEeTeee itsatrEeTeee itsatrEeTeee`);
    websocketSend(socket_message_enum_1.SocketMessageEnum.ReSubscription, { username, streakMonths, cumulativeMonths }, "treee");
}
function subgiftHandler(channel, username, streakMonths, recipient, methods, userstate) {
    // Do your stuff.
    let senderCount = ~~userstate["msg-param-sender-count"];
    twitchClientSay(`itsatrEeTeee itsatrEeTeee itsatrEeTeee ${username} is gifting subs! Their current streak is ${streakMonths} for a total of ${streakMonths + senderCount}. Lucky ${recipient}!. itsatrEeTeee itsatrEeTeee itsatrEeTeee`);
    websocketSend(socket_message_enum_1.SocketMessageEnum.GiftSubscription, { gifter: username, numGifts: senderCount, recipient }, "treee");
}
function submysterygiftHandler(channel, username, numbOfSubs, methods, userstate) {
    // Do your stuff.
    let senderCount = ~~userstate["msg-param-sender-count"];
    twitchClient.say(username, `I know what you did ;) Thank you. itsatrEeTeee itsatrEeTeee itsatrEeTeee`);
    websocketSend(socket_message_enum_1.SocketMessageEnum.MysteryGiftSubscription, { username, numbOfSubs }, "treee");
}
function subscriptionHandler(channel, username, method, message, userstate) {
    twitchClientSay(`itsatrEeTeee itsatrEeTeee itsatrEeTeee ${username} just subbed! itsatrEeTeee itsatrEeTeee itsatrEeTeee`);
    websocketSend(socket_message_enum_1.SocketMessageEnum.FirstTimeSubscription, username, "treee");
}
function vipsHandler(channel, vips) {
    console.log("here are the vips", vips);
}
function raidHandler(channel, username, viewers) {
    if (viewers > 5) {
        twitchClientSay(` TombRaid TombRaid ${username} just raided with ${viewers}!  TombRaid TombRaid`);
        websocketSend(socket_message_enum_1.SocketMessageEnum.Raided, { username, viewers }, "treee");
    }
}
function hostHandler(channel, username, viewers, autohost) {
    if (viewers > 5 && !autohost) {
        twitchClientSay(` TombRaid TombRaid ${username} just hosted with ${viewers}! `);
        websocketSend(socket_message_enum_1.SocketMessageEnum.Hosted, { username, viewers }, "treee");
    }
}
function websocketSend(dataType, data, clientId) {
    const applicableWebsockets = getApplicableWebsockets(clientId);
    applicableWebsockets.forEach((client) => {
        client.socket.send(JSON.stringify({ type: dataType, data: data }));
    });
}
function twitchClientSay(msg) {
    console.log(`channels ${opts.channels} msg: ${msg}`);
    if (opts.channels) {
        twitchClient.say(opts.channels[0], `${msg}`);
    }
}
// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    console.log(`attempting to subscribe to additional events if you are treeeee:${opts.channels}.`);
    if (opts.channels && opts.channels[0] === "#itsatreee") {
        console.log(`subscribed`);
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
        twitchClient.on("raided", raidHandler);
        twitchClient.on("hosted", hostHandler);
    }
}
const serverOptions = {
    port: socketServerPort || undefined,
};
let emoteWidgetSocketServer = new WebSocket.Server(serverOptions);
function sendRegistrationToClient(websocket) {
    const uuid = uuid_1.v4();
    console.log(`sent client registration to user: ${uuid}`);
    websocket.send(formatDataForWebsocket(socket_message_enum_1.SocketMessageEnum.ClientRegister, uuid));
    return uuid;
}
function formatDataForWebsocket(dataType, rawData) {
    if (socket_message_enum_1.SocketMessageEnum[dataType] !== "PING" || socket_message_enum_1.SocketMessageEnum[dataType] !== "PONG") {
        console.log(`DataType: ${dataType} / RawData: ${rawData}`);
    }
    return JSON.stringify({ type: dataType, data: rawData });
}
function getApplicableWebsockets(clientId) {
    const foundWebsockets = clients.filter((socket) => {
        return socket.id === clientId;
    });
    return foundWebsockets;
}
function registerWebsocket(uniqueId, clientId, websocket) {
    console.log(`adding client ${clientId} with UIID ${uniqueId}`);
    clients.push({ uuid: uniqueId, id: clientId, socket: websocket });
}
function removeWebsocket(uniqueId) {
    console.log(`attempting to remove client with UIID ${uniqueId}`);
    clients = clients.filter((sockets) => {
        return sockets.uuid !== uniqueId;
    });
}
function isValidWebsocketMessageType(messageType) {
    let validMessageType = false;
    for (let socketEnum in socket_message_enum_1.SocketMessageEnum) {
        validMessageType = validMessageType || socketEnum == messageType;
        // console.log(`checking msgType:${msg.type} again ${socketEnum} result:${(socketEnum == msg.type)}`);
    }
    //ignore pings and registers
    validMessageType = messageType !== "PING";
    validMessageType = messageType !== "ClientRegister";
    return validMessageType;
}
function onClientConnect(socket) {
    const uuid = sendRegistrationToClient(socket);
    socket.on("message", (message) => {
        // console.log(message);
        const msg = JSON.parse(message);
        const applicableWebsockets = getApplicableWebsockets(msg.toClientId);
        if (msg.type === socket_message_enum_1.SocketMessageEnum.ClientRegister) {
            registerWebsocket(uuid, msg.data, socket);
        }
        else if (msg.type === socket_message_enum_1.SocketMessageEnum.PING) {
            websocketSend(socket_message_enum_1.SocketMessageEnum.PONG, "PONG", msg.toClientId);
        }
        else if (applicableWebsockets.length > 0) {
            if (isValidWebsocketMessageType(msg.type)) {
                console.log("received: %s", msg);
                if (msg.type === socket_message_enum_1.SocketMessageEnum.CheckEmoteCache) {
                    const emoteSetIds = [];
                    msg.data.emoteSetIds.forEach((setId) => {
                        if (!emoteSetIds.includes(setId.toString())) {
                            emoteSetIds.push(setId);
                        }
                    });
                    // twitchChatbot.pullAllEmotes(msg.data.channelName, emoteSetIds).then((emotes) => {
                    twitchChatbot.pullAllEmotes("114260623", emoteSetIds).then((emotes) => {
                        // console.log("fresh pull emotes:");
                        websocketSend(socket_message_enum_1.SocketMessageEnum.CheckEmoteCache, emotes, msg.toClientId);
                    });
                }
                else if (msg.type === socket_message_enum_1.SocketMessageEnum.EmoteCodes) {
                    twitchChatbot.setEmoteCodes(msg.data);
                    // console.log("cache emotes:");
                }
                else if (msg.type === socket_message_enum_1.SocketMessageEnum.TEST) {
                    websocketSend(socket_message_enum_1.SocketMessageEnum.TEST, msg.data, msg.toClientId);
                }
            }
        }
    });
    socket.on("close", (error) => {
        removeWebsocket(uuid);
    });
    socket.on("error", (error) => {
        console.log(error);
    });
}
emoteWidgetSocketServer.on("connection", onClientConnect);
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
