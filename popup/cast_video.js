
/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
paused = false;

function listenForClicks() {
  document.addEventListener("click", (e) => {

    function cast(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "cast",
      });
    }

    function pause(tabs) {
      paused = (paused == false);
      if (paused) {
        document.getElementById("pause").innerHTML = "|>"
      } else {
        document.getElementById("pause").innerHTML = "||"
      }
      browser.tabs.sendMessage(tabs[0].id, {
        command: "pause",
      });
    }

    function seekBack(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "seek",
        value: -5,
      });
    }

    function seekFwd(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "seek",
        value: 5,
      });
    }

    function volume(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "volume",
        value: document.getElementById('volumeSlider').value,
      });
    }

    /**
     * Just log the error to the console.
     */
    function reportError(error) {
      console.error(`Could not cast: ${error}`);
    }

    /**
     * Get the active tab,
     * then call "beastify()" or "reset()" as appropriate.
     */
    if (e.target.classList.contains("cast")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(cast)
        .catch(reportError);
    }
    else if (e.target.classList.contains("pause")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(pause)
        .catch(reportError);
    }
    else if (e.target.classList.contains("seekBack")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(seekBack)
        .catch(reportError);
    }
    else if (e.target.classList.contains("seekFwd")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(seekFwd)
        .catch(reportError);
    }
    else if (e.target.classList.contains("slider")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(volume)
        .catch(reportError);
    }
    else {
      console.log(e.target.classList)
    }
    
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
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
