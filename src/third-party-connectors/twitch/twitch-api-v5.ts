import { SubBadge, TwitchEmoteResponse, BttvEmoteResponse, Emote } from "../../helpers/emote";
import fetch from "node-fetch";
import { extraEmotes } from "./chatbot/extra-emotes";
import { SECRETS } from "../../secrets";

export class TwitchApiV5 {
  oAuthToken: string = "";
  debugMode: boolean;
  helixBaseUrl: string = "https://api.twitch.tv/helix";

  pubSubCallbackUrl: string = "https://itsatreee.com/aoe2/api/twitchwebhook/";

  constructor(debugMode: boolean = false) {
    this.debugMode = debugMode;
  }

  getTwitchRequestHeaders(): any {
    const headers = {
      "Client-ID": SECRETS.botClientId,
      Accept: "application/vnd.twitchtv.v5+json",
      Authorization: `Bearer ${this.oAuthToken}`,
    };
    return headers;
  }

  async checkoAuthToken(clientId: string, clientSecret: string, scope: string = "", grantType: string = "") {
    const validateOAuthTokenResponse = await this.validateoAuthToken(this.oAuthToken);
    if (validateOAuthTokenResponse.status && (validateOAuthTokenResponse.status === 401 || validateOAuthTokenResponse.status === 403)) {
      const newOAuthToken = await this.getoAuthToken(clientId, clientSecret, scope, grantType);
      return newOAuthToken;
    } else if (validateOAuthTokenResponse.client_id) {
      return validateOAuthTokenResponse;
    }
  }

  private async getoAuthToken(clientId: string, clientSecret: string, scope: string = "", grantType: string = "client_credentials") {
    // console.log(`getting oauth token start scope:${scope} grantType: ${grantType}`);
    let url = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=${grantType}`;
    if (scope !== "") {
      url = `${url}&scope=${scope}`;
    }
    const response = await fetch(url, {
      method: "post",
    });
    const json = await response.json();
    // console.log("getting oauth token end", json);
    this.oAuthToken = json.access_token;
    return json;
  }

  private async validateoAuthToken(token: string) {
    // console.log("validate oauth token (" + token + ") start");
    const response = await fetch("https://id.twitch.tv/oauth2/validate", {
      headers: {
        Authorization: `OAuth ${token}`,
      },
    });
    const json = await response.json();
    // console.log("validate oauth token end", json);
    return json;
  }

  async getTwitchEmotesBySets(setIds: string[]): Promise<Emote[]> {
    await this.checkoAuthToken(SECRETS.botClientId, SECRETS.botClientSecret);
    const headers = this.getTwitchRequestHeaders();
    const emoteSetResponse = await fetch(`https://api.twitch.tv/kraken/chat/emoticon_images?emotesets=${setIds.join(",")}`, { headers });

    let jsonData = await emoteSetResponse.json();
    // console.log('emotes by set emotes', jsonData);
    const emoticonSets = jsonData.emoticon_sets || {};
    const formattedEmotes: Emote[] = [];
    setIds.forEach((setId: string) => {
      if (emoticonSets[setId]) {
        emoticonSets[setId].forEach((emote: Emote) => {
          formattedEmotes.push(new Emote(emote.scale, emote.url, emote.code, emote.id, "twitch", emote.emoticon_set));
        });
      }
    });
    return formattedEmotes;
  }

  async getTwitchEmotes(broadcasterId: string) {
    this.oAuthToken = SECRETS.irc.userOAuthPassword;
    await this.checkoAuthToken(SECRETS.botClientId, SECRETS.botClientSecret, "", "authorization_code");
    const headers = this.getTwitchRequestHeaders();
    const emoteResponse = await fetch(`${this.helixBaseUrl}/chat/emotes?broadcaster_id=${broadcasterId}`, { headers });
    console.log("twitch emote response", emoteResponse);
    console.log("showme", SECRETS);
    let responseBody = await emoteResponse.json();
    console.log("emotes", responseBody?.data);
    let emotes = [];
    if (responseBody?.data?.length > 0) {
      emotes = responseBody.data;
    }

    // const subBadges = data.subscriber_badges || [];
    let formattedEmotes: Emote[] = [];
    const formattedSubBadges: SubBadge[] = [];
    // console.log("emotes yayay: ", emotes);
    emotes.forEach((emote: any) => {
      formattedEmotes.push(new Emote(1, emote.images.url_1x, emote.name, emote.id, "twitch", emote.emote_set_id));
    });
    formattedEmotes = formattedEmotes.concat(this.loadEmotesFromConfig());
    // Object.keys(subBadges).forEach((objectKey: any) => {
    //   const subLoyaltyImages = [subBadges[objectKey].image_url_1x, subBadges[objectKey].image_url_2x, subBadges[objectKey].image_url_4x];
    //   formattedSubBadges.push(new SubBadge(objectKey, subBadges[objectKey].title, subLoyaltyImages));
    // });
    return new TwitchEmoteResponse(broadcasterId, "channel name", "display name", formattedEmotes, formattedSubBadges).emotes;
    // return new TwitchEmoteResponse('', '', '', '', '').emotes;
  }

