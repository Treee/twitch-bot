export class TwitchSubscriber {

    async subscribeToWebhook(topic: string, mode: string, clientId: string) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Client-ID': clientId
            },
            body: JSON.stringify({
                'hub.callback': 'http://localhost:3001',
                'hub.mode': mode,
                'hub.topic': topic,
                'lease_seconds': 864000
            })
        };
        return await fetch('https://api.twitch.tv/helix/webhooks/hub', options).then((response) => {
            return response;
        }).then((result) => {
            console.log('result', result);
        }).catch((error) => {
            console.log('error', error);
        });
    }
}