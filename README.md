# twitch-bot

[Treee.github.io](https://treee.github.io/twitch-bot/)

# Docker

## Build

`docker build -t stream-emote-overlay:latest .`

## Run

`docker run -d -v /etc/letsencrypt:/etc/letsencrypt -p 8446:8446 --name emote-overlay -it stream-emote-overlay:latest`

`docker run -v /etc/letsencrypt:/etc/letsencrypt -p 8446:8446 --name emote-overlay -it stream-emote-overlay:latest`

`service nginx restart`