  async getBttvEmotesByChannel(channelName: string) {
    const bttvChannelResponse = await fetch(`https://api.betterttv.net/2/channels/${channelName}`);
    // console.log('unmanaged emotes', data);
    let data = await bttvChannelResponse.json();
    const emotes = data.emotes || [];
    const formattedEmotes: Emote[] = [];
    emotes.forEach((emote: Emote) => {
      const formattedEmote = new Emote(1, "", emote.code, emote.id, "bttv");
      formattedEmote.channel = emote.channel;
      formattedEmote.imageType = emote.imageType;
      formattedEmotes.push(formattedEmote);
    });
    return new BttvEmoteResponse(data.urlTemplate, formattedEmotes).emotes;
    // return new BttvEmoteResponse('', []).emotes;
  }

  async getGlobalBttvEmotes() {
    const globalBttvEmotes = await fetch(`https://api.betterttv.net/3/cached/emotes/global`);
    // console.log('unmanaged emotes', data);
    let data = await globalBttvEmotes.json();
    const emotes = data || [];
    const formattedEmotes: Emote[] = [];
    emotes.forEach((emote: Emote) => {
      const formattedEmote = new Emote(1, "", emote.code, emote.id, "bttv");
      formattedEmote.channel = emote.channel;
      formattedEmote.imageType = emote.imageType;
      formattedEmotes.push(formattedEmote);
    });
    return new BttvEmoteResponse(data.urlTemplate, formattedEmotes).emotes;
    // return new BttvEmoteResponse('', []).emotes;
  }

  async getCurrentSubscriptions() {
    await this.checkoAuthToken(SECRETS.botClientId, SECRETS.botClientSecret);
    const headers = this.getTwitchRequestHeaders();

    return await fetch(`${this.helixBaseUrl}webhooks/subscriptions`, { method: "GET", headers: headers });
  }

  // i want this thing to monitor for new people following when i am live
  async subscribeToTopic(subscribe: boolean, leaseTimeInMinutes: number, topicCallbackName: string, topicUrl: string) {
    await this.checkoAuthToken(SECRETS.botClientId, SECRETS.botClientSecret);
    const headers = this.getTwitchRequestHeaders();

    headers["Content-Type"] = "application/json";
    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        "hub.callback": `${this.pubSubCallbackUrl}${topicCallbackName}`,
        "hub.mode": subscribe ? "subscribe" : "unsubscribe",
        "hub.topic": `${this.helixBaseUrl}${topicUrl}`,
        "hub.lease_seconds": 60 * leaseTimeInMinutes,
        "hub.secret": SECRETS.botPublisherSecret,
      }),
    };
    return await fetch(`${this.helixBaseUrl}webhooks/hub`, options);
  }

  // get all bttv emotes available
  // https://api.betterttv.net/3/emotes/shared?limit=100
  // https://api.betterttv.net/3/emotes/shared?before=5e176c89b9741121048064c0&limit=100

  loadEmotesFromConfig(): Emote[] {
    const emotes = [];
    for (const emoteSetKey in extraEmotes) {
      const emoteSetId = extraEmotes[emoteSetKey].id;
      for (const emoteKey in extraEmotes[emoteSetKey]) {
        if (emoteKey !== "id") {
          emotes.push(new Emote(1, "", emoteKey, extraEmotes[emoteSetKey][emoteKey], "twitch", emoteSetId));
        }
      }
    }
    return emotes;
  }

  handleError(error: any) {
    console.log("Error", error);
  }
}
