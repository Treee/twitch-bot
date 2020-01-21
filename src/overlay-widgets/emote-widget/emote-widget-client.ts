import { EmoteWidget } from './emote-widget';

export class EmoteWidgetClient {

    serverUrl = 'ws://localhost:8080';
    socket: WebSocket;
    emoteWidget: EmoteWidget;

    constructor(serverUrl: string, emoteWidget: EmoteWidget) {
        this.serverUrl = serverUrl;
        this.emoteWidget = emoteWidget;
        this.socket = new WebSocket(serverUrl);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
    }

    onOpen(event: any) {
        console.log('[open] Connection established');
        console.log('Checking server for cached emotes');
        this.socket.send(JSON.stringify({ dataType: 'checkEmoteCache', data: '' }));
    }

    onMessage(event: any) {
        console.log(`[message] Data received from server: ${event.data}`);
        const eventData = JSON.parse(event.data);
        if (eventData.dataType === 'checkEmoteCache') {
            if (eventData.data.length < 1) {
                const emoteCodes = this.emoteWidget.getEmoteCodes();
                console.log('Sending list of emotes to look for', emoteCodes);
                this.socket.send(JSON.stringify({ dataType: 'emoteCodes', data: emoteCodes }));
            }
        }
        else if (eventData.dataType === 'foundEmotes') {
            const invokedEmotes = eventData.data;

            if (!!invokedEmotes && invokedEmotes.length > 0) {
                invokedEmotes.forEach((emoteCode: string) => {
                    this.emoteWidget.addEmoteToContainer(emoteCode);
                });
            }
        }
    }

    // need to handle cwhen clients close their conenction
    onClose(event: any) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log('[close] Connection died');
        }
    }

    onError(event: any) {
        console.log(`[error] ${event.message}`);
    }
}