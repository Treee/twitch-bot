FROM alpine

RUN apk add --update npm

WORKDIR /emote-overlay
COPY package.json /emote-overlay/package.json
RUN npm install 

COPY . /emote-overlay
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]