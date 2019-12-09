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