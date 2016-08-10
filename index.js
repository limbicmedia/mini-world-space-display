var omx = require('./node-omxplayer');
var Mouse = require("node-mouse");
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var debounce = require('debounce');
var fs = require('fs-extra');
var path = require('path');
 
var player = omx();
var m = new Mouse();
var seqState = 0;
var volume = 20; // volume in millibels
var omxArgs = ['--no-osd', '--blank', '--video_fifo', '1', '--video_queue', '1'];

var videos = [
    'Space_Hand_BG.mov',
    'SpaceHandS1.mov',
    'SpaceHandS2.mov',
    'SpaceHandS3.mov',
    'SpaceHandS4.mov',
    'SpaceHandS5.mov'
  ];

function getVideo(index){

  var output = __dirname + '/videos/' + videos[index];
  var output = '/var/tmp/video/' + videos[index];
  console.log(output);
  return output;
}

function playCurrentVideo(){
  var loop = seqState ? false : true;
  player.newSource(getVideo(seqState), 'both', loop, volume, omxArgs);
}

// Hide terminal, play video
exec('sudo sh -c "TERM=linux setterm -foreground black -clear all >/dev/tty0"');

// Move videos to /var/tmp/ for less SD I/O
for(var i=0;i<videos.length;i++){
  console.log('copying', videos[i]);
  fs.copySync(path.resolve(__dirname,'./videos/'+videos[i]), '/var/tmp/video/'+videos[i]);
}

// Start the party
playCurrentVideo();

// Events: mousedown, mouseup, click, mousemove
m.on('mousedown', debounce(incrementVideo, 1000, true));

function incrementVideo(){
  if(seqState++ >= 5) seqState=0;
  console.log('Clicked!', seqState);
  playCurrentVideo();
}

player.on('close', function(){  
  console.log('Video end');
  seqState = 0;
  playCurrentVideo();
});

process.stdin.resume();

function exitHandler(options, err) {
  // Restore terminal
  exec('sudo sh -c "TERM=linux setterm -foreground white -clear all>/dev/tty0"');
  console.info('Handling exit...');

  if(player && player.running){
    player.quit();
    console.log('OMXPlayer shutdown success');
  }

  spawn('killall', ['omxplayer', 'omxplayer.bin', 'node', '-s', '9']);
  if (options.cleanup) console.log('clean');
  if (err) console.log(err.stack);
  if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
