"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_message_enum_1 = require("../../third-party-connectors/twitch/socket-message-enum");
class EmoteWidgetClient {
    constructor(serverUrl, emoteWidget) {
        this.serverUrl = 'ws://localhost:8080';
        this.serverUrl = serverUrl;
        this.emoteWidget = emoteWidget;
        this.socket = new WebSocket(serverUrl);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
    }
    onOpen(event) {
        console.log('[open] Connection established');
        console.log('Checking server for cached emotes');
        this.socket.send(JSON.stringify({ dataType: socket_message_enum_1.SocketMessageEnum.CheckEmoteCache, data: '' }));
    }
    onMessage(event) {
        console.log(`[message] Data received from server: ${event.data}`);
        const eventData = JSON.parse(event.data);
        if (eventData.dataType === socket_message_enum_1.SocketMessageEnum.CheckEmoteCache) {
            if (eventData.data.length < 1) {
                const emoteCodes = this.emoteWidget.getEmoteCodes();
                console.log('Sending list of emotes to look for', emoteCodes);
                this.socket.send(JSON.stringify({ dataType: socket_message_enum_1.SocketMessageEnum.EmoteCodes, data: emoteCodes }));
            }
        }
        else if (eventData.dataType === socket_message_enum_1.SocketMessageEnum.FoundEmotes) {
            const invokedEmotes = eventData.data;
            if (!!invokedEmotes && invokedEmotes.length > 0) {
                invokedEmotes.forEach((emoteCode) => {
                    emoteCode.forEach((emote) => {
                        this.emoteWidget.addEmoteToContainer(emote);
                    });
                });
            }
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
exports.EmoteWidgetClient = EmoteWidgetClient;
