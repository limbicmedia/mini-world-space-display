#Miniature World Space Video App

Uses OMXPlayer to display a sequence of 6 videos that change with the click of a mouse. Only works on a Raspberry Pi!

##Installation

Requires NodeJS, tested with v6.3.0

###Raspberry Pi Config

- [Write OS image to SD card](https://www.raspberrypi.org/documentation/installation/installing-images/mac.md)
- [Configure Wifi](https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md)
- Run `sudo apt-get update && sudo apt-get upgrade`
- Run `sudo apt-get autoremove`

###NodeJS

Install via NVM (https://github.com/creationix/nvm)

```sh
sudo su -
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
```

Install Node 6

`nvm install 6`

Make Node available for all users

`n=$(which node);n=${n%/bin/node}; chmod -R 755 $n/bin/*; sudo cp -r $n/{bin,lib,share} /usr/local`


###Video Player

```sh
git clone https://github.com/limbicmedia/mini-world-space-display.git
cd mini-world-space-display
apt-get install omxplayer -y
npm install
npm start
```

###Sending Video Files

Video files can be sent to the device using SCP (http://www.hypexr.org/linux_scp_help.php)

Example:

`scp newMovie.mp4 pi@10.0.0.181:/home/pi/mini-world-space-display/videos/`

Where:

* `newMovie.mp4` is the name of the video to send
* `10.0.0.181` is the current IP address of the device

##Operation

###OMXPlayer

http://elinux.org/Omxplayer

###Process Manager

[PM2](https://github.com/Unitech/pm2) is recommended for process management.

```sh
npm install -g pm2
pm2 start index.js --name="mwSpaceHand"
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
