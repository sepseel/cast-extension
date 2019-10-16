let layouts = [
  {
    id: "connection-popup",
    name: "Connection"
  },
  {
    id: "media-popup",
    name: "Controls"
  }
]
let activeLayout = 0;



document.addEventListener("click", e => {
  if (e.target.classList.contains("prev-layout")) {
    prevLayout();
  } else if (e.target.classList.contains("next-layout")) {
    nextLayout();
  }
})

function setLayout(activeLayout) {
  // first hide all the layouts
  for (layout of layouts) {
    document.querySelector("#"+layout.id).classList.add("hidden");
  }
  // then show the active one
  document.querySelector("#"+layouts[activeLayout].id).classList.remove("hidden");
  document.querySelector("#layout-name").innerHTML = layouts[activeLayout].name;
}

function nextLayout() {
  activeLayout += 1;
  if (activeLayout == layouts.length) {
    activeLayout = 0;
  }
  setLayout(activeLayout)
}

function prevLayout() {
  activeLayout -= 1;
  if (activeLayout < 0) {
    activeLayout = layouts.length-1;
  }
  setLayout(activeLayout);
}

