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

# Make NVM available right away
source ~/.profile

# Test NVM by getting version
nvm --version
```

Install Node 6 (still as root user)

```
nvm install 6

# Test Node by getting version
node --version
```

Make Node available for all users (still as root user)

`n=$(which node);n=${n%/bin/node}; chmod -R 755 $n/bin/*; sudo cp -r $n/{bin,lib,share} /usr/local`

Optionally, this command can be run one step at a time:

```sh
n=$(which node)
n=${n%/bin/node}
chmod -R 755 $n/bin/*
sudo cp -r $n/{bin,lib,share} /usr/local
```

Test for regular pi user: (starting still as root user)

```sh
# Exit root, go back to pi user
exit;

# Test Node by getting version
node --version
npm --version
```

###Video Player

Install dependencies and clone project from Github:

```sh
sudo apt-get install git omxplayer -y
git clone https://github.com/limbicmedia/mini-world-space-display.git
cd mini-world-space-display
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
sudo npm install -g pm2
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
