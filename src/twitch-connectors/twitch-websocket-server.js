const tmi = require('tmi.js');
const SECRETS = require('../secrets.js');
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
        if (!!emoteWidgetSocketClient) {
            emoteWidgetSocketClient.send(JSON.stringify(parsedEmotes));
        }
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

function parseForEmoteCodes(message) {
    const invokedEmotes = [];
    const words = message.split(' ');
    words.forEach((word) => {
        emoteCodesToLookFor.forEach((emoteCode) => {
            if (word === emoteCode) {
                invokedEmotes.push(emoteCode);
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
let emoteWidgetSocketClient = undefined;

emoteWidgetSocketServer.on('connection', (ws) => {
    emoteWidgetSocketClient = ws;
    emoteWidgetSocketClient.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('received: %s', message);
        if (data.dataType === 'emoteCodes') {
            emoteCodesToLookFor = data.data;
        }
    });

    emoteWidgetSocketClient.on('error', (error) => {
        console.log(error);
    });
    emoteWidgetSocketClient.send(JSON.stringify({ dataType: 'connected', data: 'client connected' }));
});