/* Load required modules */
var Mouse = require("node-mouse");
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var debounce = require('debounce');
var fs = require('fs-extra');
var path = require('path');

/* Handle command line arguments */
var cliArgs = require('command-line-args')
var optionDefs = [{ name: 'noPi', alias: 'n', type: Boolean, defaultValue: false }];
var options = cliArgs(optionDefs);

if(options.noPi === false){

  // When running on an rPi, include these modules
  var omx = require('./node-omxplayer');
  var player = omx();
  var m = new Mouse();

} else {

  // When not on an rPi, show a warning...
  console.log('** WARNING **');
  console.log('Running in non-rPi mode!');
  console.log('OMXPlayer and Mouse input are disabled.');
  console.log('** WARNING **\n\n');

  // ...and fake out OMXPlayer and Mouse input.
  player = {
    on: function(){},
    newSource: function(){},
    quit: function(){},
    run: function(){},
  };

  m = {
    on: function(){}
  }
}

// Some basic settings
var seqState = 0;
var volume = 20; // volume in millibels
var omxArgs = ['--no-osd', '--blank', '--video_fifo', '1', '--video_queue', '1'];

// Array of video files to use
var videos = [
    'Space_Hand_BG.mov',
    'SpaceHandS1.mov',
    'SpaceHandS2.mov',
    'SpaceHandS3.mov',
    'SpaceHandS4.mov',
    'SpaceHandS5.mov'
  ];

// Return the formatted absolute video file path
function getVideo(index){
  var output = __dirname + '/videos/' + videos[index];
  var output = '/var/tmp/video/' + videos[index];
  console.log(output);
  return output;
}

// Play the current video, as denoted by `seqState`
function playCurrentVideo(){
  var loop = seqState ? false : true;
  player.newSource(getVideo(seqState), 'both', loop, volume, omxArgs);
}

// Hide terminal content that shows through the background of OMXPlayer
if(!options.noPi){
  exec('sudo sh -c "TERM=linux setterm -foreground black -clear all >/dev/tty0"');
}

// Move videos to /var/tmp/ for less SD I/O (make the SD card last longer)
for(var i=0;i<videos.length;i++){
  console.log('copying', videos[i]);
  fs.copySync(path.resolve(__dirname,'./videos/'+videos[i]), '/var/tmp/video/'+videos[i]);
}

// Start the party!
playCurrentVideo();

// Events: mousedown, mouseup, click, mousemove
m.on('mousedown', debounce(incrementVideo, 1000, true));

// Move to the next video index
function incrementVideo(){
  if(seqState++ >= 5) seqState=0;
  console.log('Clicked!', seqState);
  playCurrentVideo();
}

// When a video ends, revert to the background loop video
player.on('close', function(){
  seqState = 0;
  playCurrentVideo();
});

// Keep this script running all day!
process.stdin.resume();

// Make sure we close or die without leaving a mess
function exitHandler(options, err) {

  console.info('Handling exit...');

  // Restore visibility of terminal content
  exec('sudo sh -c "TERM=linux setterm -foreground white -clear all>/dev/tty0"');

  if(player && player.running){
    player.quit();
    console.log('OMXPlayer shutdown success');
  }

  spawn('killall', ['omxplayer', 'omxplayer.bin', 'node', '-s', '9']);
  if (options.cleanup) console.log('clean');
  if (err) console.log(err.stack);
  if (options.exit) process.exit();
}

if(!options.noPi){
  // Catch a normal process exit signal
  process.on('exit', exitHandler.bind(null,{cleanup:true}));

  // Catch the ctrl+c event
  process.on('SIGINT', exitHandler.bind(null, {exit:true}));

  // Catch uncaught exceptions
  process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
}