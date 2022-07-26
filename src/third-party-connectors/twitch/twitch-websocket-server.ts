import WebSocket = require("ws");
import NativeExtension = require("bindings");

import { client, Client, ChatUserstate, Options } from "tmi.js";
import { v4 } from "uuid";

import { SECRETS } from "../../secrets";

import { TwitchChatbot } from "./chatbot/twitch-chatbot";
import { SteamApi } from "../steam/steam-api";
import { SocketMessageEnum } from "./socket-message-enum";
import { TwitchApiV5 } from "./twitch-api-v5";

// Define configuration options
const opts: Options = {
  identity: {
    username: SECRETS.irc.user,
    password: `oauth:${SECRETS.irc.userOAuthPassword}`,
  },
  channels: SECRETS.irc.channelsToListenTo,
};
const debugMode = false;
const socketServerPort = parseInt(SECRETS.serverPort || "80");

// Create a client with our options
const twitchClient: Client = client(opts);
const steamApi = new SteamApi();
const twitchApi = new TwitchApiV5(debugMode);
const twitchChatbot = new TwitchChatbot(twitchApi, steamApi, debugMode);

let clients: { uuid: string; id: string; socket: WebSocket }[] = [];

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
function onMessageHandler(target: string, context: ChatUserstate, msg: string, self: boolean) {
  twitchChatbot.handleMessage(target, context, msg, self, websocketSend, twitchClientSay);
}

function anongiftpaidupgradeHandler(channel: string, username: string, userstate: any) {
  console.log(`The bot says ${username} is continuing the Gift Sub they got from an anonymous user in channel! THIS IS A TEST`);
  twitchClientSay(
    `itsatreeFriends itsatreeVibe itsatreeFriends itsatreeVibe ${username} is continuing the Gift Sub they got from an anonymous user in channel! itsatreeFriends itsatreeVibe itsatreeFriends itsatreeVibe Thank You!`
  );
  websocketSend(SocketMessageEnum.MysteryGiftSubscriptionUpgrade, { username }, "treee");
}

function banHandler(channel: string, username: string, reason: string) {
  // reason is deprecated. always null as per docs
  twitchClientSay(`itsatreeCop itsatreeCop itsatreeCop |BANNED| --->${username}<--- |BANNED| FROM WHERE? ${channel} channel. itsatreeCop itsatreeCop itsatreeCop Suck it!`);
  websocketSend(SocketMessageEnum.Banned, { username }, "treee");
}

function cheerHandler(channel: string, userstate: any, message: string) {
  twitchClientSay(`itsatrEeTeee itsatrEeTeee Thank You ${userstate.username} for cheering ${userstate.bits} bits!! itsatrEeTeee itsatrEeTeee`);
  websocketSend(SocketMessageEnum.Bits, { username: userstate.username, bits: userstate.bits }, "treee");
}

function clearchatHandler(channel: string) {
  twitchClientSay(`itsatreeCop itsatreeCop itsatreeCop itsatreeCop OOOoooooo BUSTED!! itsatreeCop itsatreeCop itsatreeCop itsatreeCop`);
  websocketSend(SocketMessageEnum.ChatCleared, {}, "treee");
}

function emoteonlyHandler(channel: string, enabled: boolean) {
  if (enabled) {
    twitchClientSay(`Spam Those Treeemotes! itsatrEeTeee itsatrEeTeee itsatrEeTeee itsatrEeTeee itsatrEeTeee itsatrEeTeee itsatrEeTeee itsatrEeTeee itsatrEeTeee itsatrEeTeee itsatrEeTeee`);
    websocketSend(SocketMessageEnum.EmoteOnlyModeActive, {}, "treee");
  } else {
    websocketSend(SocketMessageEnum.EmoteOnlyModeDisabled, {}, "treee");
  }
}

function emotesetsHandler(sets: string, obj: any) {
  // Here are the emotes I can use:
  let emoteSetIds = sets.split(",");
  // console.log("my emote sets", emoteSetIds);
}

function giftpaidupgradeHandler(channel: string, username: string, sender: string, userstate: any) {
  // Do your stuff.
  twitchClientSay(`Gir Gir Gir Gir ${username} is continuing the Gift Sub they got from ${sender} Gir Gir Gir Gir Thank You!!`);
  websocketSend(SocketMessageEnum.GiftSubscriptionUpgrade, { username, sender }, "treee");
}

function resubHandler(channel: string, username: string, streakMonths: number, message: string, userstate: any, methods: any) {
  // Do your stuff.
  let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
  const years = Math.floor(cumulativeMonths / 12);
  const months = cumulativeMonths % 12;
  let cumulativeMsg = `${months} months!`;
  if (years > 0) {
    cumulativeMsg = `${years} years and ${months} months!!`;
  }
  twitchClientSay(`itsatrEeTeee itsatrEeTeee itsatrEeTeee ${username} is resubbing! Their current streak is ${streakMonths} and subbed for a total of ${cumulativeMsg}. itsatrEeTeee itsatrEeTeee itsatrEeTeee`);
  websocketSend(SocketMessageEnum.ReSubscription, { username, streakMonths, cumulativeMonths }, "treee");
}

function subgiftHandler(channel: string, username: string, streakMonths: number, recipient: string, methods: any, userstate: any) {
  // Do your stuff.
  let senderCount = ~~userstate["msg-param-sender-count"];
  twitchClientSay(
    `itsatrEeTeee itsatrEeTeee itsatrEeTeee ${username} is gifting subs! Their current streak is ${streakMonths} for a total of ${streakMonths + senderCount}. Lucky ${recipient}!. itsatrEeTeee itsatrEeTeee itsatrEeTeee`
  );
  websocketSend(SocketMessageEnum.GiftSubscription, { gifter: username, numGifts: senderCount, recipient }, "treee");
}

