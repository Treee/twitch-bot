// import { PubSubWebSocket } from './src/twitch-connectors/pub-sub-websocket';

// const connector = new PubSubWebSocket();
// connector.connect();


import { HelixApi } from './src/twitch-connectors/helix-api';
const helix = new HelixApi();
helix.getMostActiveStreamsForGameId(33214);