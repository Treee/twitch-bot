FROM alpine

ARG server_port
ENV SERVER_PORT ${server_port}

ARG bot_client_id
ENV BOT_CLIENT_ID ${bot_client_id}

ARG bot_client_secret
ENV BOT_CLIENT_SECRET ${bot_client_secret}

ARG steam_api_key
ENV STEAM_API_KEY ${steam_api_key}

ARG steam_user_id
ENV STEAM_USER_ID ${steam_user_id}

ARG irc_user
ENV IRC_USER ${irc_user}

ARG irc_user_oauth_password
ENV IRC_USER_OAUTH_PASSWORD ${irc_user_oauth_password}

ARG irc_channels_to_monitor
ENV IRC_CHANNELS_TO_MONITOR ${irc_channels_to_monitor}

ARG bot_publisher_secret
ENV BOT_PUBLISHER_SECRET ${bot_publisher_secret}

RUN apk add --update npm

WORKDIR /twitch-bot
COPY package.json /twitch-bot/package.json
RUN npm install 

COPY . /twitch-bot
RUN npm run build

EXPOSE ${server_port}

CMD ["npm", "start"]