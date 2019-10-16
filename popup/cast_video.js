




/**
 * Functions to update the view elements
 */
// binds incoming messages to functions
browser.runtime.onMessage.addListener((message) => {
  switch(message.command) {
    case 'setView':
      setView(message.value)
      break;
  }
});
function setView(data) {       // TODO
  if (data.connected) {
    setLayout(2)
    // document.querySelector("#connection-popup").classList.add("hidden");
    // document.querySelector("#media-popup").classList.remove("hidden");
    setVolume(data.vol);
    setPaused(data.paused);
    setPlaying(data.playing);
  } else { 
    // hide 
    setLayout(1);
    // document.querySelector("#media-popup").classList.add("hidden");
    // document.querySelector("#connection-popup").classList.remove("hidden");

  }
}
function setVolume(volume) {   // set the value of the volume slider
  document.getElementById("volumeSlider").value = volume;
}
function setPaused(paused) {   // set the value of the pause button
  if (paused) {
    document.getElementById("pause").innerHTML = "|>"
  } else {
    document.getElementById("pause").innerHTML = "||"
  }
}
function setPlaying(playing) { // set the value of the casting button
  if (playing) {
    document.querySelector("#castButton").classList.add("hidden");
    document.querySelector("#stopCastButton").classList.remove("hidden");
  } else {
    document.querySelector("#castButton").classList.remove("hidden");
    document.querySelector("#stopCastButton").classList.add("hidden");
  }
}
function updateView() {        // sends all the mesages to update the view
  browser.runtime.sendMessage({
    command: 'getView'
  })
}

function listenForClicks() {
  updateView(); // updates the view everytime the popup is opened and there are no errors
  document.addEventListener("click", (e) => {
    /**
     * Add handlers for all the elements of the popup
     */
    if (e.target.classList.contains("cast")) {
      cast();
    } else if (e.target.classList.contains("stopCast")) {
      stopCast();
    } else if (e.target.classList.contains("pause")) {
      pause()
    } else if (e.target.classList.contains("seekBack")) {
      seek(-5);
    } else if (e.target.classList.contains("seekFwd")) {
      seek(5);
    } else if (e.target.classList.contains("slider")) {
      volume(document.getElementById('volumeSlider').value);
    } else if (e.target.classList.contains("submit-addres")) {
      connect(document.getElementById('addres-input').value)
      //docment.getElementById('addres-input').value
    }
    // } else if (e.target.classList.contains('toggle-layout')) {
    //   if (document.getElementById("media-popup").classList.contains("hidden")) {
    //     document.querySelector("#media-popup").classList.remove("hidden");
    //     document.querySelector("#connection-popup").classList.add("hidden");
    //   } else {
    //     document.querySelector("#media-popup").classList.add("hidden");
    //     document.querySelector("#connection-popup").classList.remove("hidden");
    //   }
    // }

    /**
     * functions that handle the buttons on the popup
     */
    function cast() { // send a message to the content-script to get the page url
      browser.tabs.query({active: true, currentWindow: true}) // get the active tab
      .then(tabs => {
        browser.tabs.sendMessage(tabs[0].id, { // send a message to the content sctipt of that tab
        command: "cast",
        });
      })
      .catch(error => {
        console.error(`Could not cast: ${error}`);
      });
    }
    function stopCast() { // sends a message to stop casting
      browser.runtime.sendMessage({
        command: "stopCast",
      })
    }
    function pause() {    // sends a lessage to toggle pause
      browser.runtime.sendMessage({
        command: "pause",
      });
    }
    function seek(sec) {  // sends a message to seek forward or back in the video
      browser.runtime.sendMessage({
        command: "seek",
        value: sec,
      })
    }
    function volume(vol) {// sends a message to change the volume 
      browser.runtime.sendMessage({
        command: "volume",
        value: vol,
      });
    }
    function connect(addres) {
      browser.runtime.sendMessage({
        command: "connect",
        value: "http://"+addres,
      });
    }
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  setLayout(0);
  // document.querySelector("#media-popup").classList.add("hidden");
  // document.querySelector("#connection-popup").classList.add("hidden");
  // document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "/content_scripts/cast.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);
