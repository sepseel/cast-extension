const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const mpv = require('mpv-controller');
let io;

// TODO: fix resolution
// TODO: dont play in highest res
// TODO: https://github.com/00SteinsGate00/Node-MPV/tree/Node-MPV-2

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
  console.log("~> New connection:",socket.id)
  
  let currVolume = 100;
  let prevVolume;
  let paused = false;
  let playing = false;
  let player = new mpv(status => {
    //console.log(status);
    // TODO: get player states (paused, playing, vol) from status
    if (status.exit) {
      console.log("Player was closed")
      playing = false;
      prevVolume = currVolume;
    }
  });
  
  socket.on('cast', data => {
    if (!playing) {
      console.log("<- Casting:", data.url);
      currVolume = 100;
      paused = false;
      playing = true;
      player.play(data.url)
      volume(prevVolume)
      setView()
    }
  });
  
  socket.on('stopCast', () => {
    if (playing) {
      console.log("<- StopCast")
      playing = false;
      player.stop();
      setView()
    }
  });
  
  socket.on('pause', () => {
    if (playing) {
      console.log("<- TogglePause")
      paused = (paused == false)
      player.togglePause();
      setView()
    }
  });
  
  socket.on('seek', data => {
    if (playing) {
      console.log("<- seek: "+data.sec+"s")
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
      console.log("<- volume "+data.vol+"%")
      volume(data.vol);
      setView()
    }
  });

  function volume(vol) {
    while (currVolume < vol) {
      player.increaseVolume()
      currVolume += 5;
    }
    while (currVolume > vol) {
      player.decreaseVolume()
      currVolume -= 5;
    }
  }
  
  socket.on('getView', () => {
    console.log("<- getView");
    setView();
  });
  
  function setView() {
    data = {
      vol: currVolume,
      paused: paused,
      playing: playing,
      connected: true
    }
    console.log('-> setView:',data)
    io.sockets.emit('setView', data);
  }

  socket.on('disconnect', () => {
    console.log("x~ Lost connection:", socket.id)
  })
}

startServer(8000)
