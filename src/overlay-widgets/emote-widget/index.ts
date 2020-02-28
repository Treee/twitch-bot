import { TwitchApiV5 } from '../../third-party-connectors/twitch/twitch-api-v5';
import { EmoteWidgetConfig } from './emote-widget-config';
import { EmoteWidget } from './emote-widget';
import { EmoteWidgetClient } from './emote-widget-client';
import { EmoteFactory } from './emotes/emote-factory';

const twitchApiV5 = new TwitchApiV5();

const emoteWidgetConfig = new EmoteWidgetConfig();
emoteWidgetConfig.setConfigFrom(window.location.search.substring(1));

const emoteFactory = new EmoteFactory();
const emoteWidget = new EmoteWidget(emoteWidgetConfig, emoteFactory);

const emoteSetIds = [0, 42, 6112, 24314, 24315, 19194, 300206309];

Promise.all([
    twitchApiV5.getTwitchEmotes(emoteWidgetConfig.clientId, emoteWidgetConfig.channel),
    twitchApiV5.getTwitchEmotesBySets(emoteWidgetConfig.clientId, emoteSetIds),
    twitchApiV5.getBttvEmotesByChannel(emoteWidgetConfig.channel),
    twitchApiV5.getGlobalBttvEmotes()
]).then((values) => {
    // emoteWidget.twitchSubBadges = values[0].subBadges;
    emoteFactory.masterEmoteList = emoteFactory.masterEmoteList.concat(values[0]).concat(values[1]).concat(values[2]).concat(values[3]);
}).then(() => {
    if (!emoteWidgetConfig.botMode) {
        emoteWidget.startSimulation();
        // this first interval makes it so emotes rain immediately instead of waiting for the second interval to start

        // this interval will continually start and stop the raining of emotes.
        setInterval(() => {
            emoteWidget.addEmoteToContainer(['']);

        }, 2500);
    }
}).then(() => {
    if (emoteWidgetConfig.botMode) {
        new EmoteWidgetClient('ws://localhost:8080', emoteWidget);
        emoteWidget.startSimulation();
    }
});
