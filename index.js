var omx = require('./node-omxplayer');
var Mouse = require("node-mouse");
 
var player = omx();
var m = new Mouse();
var seqState = 0;
var volume = 20; // volume in millibels
var omxArgs = ['--no-osd', '--blank'];

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

playCurrentVideo(seqState);

// Events: mousedown, mouseup, click, mousemove
m.on("mousedown",function(event) {
  if(seqState++ >= 5) seqState = 0;
  console.log('Clicked!', seqState);

  playCurrentVideo(seqState);
});

player.on('close', function(){  
  console.log('Video end');
  seqState = 0;
  playCurrentVideo(seqState);
});

process.stdin.resume();

function exitHandler(options, err) {
  console.info('Handling exit...');

  if(player && player.running){
    player.quit();
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
