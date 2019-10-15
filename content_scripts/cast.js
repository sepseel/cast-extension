(function() {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;
  
  /**
   * Handler for messages from the popup
   */
  browser.runtime.onMessage.addListener((message) => {
    // get the page url and send it back to the background-script
    if (message.command === "cast") {
      let videoURL = window.location.href;
      browser.runtime.sendMessage({
        command: "cast",
        value: videoURL
      });  
    } 
  });
})();