function submysterygiftHandler(channel: string, username: string, numbOfSubs: number, methods: any, userstate: any) {
  // Do your stuff.
  let senderCount = ~~userstate["msg-param-sender-count"];
  twitchClient.say(username, `I know what you did ;) Thank you. itsatrEeTeee itsatrEeTeee itsatrEeTeee`);
  websocketSend(SocketMessageEnum.MysteryGiftSubscription, { username, numbOfSubs }, "treee");
}

function subscriptionHandler(channel: string, username: string, method: any, message: string, userstate: any) {
  twitchClientSay(`itsatrEeTeee itsatrEeTeee itsatrEeTeee ${username} just subbed! itsatrEeTeee itsatrEeTeee itsatrEeTeee`);
  websocketSend(SocketMessageEnum.FirstTimeSubscription, username, "treee");
}

function vipsHandler(channel: string, vips: any[]) {
  console.log("here are the vips", vips);
}

function raidHandler(channel: string, username: string, viewers: number) {
  if (viewers > 5) {
    twitchClientSay(` TombRaid TombRaid ${username} just raided with ${viewers}!  TombRaid TombRaid`);
    websocketSend(SocketMessageEnum.Raided, { username, viewers }, "treee");
  }
}

function hostHandler(channel: string, username: string, viewers: number, autohost: boolean) {
  if (viewers > 5 && !autohost) {
    twitchClientSay(` TombRaid TombRaid ${username} just hosted with ${viewers}! `);
    websocketSend(SocketMessageEnum.Hosted, { username, viewers }, "treee");
  }
}

function websocketSend(dataType: SocketMessageEnum, data: any, clientId: string): void {
  const applicableWebsockets = getApplicableWebsockets(clientId);
  applicableWebsockets.forEach((client) => {
    client.socket.send(JSON.stringify({ type: dataType, data: data }));
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

const serverOptions: WebSocket.ServerOptions = {
  port: socketServerPort || undefined,
};

let emoteWidgetSocketServer = new WebSocket.Server(serverOptions);

function sendRegistrationToClient(websocket: WebSocket): string {
  const uuid = v4();
  console.log(`sent client registration to user: ${uuid}`);
  websocket.send(formatDataForWebsocket(SocketMessageEnum.ClientRegister, uuid));
  return uuid;
}

function formatDataForWebsocket(dataType: SocketMessageEnum, rawData: any): string {
  if (SocketMessageEnum[dataType] !== "PING" || SocketMessageEnum[dataType] !== "PONG") {
    console.log(`DataType: ${dataType} / RawData: ${rawData}`);
  }
  return JSON.stringify({ type: dataType, data: rawData });
}

function getApplicableWebsockets(clientId: string): { uuid: string; id: string; socket: WebSocket }[] {
  const foundWebsockets = clients.filter((socket) => {
    return socket.id === clientId;
  });
  return foundWebsockets;
}

function registerWebsocket(uniqueId: string, clientId: string, websocket: WebSocket) {
  console.log(`adding client ${clientId} with UIID ${uniqueId}`);
  clients.push({ uuid: uniqueId, id: clientId, socket: websocket });
}

function removeWebsocket(uniqueId: string) {
  console.log(`attempting to remove client with UIID ${uniqueId}`);
  clients = clients.filter((sockets) => {
    return sockets.uuid !== uniqueId;
  });
}

function isValidWebsocketMessageType(messageType: string): boolean {
  let validMessageType = false;
  for (let socketEnum in SocketMessageEnum) {
    validMessageType = validMessageType || socketEnum == messageType;
    // console.log(`checking msgType:${msg.type} again ${socketEnum} result:${(socketEnum == msg.type)}`);
  }
  //ignore pings and registers
  validMessageType = messageType !== "PING";
  validMessageType = messageType !== "ClientRegister";
  return validMessageType;
}

function onClientConnect(socket: WebSocket) {
  const uuid = sendRegistrationToClient(socket);

  socket.on("message", (message: string) => {
    // console.log(message);
    const msg = JSON.parse(message);
    const applicableWebsockets = getApplicableWebsockets(msg.toClientId);
    if (msg.type === SocketMessageEnum.ClientRegister) {
      registerWebsocket(uuid, msg.data, socket);
    } else if (msg.type === SocketMessageEnum.PING) {
      websocketSend(SocketMessageEnum.PONG, "PONG", msg.toClientId);
    } else if (applicableWebsockets.length > 0) {
      if (isValidWebsocketMessageType(msg.type)) {
        if (debugMode) {
          console.log("Received: %s", msg);
        }
        if (msg.type === SocketMessageEnum.CheckEmoteCache) {
          const emoteSetIds: string[] = [];
          if (debugMode) {
            console.log("Checking Emote Cache: %s", msg);
          }
          msg.data.emoteSetIds.forEach((setId: string) => {
            if (!emoteSetIds.includes(setId.toString())) {
              emoteSetIds.push(setId);
            }
          });
          // twitchChatbot.pullAllEmotes(msg.data.channelName, emoteSetIds).then((emotes) => {
          twitchChatbot.pullAllEmotes("114260623", emoteSetIds).then((emotes) => {
            if (debugMode) {
              console.log("Pull All Emotes"); //, emotes);
            }
            websocketSend(SocketMessageEnum.CheckEmoteCache, emotes, msg.toClientId);
          });
        } else if (msg.type === SocketMessageEnum.EmoteCodes) {
          twitchChatbot.setEmoteCodes(msg.data);
          if (debugMode) {
            console.log("Setting Emotes"); //, msg.data);
          }
        } else if (msg.type === SocketMessageEnum.TEST) {
          websocketSend(SocketMessageEnum.TEST, msg.data, msg.toClientId);
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
