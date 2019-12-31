import {
  html,
  render
} from "https://unpkg.com/htm@2/preact/standalone.module.js";
import { Store } from "./store.js";
import { Scene } from "./scene.js";
import { UI } from "./ui.js";

const store = new Store({
  waiting: false,
  power: 0
});

document.addEventListener("DOMContentLoaded", () => {
  const scene = new Scene(document.getElementById("canvas"), store);

  const renderScene = () => {
    requestAnimationFrame(renderScene);
    scene.render();
  };
  renderScene();

  window.addEventListener("resize", () => {
    scene.resize();
  });

  render(
    html`
      <${UI} store=${store} />
    `,
    document.getElementById("ui")
  );
});
