"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secrets_1 = require("./src/secrets");
const twitch_websocket_server_1 = require("./src/twitch-connectors/twitch-websocket-server");
const twitchChatConnectionOptions = {
    identity: {
        username: 'itsatreee',
        password: secrets_1.SECRETS.oAuthPassword
    },
    channels: [
        'itsatreee'
    ]
};
const twitchChatBot = new twitch_websocket_server_1.TwitchWebSocketServer(twitchChatConnectionOptions);
// import { PubSubWebSocket } from './src/twitch-connectors/pub-sub-websocket';
// const connector = new PubSubWebSocket();
// connector.connect();
// import { HelixApi } from './src/twitch-connectors/helix-api';
// const helix = new HelixApi();
// helix.getMostActiveStreamsForGameId(33214);
