import WebSocket from 'ws';
export class Connector {

    heartbeatInterval = 1000 * 60; //ms between PING's
    reconnectInterval = 1000 * 3; //ms to wait before reconnect
    ws: WebSocket;

    constructor() {
        this.ws = new WebSocket('wss://pubsub-edge.twitch.tv');
    }

    connect(): void {
        let heartbeatHandle: any;
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

    heartbeat() {
        const message = {
            type: 'PING'
        };
        console.log('SENT: ' + JSON.stringify(message) + '\n');
        this.ws.send(JSON.stringify(message));
    }
}
