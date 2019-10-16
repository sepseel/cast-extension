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
  } 
  
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
});

/**
 * functions to set the ui elements
 */
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