"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_message_enum_1 = require("../../third-party-connectors/twitch/socket-message-enum");
class KeyboardWidgetClient {
    constructor(serverUrl, keyboardWidget) {
        this.serverUrl = 'ws://localhost:8081';
        this.serverUrl = serverUrl;
        this.keyboardWidget = keyboardWidget;
        this.socket = new WebSocket(serverUrl);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
    }
    onOpen(event) {
        console.log('[open] Connection established');
        this.socket.send(JSON.stringify({ type: socket_message_enum_1.SocketMessageEnum.HookInput, data: '' }));
    }
    onMessage(event) {
        // console.log(`[message] Data received from server: ${event.data}`);
        const eventData = JSON.parse(event.data);
        if (eventData.type === socket_message_enum_1.SocketMessageEnum.HandleInput) {
            // console.log('keys', JSON.parse(eventData.data));
            this.keyboardWidget.handleInput(JSON.parse(eventData.data));
        }
    }
    // need to handle cwhen clients close their conenction
    onClose(event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        }
        else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log('[close] Connection died');
        }
    }
    onError(event) {
        console.log(`[error] ${event.message}`);
    }
}
exports.KeyboardWidgetClient = KeyboardWidgetClient;
