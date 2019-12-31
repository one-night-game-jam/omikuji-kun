import {
  html,
  render
} from "https://unpkg.com/htm@2/preact/standalone.module.js";
import { Store } from "./store.js";
import { Scene } from "./scene.js";
import { UI } from "./ui.js";

const store = new Store({
  waiting: true,
  seed: 0,
  power: 0
});

addEventListener("devicemotion", e => {
  const { x, y, z } = e.acceleration;
  const v = Math.sqrt(x * x + y * y + z * z) / e.interval;
  if (v < 1000) return;

  store.dispatch({
    ...store.state,
    power: store.state.power + v / 10
  });
});

let lastTimeStamp = performance.now();
const reducePower = timeStamp => {
  const delta = (timeStamp - lastTimeStamp) / 1000;

  let { power, seed } = store.state;
  power -= power * 0.9 * delta;
  seed += store.state.power - power;

  if (power > 5000) {
    store.dispatch({
      ...store.state,
      seed,
      power
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
