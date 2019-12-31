import {
  html,
  render
} from "https://unpkg.com/htm@2/preact/standalone.module.js";
import { Store } from "./store.js";
import { AudioPlayer } from "./audio-player.js";
import { Scene } from "./scene.js";
import { UI } from "./ui.js";

if (typeof DeviceMotionEvent !== "undefined") {
  const requestDeviceMotionPermissionButton = document.createElement("button");
  requestDeviceMotionPermissionButton.classList.add("fullscreen-button");
  requestDeviceMotionPermissionButton.addEventListener("click", async () => {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      await DeviceMotionEvent.requestPermission();
    }
    requestDeviceMotionPermissionButton.parentElement.removeChild(
      requestDeviceMotionPermissionButton
    );
  });
  document.body.appendChild(requestDeviceMotionPermissionButton);
}

const store = new Store({
  showTitle: true,
  waiting: true,
  running: false,
  seed: 0,
  power: 0
});

const audioPlayer = new AudioPlayer();
store.subscribe((state, prevState) => {
  if (state.waiting && !state.running) {
    audioPlayer.play("#title");
  }
  if (state.power > prevState.power) {
    audioPlayer.stop("#title");
    audioPlayer.play("#garagara");
    audioPlayer.stop("#result");
  }
  if (!state.running && prevState.running) {
    audioPlayer.play("#result");
  }
});

addEventListener("devicemotion", e => {
  const { x, y, z } = e.acceleration;
  const v = Math.sqrt(x * x + y * y + z * z) / e.interval;
  if (v < 1000) return;

  const power =
    store.state.power +
    parseInt(
      parseInt(v)
        .toString()
        .substring(-2, 2)
    );

  store.dispatch({
    ...store.state,
    waiting: false,
    finished: false,
    power
  });
});

let lastTimeStamp = performance.now();
const reducePower = timeStamp => {
  const delta = (timeStamp - lastTimeStamp) / 1000;

  let { power, seed, waiting } = store.state;

  if (power > 10) {
    power -= power * 0.9 * delta;
    seed += store.state.power - power;
    store.dispatch({
      ...store.state,
      waiting: false,
      seed,
      power
    });
  } else if (!waiting) {
    store.dispatch({
      ...store.state,
      running: false
    });
  }

  lastTimeStamp = timeStamp;
  requestAnimationFrame(reducePower);
};
reducePower(performance.now());

document.addEventListener("DOMContentLoaded", () => {
  const scene = new Scene(document.getElementById("canvas"), store);

  const renderScene = () => {
    requestAnimationFrame(renderScene);
    scene.render();
  };
  renderScene();

  window.addEventListener(
    "resize",
    () => {
      scene.resize();
    },
    { passive: true }
  );

  render(
    html`
      <${UI} store=${store} />
    `,
    document.getElementById("ui")
  );
});
