browser.runtime.onMessage.addListener((message) => { // bind incoming messages to functions
  switch(message.command) {
    case 'setView':
      setView(message.value)
      break;
  }
});
function setView(data) {                             // set the correct content in the popup
  if (data.connected) {
    setLayout(2)
    setVolume(data.vol);
    setPaused(data.paused);
    setPlaying(data.playing);
  } else { 
    setLayout(1);
  }
}
function updateView() {                              // sends a message to ask for the view
  browser.runtime.sendMessage({
    command: 'getView'
  })
}
function reportExecuteScriptError(error) {           // display the error and hide the ui
  setLayout(0);
  console.error(`Failed to execute content script: ${error.message}`);
}

browser.tabs.executeScript({file: "/content_scripts/cast.js"}) // inject the content script
.then(updateView)
.catch(reportExecuteScriptError);                              // injecting the content script failed
