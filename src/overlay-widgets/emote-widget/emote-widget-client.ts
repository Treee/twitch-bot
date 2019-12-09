import WebSocket = require('ws');
import { EmoteWidget } from './emote-widget';

export class EmoteWidgetClient {

    serverUrl = 'ws://localhost:8080';
    socket: WebSocket;
    emoteWidget: EmoteWidget;

    emoteCodesToLookFor: string[] = [];

    constructor(serverUrl: string, emoteWidget: EmoteWidget) {
        this.serverUrl = serverUrl;
        this.emoteWidget = emoteWidget;
        this.socket = new WebSocket(serverUrl);
        this.socket.onopen = this.onOpen;
        this.socket.onmessage = this.onMessage;
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
    }

    onOpen(event: WebSocket.OpenEvent) {
        const emoteCodes = this.emoteWidget.getEmoteCodes();
        console.log('[open] Connection established');
        console.log('Sending list of emotes to look for', emoteCodes);
        this.socket.send(JSON.stringify({ dataType: 'emoteCodes', data: emoteCodes }));
    }

    onMessage(event: WebSocket.MessageEvent) {
        console.log(`[message] Data received from server: ${event.data}`);
        // TODO handle when json parse fails
        const invokedEmotes = JSON.parse(event.data.toString());

        if (!!invokedEmotes && invokedEmotes.length > 0) {
            invokedEmotes.forEach((emote: any) => {
                const emoteToShow = this.emoteWidget.getSpecificTwitchEmote(emote);
                if (!emoteToShow) {
                    const bttvEmoteToShow = this.emoteWidget.getSpecificBttvEmote(emote);
                    this.emoteWidget.addEmoteToContainer('emote-container', 'emote', bttvEmoteToShow);
                } else {
                    this.emoteWidget.addEmoteToContainer('emote-container', 'emote', emoteToShow);
                }
            });
        }
    }

    onClose(event: WebSocket.CloseEvent) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log('[close] Connection died');
        }
    }

    onError(event: WebSocket.ErrorEvent) {
        console.log(`[error] ${event.message}`);
    }
}