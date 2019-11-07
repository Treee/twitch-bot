"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// https://dev.twitch.tv/docs/pubsub
// https://github.com/twitchdev/pubsub-samples/blob/master/javascript/main.js
var ws_1 = __importDefault(require("ws"));
var PubSubWebSocket = /** @class */ (function () {
    function PubSubWebSocket() {
        this.heartbeatInterval = 1000 * 60; //ms between PING's
        this.reconnectInterval = 1000 * 3; //ms to wait before reconnect
        this.ws = new ws_1.default('wss://pubsub-edge.twitch.tv');
    }
    PubSubWebSocket.prototype.authUrl = function () {
        sessionStorage.twitchOAuthState = this.nonce(15);
        var url = 'https://api.twitch.tv/kraken/oauth2/authorize' +
            '?response_type=token' +
            '&client_id=' + 'gct24z0bpt832rurvqgn4m6kqja6kg' +
            '&redirect_uri=' + 'http://localhost' +
            '&state=' + sessionStorage.twitchOAuthState +
            '&scope=' + '';
        return url;
    };
    PubSubWebSocket.prototype.connect = function () {
        var heartbeatHandle;
        var connector = this;
        this.ws.onopen = function (event) {
            console.log('INFO: Socket Opened\n');
            connector.heartbeat();
            heartbeatHandle = setInterval(connector.heartbeat, connector.heartbeatInterval);
        };
        this.ws.onerror = function (error) {
            console.log('ERR:  ' + JSON.stringify(error) + '\n');
        };
        this.ws.onmessage = function (event) {
            var message = JSON.parse(event.data.toString());
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
    };
    PubSubWebSocket.prototype.listen = function (topic) {
        var message = {
            type: 'LISTEN',
            nonce: this.nonce(15),
            data: {
                topics: [topic],
                auth_token: sessionStorage.twitchOAuthToken
            }
        };
        console.log('SENT: ' + JSON.stringify(message) + '\n');
        this.ws.send(JSON.stringify(message));
    };
    PubSubWebSocket.prototype.heartbeat = function () {
        var message = {
            type: 'PING'
        };
        console.log('SENT: ' + JSON.stringify(message) + '\n');
        this.ws.send(JSON.stringify(message));
    };
    PubSubWebSocket.prototype.nonce = function (length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
    return PubSubWebSocket;
}());
exports.PubSubWebSocket = PubSubWebSocket;
