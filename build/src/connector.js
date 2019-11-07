"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var Connector = /** @class */ (function () {
    function Connector() {
        this.heartbeatInterval = 1000 * 60; //ms between PING's
        this.reconnectInterval = 1000 * 3; //ms to wait before reconnect
        this.ws = new ws_1.default('wss://pubsub-edge.twitch.tv');
    }
    Connector.prototype.connect = function () {
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
    Connector.prototype.heartbeat = function () {
        var message = {
            type: 'PING'
        };
        console.log('SENT: ' + JSON.stringify(message) + '\n');
        this.ws.send(JSON.stringify(message));
    };
    return Connector;
}());
exports.Connector = Connector;
