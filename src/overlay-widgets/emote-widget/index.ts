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
    twitchApiV5.getTwitchEmotesBySets(emoteWidgetConfig.clientId, [0, 42]),
    twitchApiV5.getBttvEmotesByChannel(emoteWidgetConfig.channel),
    twitchApiV5.getGlobalBttvEmotes()
]).then((values) => {
    // emoteWidget.twitchSubBadges = values[0].subBadges;
    emoteWidget.masterEmotes = emoteWidget.masterEmotes.concat(values[0]).concat(values[1]).concat(values[2]).concat(values[3]);
}).then(() => {
    if (!emoteWidgetConfig.botMode) {
        // this first interval makes it so emotes rain immediately instead of waiting for the second interval to start
        let interval = setInterval(emoteWidget.addEmoteToContainer.bind(emoteWidget), ((emoteWidgetConfig.secondsToRain * 1000) / emoteWidgetConfig.totalEmotes), '');

        if (emoteWidgetConfig.numTimesToRepeat != -1) {
            // timeout to ensure the raining emotes stop after a certain amount of time
            setTimeout(() => {
                clearInterval(interval);
                emoteWidgetConfig.numTimesToRepeat--;
            }, emoteWidgetConfig.secondsToRain * 1000);

            // this interval will continually start and stop the raining of emotes.
            setInterval(() => {
                if (emoteWidgetConfig.numTimesToRepeat > 0) {
                    interval = setInterval(emoteWidget.addEmoteToContainer.bind(emoteWidget), ((emoteWidgetConfig.secondsToRain * 1000) / emoteWidgetConfig.totalEmotes), '');
                    setTimeout(() => {
                        clearInterval(interval);
                        emoteWidgetConfig.numTimesToRepeat--;
                    }, emoteWidgetConfig.secondsToRain * 1000);
                }
            }, emoteWidgetConfig.secondsToWaitForRain * 1000);
        }
    }
}).then(() => {
    if (emoteWidgetConfig.botMode) {
        new EmoteWidgetClient('ws://localhost:8080', emoteWidget);
        emoteWidget.startSimulation();

        emoteWidget.addEmoteToCanvasAndDrawables(emoteWidget.createFireworkEmote('itsatrEeCool'));
        emoteWidget.addEmoteToCanvasAndDrawables(emoteWidget.createFireworkEmote('itsatrEeCool'));
        emoteWidget.addEmoteToCanvasAndDrawables(emoteWidget.createFireworkEmote('itsatrEeCool'));
        emoteWidget.addEmoteToCanvasAndDrawables(emoteWidget.createFireworkEmote('itsatrEeCool'));
        emoteWidget.addEmoteToCanvasAndDrawables(emoteWidget.createFireworkEmote('itsatrEeCool'));
        emoteWidget.addEmoteToCanvasAndDrawables(emoteWidget.createFireworkEmote('itsatrEeCool'));
        emoteWidget.addEmoteToCanvasAndDrawables(emoteWidget.createFireworkEmote('itsatrEeCool'));
        emoteWidget.addEmoteToCanvasAndDrawables(emoteWidget.createFireworkEmote('itsatrEeCool'));
        emoteWidget.addEmoteToCanvasAndDrawables(emoteWidget.createFireworkEmote('itsatrEeCool'));
    }
});
