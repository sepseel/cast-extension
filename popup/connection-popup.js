document.addEventListener("click", (e) => {
  if (e.target.classList.contains("submit-addres")) {
    connect(document.getElementById('addres-input').value)
  }

  function connect(addres) {
    browser.runtime.sendMessage({
      command: "connect",
      value: "http://"+addres,
    });
  }
})