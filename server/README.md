# Websocket server

## Install on server

### Environment file

Create `/server/.env` file with the following content:

```sh
VITE_WSS_PORT=1337 # your port
```

### Nginx

_tba._

### PM2

```sh
$ pm2 start ecosystem.config.js
```
