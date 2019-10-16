let socket;
let connected = false;
/**
* Bind incomming messages from from the popup or content-script to functions
*/
browser.runtime.onMessage.addListener((message) => {
  switch(message.command) {
    case 'connect':
      connect(message.value);
      break;
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

function connect(addres) {    // make a connection to the server
  try {
    socket.disconnect();
    console.log("Disconnected from", addres);
    connected = false;
  } catch(error) {
    // do nothing
  } finally {
    socket = io.connect(addres)
  }

  /**
   * Handlers for server responses
   */
  socket.on('connect', () => {
    console.log("Connected to", addres);
    connected = true;
    getView();
  });
  socket.on('setView', data => {  // send a message to the popup to update itself
    console.log("<-",data)
    browser.runtime.sendMessage({
      command: "setView",
      value: data
    })
  })

  getView();
}

/**
 * Functions to send messages to the server
 */
function cast(url) {   // tell the server to cast a video
  console.log("->", url)
  socket.emit('cast', {url: url})
}
function stopCast() {  // tell the setver to stop casting
  console.log("-> stopCast")
  socket.emit('stopCast')
}
function pause() {     // tell the server to toggle pause
  console.log("-> togglePause")
  socket.emit('pause')
}
function seek(sec) {   // tell the servevr to seek in the video
  console.log("-> seek "+sec+"s");
  socket.emit('seek', {sec: sec})
}
function volume(vol) { // tell the server to change the volume
  console.log("-> volume "+vol+"%");
  socket.emit('volume', {vol:vol})
}
function getView() {   // ask the server for the current state of the player
  if (connected) {
    console.log("-> getView")
    socket.emit('getView')
  } else { // if were not connected, dont display the media player
    browser.runtime.sendMessage({
      command: "setView",
      value: {connected: false}
    })
  }
}


