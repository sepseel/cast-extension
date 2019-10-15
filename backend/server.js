const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const mpv = require('mpv-controller');
let io;

function startServer(PORT) {
  const app = express();
  app.use(cors({
    origin: 'http://localhost:'+PORT
  }))
  const server = app.listen(PORT);
  io = socket(server);
  app.use(express.static('public'));
  console.log("Server running on port", PORT);
  io.sockets.on('connection', newConnection);
}

function newConnection(socket) {
  console.log("New connection:",socket.id)
  
  let currVolume = 100;
  let paused = false;
  let playing = false;
  let player = new mpv(status => {
    //console.log(status);
    // TODO: get player states (paused, playing, vol) from status
    if (status.exit) {
      console.log("Player was closed")
      playing = false            
    }
  });
  
  socket.on('cast', data => {
    if (!playing) {
      console.log("Casting:", data.url);
      currVolume = 100;
      paused = false;
      playing = true;
      player.play(data.url)
      setView()
    }
  });
  
  socket.on('stopCast', () => {
    if (playing) {
      console.log("StopCast")
      playing = false;
      player.stop();
      setView()
    }
  });
  
  socket.on('pause', () => {
    if (playing) {
      console.log("TogglePause")
      paused = (paused == false)
      player.togglePause();
      setView()
    }
  });
  
  socket.on('seek', data => {
    if (playing) {
      console.log("seek: "+data.sec+"s")
      if (data.sec > 0) {
        player.seekForward();
      } else {
        player.seekBackward();
      }        
      setView()
    }
  });
  
  socket.on('volume', data => {
    if (playing) {
      console.log("volume "+data.vol+"%")
      while (currVolume < data.vol) {
        player.increaseVolume()
        currVolume += 5;
      }
      while (currVolume > data.vol) {
        player.decreaseVolume()
        currVolume -= 5;
      }
      setView()
    }
  });
  
  socket.on('getView', () => {
    console.log("getView");
    setView();
  });
  
  function setView() {
    data = {
      vol: currVolume,
      paused: paused,
      playing: playing
    }
    console.log('setView:',data)
    io.sockets.emit('setView', data);
  }
}

startServer(8000)
