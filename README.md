# twitch-bot

[Treee.github.io](https://treee.github.io/twitch-bot/)


## Screens

Create the screen and name it.
`screen -S foo`

Attach to the screen
`screen -r foo`

## SSL
1. Stop all screens and containers
2. `sudo service nginx stop`
3. `sudo service httpd start`
4. `sudo certbot`
5. `sudo reboot`
6. `sudo service httpd stop`
7. `sudo service nginx start`
8. Start all screens and containers

[SSL Reference](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/SSL-on-amazon-linux-2.html#letsencrypt)