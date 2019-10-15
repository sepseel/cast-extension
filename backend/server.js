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
    console.log("new connection:",socket.id)

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

    // TODO: respond to every request with the new state for the view
    socket.on('cast', data => {
        console.log("Casting:", data.url);
        currVolume = 100;
        paused = false;
        playing = true;
        player.play(data.url)
    });

    socket.on('stopCast', () => {
        playing = false;
        player.stop();
    });
    
    socket.on('pause', () => {
        console.log("TogglePause")
        paused = (paused == false)
        player.togglePause();
    });

    socket.on('seek', data => {
        console.log("seek: "+data.sec+"s")
        if (data.sec > 0) {
            player.seekForward();
        } else {
            player.seekBackward();
        }
    });

    socket.on('volume', data => {
        console.log("volume "+data.vol+"%")
        while (currVolume < data.vol) {
            player.increaseVolume()
            currVolume += 5;
        }
        while (currVolume > data.vol) {
            player.decreaseVolume()
            currVolume -= 5;
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

    // TODO refactor into single response
    socket.on('getVolume', data => {
        console.log("getVolume")
        io.sockets.emit('setVolume', {vol: currVolume})
    });
    socket.on('getPaused', data => {
        console.log("getPaused")
        io.sockets.emit('setPaused', {paused: paused});
    });
    socket.on('getPlaying', data => {
        console.log("getPlaying")
        io.sockets.emit('setPlaying', {playing: playing});
    });
}


startServer(8000)
