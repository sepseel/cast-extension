


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

  // const baseUrl = "http://10.0.1.72:80/play?url=";
  baseUrl = "http://127.0.0.1:80/";
  castUrl = "play?url=";
  pauseUrl = "pause?pause=";
  seekUrl = "seek?value=";

	function cast() {
    

    let videoURL = window.location.href;
    let url = baseUrl+castUrl+videoURL;
    console.log("sending... ", url);
  
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(xhttp.responseText);
      }
    };
    xhttp.open("GET", url);
    xhttp.send();
	}

	function pause() {
 

    let url = baseUrl+pauseUrl;
    console.log("sending... ", url);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(xhttp.responseText);
      }
    };
    xhttp.open("GET", url);
    xhttp.send();
  }
  
  function seek(value) {


    let url = baseUrl+seekUrl+value;
    console.log("sending... ", url);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(xhttp.responseText);
      }
    };
    xhttp.open("GET", url);
    xhttp.send();
  }

  function volume(vol) {
    console.log(vol)
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "cast") {
      cast();
    } else if (message.command === "pause") {
      pause();
    } else if (message.command === "seek") {
      seek(message.value);
    } else if (message.command === "volume") {
      volume(message.value);
    }
  });

})();
