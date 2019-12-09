import { SECRETS } from './src/secrets';
import { TwitchWebSocketServer } from './src/twitch-connectors/twitch-websocket-server';

const twitchChatConnectionOptions = {
    identity: {
        username: 'itsatreee',
        password: SECRETS.oAuthPassword
    },
    channels: [
        'itsatreee'
    ]
};
const twitchChatBot = new TwitchWebSocketServer(twitchChatConnectionOptions);





// import { PubSubWebSocket } from './src/twitch-connectors/pub-sub-websocket';

// const connector = new PubSubWebSocket();
// connector.connect();


// import { HelixApi } from './src/twitch-connectors/helix-api';
// const helix = new HelixApi();
// helix.getMostActiveStreamsForGameId(33214);