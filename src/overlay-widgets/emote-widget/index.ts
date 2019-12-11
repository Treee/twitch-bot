import { TwitchApiV5 } from '../../twitch-connectors/twitch-api-v5';
import { EmoteWidgetConfig } from './emote-widget-config';
import { EmoteWidget } from './emote-widget';
import { EmoteWidgetClient } from './emote-widget-client';

const twitchApiV5 = new TwitchApiV5();

const emoteWidgetConfig = new EmoteWidgetConfig();
emoteWidgetConfig.setConfigFrom(window.location.search.substring(1))

const emoteWidget = new EmoteWidget(emoteWidgetConfig);

Promise.all([
    twitchApiV5.getTwitchEmotes(emoteWidgetConfig.clientId, emoteWidgetConfig.channel),
    twitchApiV5.getBttvEmotes(emoteWidgetConfig.channel),
    twitchApiV5.getTwitchEmotesBySets(emoteWidgetConfig.clientId, [0, 42])
]).then((values) => {
    // console.log('values', values);
    if (emoteWidgetConfig.showGlobal) {
        const combinedTwitchEmotes = values[0].emotes.concat(values[2])
        emoteWidget.twitchEmotes = combinedTwitchEmotes;
    } else {
        emoteWidget.twitchEmotes = values[0].emotes;
    }
    emoteWidget.twitchSubBadges = values[0].subBadges;
    emoteWidget.bttvEmotes = values[1].emotes;
}).then(() => {
    if (!emoteWidgetConfig.botMode) {
        // this first interval makes it so emotes rain immediately instead of waiting for the second interval to start
        let interval = setInterval(emoteWidget.addEmoteToContainer, ((emoteWidgetConfig.secondsToRain * 1000) / emoteWidgetConfig.totalEmotes), 'emote-container', 'emote', () => { return emoteWidget.getRandomEmote() });

        if (emoteWidgetConfig.numTimesToRepeat != -1) {
            // timeout to ensure the raining emotes stop after a certain amount of time
            setTimeout(() => {
                clearInterval(interval);
                emoteWidgetConfig.numTimesToRepeat--;
            }, emoteWidgetConfig.secondsToRain * 1000);

            // this interval will continually start and stop the raining of emotes.
            setInterval(() => {
                if (emoteWidgetConfig.numTimesToRepeat > 0) {
                    interval = setInterval(emoteWidget.addEmoteToContainer, ((emoteWidgetConfig.secondsToRain * 1000) / emoteWidgetConfig.totalEmotes), 'emote-container', 'emote', () => { return emoteWidget.getRandomEmote() });
                    setTimeout(() => {
                        clearInterval(interval);
                        emoteWidgetConfig.numTimesToRepeat--;
                    }, emoteWidgetConfig.secondsToRain * 1000);
                }
            }, emoteWidgetConfig.secondsToWaitForRain * 1000);
        }
    }
}).then(() => {
    new EmoteWidgetClient('ws://localhost:8080', emoteWidget);
});
