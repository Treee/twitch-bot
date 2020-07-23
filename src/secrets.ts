export const SECRETS = {
    botClientId: process.env.BOT_CLIENT_ID || '',
    botClientSecret: process.env.BOT_CLIENT_SECRET || '',
    serverPort: process.env.SERVER_PORT,
    steam: {
        apiKey: process.env.STEAM_API_KEY,
        userId: process.env.STEAM_USER_ID
    },
    irc: {
        user: process.env.IRC_USER,
        userOAuthPassword: process.env.IRC_USER_OAUTH_PASSWORD,
        channelsToListenTo: [process.env.IRC_CHANNELS_TO_MONITOR]
    }
};