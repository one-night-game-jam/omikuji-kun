import {
  html,
  render
} from "https://unpkg.com/htm@2/preact/standalone.module.js";
import { Store } from "./store.js";
import { AudioPlayer } from "./audio-player.js";
import { Scene } from "./scene.js";
import { UI } from "./ui.js";

const store = new Store();

const audioPlayer = new AudioPlayer(store);

const requestPermissionButton = document.createElement("button");
requestPermissionButton.classList.add("fullscreen-button");
requestPermissionButton.addEventListener("click", () => {
  if (
    window.DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission();
  }
  audioPlayer.resumeContext();

  requestPermissionButton.parentElement.removeChild(requestPermissionButton);
});

document.body.appendChild(requestPermissionButton);

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
    waiting: false,
    running: true,
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
      waiting: false,
      seed,
      power
    });
  } else if (!waiting) {
    store.dispatch({
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
