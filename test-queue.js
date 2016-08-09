var omx = require('node-omxplayer');
var Mouse = require("node-mouse");
 
var player1 = omx();
var player2 = omx();
var m = new Mouse();
var volume = 20; // volume in millibels

var videos = [
  'Space_Hand_BG.mov',
  'SpaceHandS1.mov',
  'SpaceHandS2.mov',
  'SpaceHandS3.mov',
  'SpaceHandS4.mov',
  'SpaceHandS5.mov'
];

var prefix = __dirname + '/videos/';
player1.newSource(prefix+videos[0], 'both', true, volume, ['--no-osd']);
//player2.newSource(prefix+videos[3], 'both', false, volume);

// Events: mousedown, mouseup, click, mousemove
m.on("mousedown",function(event) {
  if(event.leftBtn){
    player1.pause();
    console.log('paused');
  } else if(event.rightBtn){
    player1.play();
    console.log('playing');
  }
  player1.prevChapter();
});

player1.on('close', function(){  
  console.log('Video 1 end');
});

player2.on('close', function(){
  console.log('Video 2 end');
});

process.stdin.resume();

function exitHandler(options, err) {
  console.info('Handling exit...');

  if(player1 && player1.running){
    player1.quit();
    console.log('OMXPlayer shutdown success');
  }
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
