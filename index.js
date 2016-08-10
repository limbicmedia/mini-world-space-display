var omx = require('./node-omxplayer');
var Mouse = require("node-mouse");
var debounce = require('debounce');
var spawn = require('child_process').spawn;
 
var volume = 20; // volume in millibels
var player = omx();
var bgPlayer = omx(getVideo(0), 'both', true, volume, ['--no-osd', '--blank', '--layer', '1']);
var m = new Mouse();
var seqState = 1;
var omxArgs = ['--no-osd', '--blank', '--layer', '2'];

function getVideo(index){
  var videos = [
    'Space_Hand_BG.mov',
    'SpaceHandS1.mov',
    'SpaceHandS2.mov',
    'SpaceHandS3.mov',
    'SpaceHandS4.mov',
    'SpaceHandS5.mov'
  ];

  var output = __dirname + '/videos/' + videos[index];
  console.log(output);
  return output;
}

function playCurrentVideo(){
  var loop = seqState ? false : true;
  player.newSource(getVideo(seqState), 'both', loop, volume, omxArgs);
}

// Events: mousedown, mouseup, click, mousemove
m.on('mousedown', debounce(incrementVideo, 1000, true));

function incrementVideo(){
  bgPlayer.prevChapter();

  if(seqState++ >= 5) seqState=1;
  console.log('Clicked!', seqState);
  playCurrentVideo();
}

player.on('close', function(){  
  console.log('Video end');
  seqState = 1;

  bgPlayer.prevChapter();
});

player.on('error', console.log);

process.stdin.resume();

function exitHandler(options, err) {
  console.info('Handling exit...');
  process.stdin.end();

  if(player.running) player.quit();
  if(bgPlayer.running) bgPlayer.quit();

  console.log('OMXPlayer shutdown success');

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
