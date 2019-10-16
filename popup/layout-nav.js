let layouts = [
  {
    id: "error-content",
    name: "Error"
  },
  {
    id: "connection-popup",
    name: "Connection"
  },
  {
    id: "media-popup",
    name: "Controls"
  }
]
let activeLayout = 1;



document.addEventListener("click", e => {
  if (activeLayout != 0 && e.target.classList.contains("prev-layout")) {
    prevLayout();
  } else if (activeLayout != 0 && e.target.classList.contains("next-layout")) {
    nextLayout();
  }
})

function setLayout(layoutIndex) {
  activeLayout = layoutIndex;
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
    activeLayout = 1;
  }
  setLayout(activeLayout)
}

function prevLayout() {
  activeLayout -= 1;
  if (activeLayout < 1) {
    activeLayout = layouts.length-1;
  }
  setLayout(activeLayout);
}

