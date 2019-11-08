"use strict";
// import { PubSubWebSocket } from './src/twitch-connectors/pub-sub-websocket';
Object.defineProperty(exports, "__esModule", { value: true });
// const connector = new PubSubWebSocket();
// connector.connect();
var helix_api_1 = require("./src/twitch-connectors/helix-api");
var helix = new helix_api_1.HelixApi();
helix.getMostActiveStreamsForGameId(33214);
