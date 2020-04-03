import WebSocket = require('ws');
import https = require('https');
import fs = require('fs');
import { SocketMessageEnum } from '../../third-party-connectors/twitch/socket-message-enum';
import { TwitchChatbot } from '../../third-party-connectors/twitch/chatbot/twitch-chatbot';


export class EmoteWigetServer {

    private emoteWidgetSocket: WebSocket.Server;
    private twitchChatbot: TwitchChatbot;
    private adminServer: https.Server;

    constructor(twitchChatbot: TwitchChatbot) {
        this.twitchChatbot = twitchChatbot;
        const server = https.createServer({
            cert: fs.readFileSync('/etc/letsencrypt/live/itsatreee.com/fullchain.pem'),
            key: fs.readFileSync('/etc/letsencrypt/live/itsatreee.com/privkey.pem')
        });

        this.adminServer = server;
        this.emoteWidgetSocket = new WebSocket.Server({ server });
        const closeHandle = this.emoteWidgetSocket;
        process.on('SIGHUP', function () {
            closeHandle.close();
            console.log('About to exit');
            process.exit();
        });
    }

    startServer(port: number) {
        this.emoteWidgetSocket.on('connection', (ws) => {
            this.emoteWidgetSocket.clients.add(ws);

            this.emoteWidgetSocket.clients.forEach((client: WebSocket) => {

                client.on('message', (message: string) => {
                    const parsedData = JSON.parse(message);
                    this.handleMessage(client, parsedData.type, parsedData.data);
                });

                client.on('error', (error) => {
                    console.log(error);
                });

                client.send(JSON.stringify({ type: 'connected', data: 'client connected' }));
            });
        });

        this.adminServer.listen(port);
        console.log(`Listening on port ${port}`);
    }

    handleMessage(client: WebSocket, dataType: SocketMessageEnum, data: any) {
        const parsedData = JSON.parse(data);
        console.log('received: %s', data);
        if (dataType === SocketMessageEnum.EmoteCodes) {
            this.twitchChatbot.setEmoteCodes(parsedData.data);
        }
        else if (dataType === SocketMessageEnum.CheckEmoteCache) {
            if (this.twitchChatbot.emotesExist()) {
                console.log(`Cached ${this.twitchChatbot.getEmoteCodes().length} emotes`);
                client.send(JSON.stringify({ type: SocketMessageEnum.CheckEmoteCache, data: this.twitchChatbot.getEmoteCodes() }));
            } else {
                console.log(`No emotes in list`);
                client.send(JSON.stringify({ type: SocketMessageEnum.CheckEmoteCache, data: [] }));
            }
        }
    }

    broadcastMessage(dataType: SocketMessageEnum, data: any) {
        this.emoteWidgetSocket.clients.forEach((client) => {
            client.send(JSON.stringify({ type: dataType, data: data }));
        });
    }

    formatDataForWebsocket(dataType: SocketMessageEnum, rawData: any): string {
        console.log(`DataType: ${dataType} / RawData: ${rawData}`);
        return JSON.stringify({ type: dataType, data: rawData });
    }

}