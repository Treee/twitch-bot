"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// https://dev.twitch.tv/docs/pubsub
// https://github.com/twitchdev/pubsub-samples/blob/master/javascript/main.js
const ws_1 = __importDefault(require("ws"));
// import { SECRETS } from '../secrets';
class PubSubWebSocket {
    constructor() {
        this.heartbeatInterval = 1000 * 60; //ms between PING's
        this.reconnectInterval = 1000 * 3; //ms to wait before reconnect
        this.ws = new ws_1.default('wss://pubsub-edge.twitch.tv');
    }
    authUrl() {
        sessionStorage.twitchOAuthState = this.nonce(15);
        var url = 'https://api.twitch.tv/kraken/oauth2/authorize' +
            '?response_type=token' +
            // '&client_id=' + SECRETS.botClientId +
            '&redirect_uri=' + 'http://localhost' +
            '&state=' + sessionStorage.twitchOAuthState +
            '&scope=' + 'user_read+chat_login';
        return url;
    }
    connect() {
        let heartbeatHandle;
        const connector = this;
        this.ws.onopen = function (event) {
            console.log('INFO: Socket Opened\n');
            connector.heartbeat();
            heartbeatHandle = setInterval(connector.heartbeat, connector.heartbeatInterval);
        };
        this.ws.onerror = function (error) {
            console.log('ERR:  ' + JSON.stringify(error) + '\n');
        };
        this.ws.onmessage = function (event) {
            const message = JSON.parse(event.data.toString());
            console.log('RECV: ' + JSON.stringify(message) + '\n');
            if (message.type == 'RECONNECT') {
                console.log('INFO: Reconnecting...\n');
                setTimeout(connector.connect, connector.reconnectInterval);
            }
        };
        this.ws.onclose = function () {
            console.log('INFO: Socket Closed\n');
            clearInterval(heartbeatHandle);
            console.log('INFO: Reconnecting...\n');
            setTimeout(connector.connect, connector.reconnectInterval);
        };
    }
    listen(topic) {
        let message = {
            type: 'LISTEN',
            nonce: this.nonce(15),
            data: {
                topics: [topic],
                auth_token: sessionStorage.twitchOAuthToken
            }
        };
        console.log('SENT: ' + JSON.stringify(message) + '\n');
        this.ws.send(JSON.stringify(message));
    }
    heartbeat() {
        const message = {
            type: 'PING'
        };
        console.log('SENT: ' + JSON.stringify(message) + '\n');
        this.ws.send(JSON.stringify(message));
    }
    nonce(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
exports.PubSubWebSocket = PubSubWebSocket;
