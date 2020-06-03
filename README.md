# twitch-bot

## How To Use

1. Open a console in a folder/directory of your choice.
2. `git clone https://github.com/Treee/twitch-bot` - Clone the repository **Requires [Git](https://git-scm.com/downloads)**
3. `npm install` - Install dependencies. **Requires [NodeJS](https://nodejs.org/en/)**
4. `npm run build` - Build the code.
5. `npm start` - Run the server to start listening to twitch chat.

## Additional Information

This server assumes you can provide a file in the `./src` directory called `secrets.ts` this includes api specific information. Take the example below and fill in your own values.
```ts
export const SECRETS = {
    botClientId: 'abcdefghijklmnopqrstuvwxyz',
    botClientSecret: 'zyxwvutsrqpomnlkjighfedcba',
    serverPort: 8080,
    steam: {
        apiKey: 'FD1D5F3BA10E8097F1E321075964F69C',
        userId: '61087776597019628'
    },
    irc: {
        user: 'twitchUserName that will log into irc',
        userOAuthPassword: '7wcqd83kk8v6w75i7q3np838ys2h42',
        channelsToListenTo: ['name of the channel to listen to', 'add another if you want']
    }
};
```
### Client Id and Client Secret

Login and [Create/Register Your App](https://dev.twitch.tv/console/apps/create) with twitch. Use `http://localhost` as the default redirect url and choose **Chatbot as the Category**. The clientId is visible and click to see the secret. Keep the client secret private and do not share it with anyone.

### Server Port

This can be any open port.

### IRC

This is this user that will be authenticating to the Twitch IRC chat. Navigate to [OAuth Token Generator](https://twitchapps.com/tmi/). Make sure to authenticate with the same user the bot is using.

### Steam API Key and User Id (Optional)

#### API Key
This segment is optional and only needed if you want Steam integration with the chatbot. [Create Your API Key](https://steamcommunity.com/dev/apikey).

#### UserId
Log in with your account to the web version of [Steam](https://store.steampowered.com/). Navigate to your profile. ![Steam Profile](https://cdn.discordapp.com/attachments/254751301424906240/705582717986930728/steam.PNG)

Find the url and copy the name `https://steamcommunity.com/id/{UserName}/`. Use [SteamID Finder](https://steamid.xyz/) to locate your `Steam Id` from your `{UserName}`


## Deploy to Server

If you want to deploy the server in the cloud you will need to accomodate for SSL since browsers no longer allow unsecure websockets to be created client-side. I provide a rough draft of how I did it but my environment is custom so it most likely won't apply.

## Screens

Create the screen and name it.
`screen -S foo`

Attach to the screen
`screen -r foo`

## SSL
1. Stop all screens and containers
2. `sudo service nginx stop`
3. `sudo service httpd start`
4. `sudo certbot`
5. `sudo reboot`
6. `sudo service httpd stop`
7. `sudo service nginx start`
8. Start all screens and containers

[SSL Reference](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/SSL-on-amazon-linux-2.html#letsencrypt)