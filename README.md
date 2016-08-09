#Miniature World Space Video App

Uses OMXPlayer to display a sequence of 6 videos that change with the click of a mouse. Only works on a Raspberry Pi!

##Installation

Requires NodeJS, tested with v6.3.0

```sh
git clone https://github.com/limbicmedia/mini-world-space-display.git
cd mini-world-space-display
apt-get install omxplayer -y
npm install
npm start
```

##Operation

[PM2](https://github.com/Unitech/pm2) is recommended for process management. 

```sh
pm2 start index.js --name="mwSpaceHand" --watch #watch flag optional, for development
pm2 startup #generates startup script
pm2 save #saves running scripts to startup
```

**Debugging PM2**

```sh
pm2 list
pm2 logs [app-name]
pm2 restart [app-name]
pm2 stop [app-name]
```
