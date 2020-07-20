FROM alpine

ARG server_port

RUN apk add --update npm

WORKDIR /twitch-bot
COPY package.json /twitch-bot/package.json
RUN npm install 

COPY . /twitch-bot
RUN npm run build

EXPOSE ${server_port}

CMD ["npm", "start"]