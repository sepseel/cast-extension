// make a connection to the server
//const ADDRES = 'http://127.0.0.1:8000';
const ADDRES = 'http://10.0.1.72:8000';
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
    case 'getView':
      getView()
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
function getView() {   // ask the server for the current state of the player
  console.log("Sending: getView")
  socket.emit('getView')
}

/**
 * Handlers for server responses
 */
socket.on('setView', data => {  // send a message to the popup to update itself
  browser.runtime.sendMessage({
    command: "setView",
    value: data
  })
})
