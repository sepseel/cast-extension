// make a connection to the server
//const ADDRES = 'http://127.0.0.1:8000';
const ADDRES = 'http://10.0.1.72:8000';f
let socket = io.connect(ADDRES)
console.log("Connected to", ADDRES);

/**
* Bind incomming messages from from the popup or content-script to functions
*/
browser.runtime.onMessage.addListener((message) => {
  switch(message.command) {
    case 'cast':
    cast(message.value);
    break;
    case 'stopCast':
    stopCast();
    break;
    case 'pause':
    pause()
    break;
    case 'seek':
    seek(message.value);
    break;
    case 'volume':
    volume(message.value);
    break;
    case 'getVolume': 
    getVolume()
    break;
    case 'getPaused':
    getPaused()
    break;
    case 'getPlaying':
    getPlaying()
    break;
  }
});

/**
 * Functions to send messages to the server
 */
function cast(url) {   // tell the server to cast a video
  console.log("Sending: ", url)
  socket.emit('cast', {url: url})
}
function stopCast() {  // tell the setver to stop casting
  console.log("Sending: stopCast")
  socket.emit('stopCast')
}
function pause() {     // tell the server to toggle pause
  console.log("Sending: togglePause")
  socket.emit('pause')
}
function seek(sec) {   // tell the servevr to seek in the video
  console.log("Sending: seek "+sec+"s");
  socket.emit('seek', {sec: sec})
}
function volume(vol) { // tell the server to change the volume
  console.log("Sending: volume "+vol+"%");
  socket.emit('volume', {vol:vol})
}

// TODO: refactor these requests and responses into a single one
// Getting the current state of the player to display in the popup
function getVolume() {  // ask the server for the current volume
  console.log("Sending: getVolume")
  socket.emit('getVolume')
}
function getPaused() {  // ask the server for the paused state
  console.log("Sending: getPaused")
  socket.emit('getPaused')
}
function getPlaying() { // ask the server if its playing a video
  console.log("Sending: getPlaying")
  socket.emit('getPlaying')
}
// handle the response from the server
socket.on('setVolume', data => {  // pass on the volume to the popup
  browser.runtime.sendMessage({
    command: "setVolume",
    value: data.vol
  });
}) 
socket.on('setPaused', data => {  // pass on the paused state to the popup
  browser.runtime.sendMessage({
    command: "setPaused",
    value: data.paused
  });
})
socket.on('setPlaying', data => { // pass on the playing state to the popup
  browser.runtime.sendMessage({
    command: "setPlaying",
    value: data.playing
  });
})


