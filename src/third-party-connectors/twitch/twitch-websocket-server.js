const tmi = require('tmi.js');
const fetch = require('node-fetch');

const SECRETS = require('../../secrets.js');
const WebSocket = require('ws');
// // Define configuration options
const opts = {
    identity: {
        username: 'itsatreee',
        password: SECRETS.oAuthPassword
    },
    channels: [
        'itsatreee'
    ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

let emoteCodesToLookFor = [];

async function getSteamAoeLobby() {
    return await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${SECRETS.steam.apiKey}&steamids=${SECRETS.steam.userId}`).then(async (response) => {
        const data = await response.json();
        const players = data.response.players;
        let result = `${players[0].personaname} does not have an open lobby.`;
        if (players[0] && players[0].lobbysteamid) {
            result = `steam://joinlobby/${SECRETS.steam.gameIds.aoe2de}/${players[0].lobbysteamid}/${SECRETS.steam.userId}`;
        }
        return result;
    }, (error) => {
        // console.error('Error', error);
        return [];
    });
}

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot
    console.log(`target: ${target} msg: ${msg} self: ${self}`);
    console.log('context:', context);
    if (context['message-type'] === 'raid') {
        console.log('========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================');
        console.log(`target: ${target} msg: ${msg} self: ${self}`);
        console.log('context:', context);
    }
    // Remove whitespace from chat message
    const commandName = msg.trim();
    const parsedEmotes = parseForEmoteCodes(commandName);
    console.log('found these emotes', parsedEmotes);

    // If the command is known, let's execute it
    if (commandName === '!dice') {
        const num = rollDice();
        client.say(target, `You rolled a ${num}`);
        console.log(`* Executed ${commandName} command`);
    } else if (parsedEmotes.length > 0) {
        // broadcast to the client side
        if (emoteWidgetSocketServer.clients.size > 0) {
            emoteWidgetSocketServer.clients.forEach((client) => {
                client.send(JSON.stringify({ dataType: 'foundEmotes', data: parsedEmotes }));
            });
        }
    } else if (commandName.toLowerCase() === '!joinlobby') {
        getSteamAoeLobby().then((steamJoinLink) => {
            client.say(opts.channels[0], `Copy and paste this into your browser to join my game directly through steam!! ${steamJoinLink}`);
        });
    }
    else {
        console.log(`* Unknown command ${commandName}`);
    }
}

// Function called when the "dice" command is issued
function rollDice() {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
}

const emoteSuffixes = ['_SA', '_BW', '_HF', '_VF', '_SQ', '_TK', '_SG', '_RD'];
function parseForEmoteCodes(message) {
    const invokedEmotes = [];
    const words = message.split(' ');
    words.forEach((word) => {
        emoteCodesToLookFor.forEach((emoteCode) => {
            if (word.toLowerCase() === emoteCode.toLowerCase()) {
                invokedEmotes.push(emoteCode);
            } else { // check for modified emote codes (like _SA or _RD or BW or _SQ)
                emoteSuffixes.forEach((suffix) => {
                    if (word.toLowerCase() === `${emoteCode}${suffix}`.toLowerCase()) {
                        invokedEmotes.push(`${emoteCode}${suffix}`);
                    }
                });
            }
        });
    });
    return invokedEmotes;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}

let emoteWidgetSocketServer = new WebSocket.Server({ port: 8080 });

emoteWidgetSocketServer.on('connection', (ws) => {
    emoteWidgetSocketServer.clients.add(ws);

    emoteWidgetSocketServer.clients.forEach((client) => {

        client.on('message', (message) => {
            const data = JSON.parse(message);
            console.log('received: %s', message);
            if (data.dataType === 'emoteCodes') {
                emoteCodesToLookFor = data.data;
            }
            else if (data.dataType === 'checkEmoteCache') {
                if (emoteCodesToLookFor.length > 0) {
                    console.log(`Cached ${emoteCodesToLookFor.length} emotes`);
                    client.send(JSON.stringify({ dataType: 'checkEmoteCache', data: emoteCodesToLookFor }));
                } else {
                    console.log(`No emotes in list`);
                    client.send(JSON.stringify({ dataType: 'checkEmoteCache', data: [] }));
                }
            }
        });

        client.on('error', (error) => {
            console.log(error);
        });

        client.send(JSON.stringify({ dataType: 'connected', data: 'client connected' }));
    });
});