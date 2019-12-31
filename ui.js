import {
  Component,
  html
} from "https://unpkg.com/htm@2/preact/standalone.module.js";

const isARQuickLookAvailable = document
  .createElement("a")
  .relList.supports("ar");
const isAndroid = /android/i.test(navigator.userAgent);

export class UI extends Component {
  constructor({ store }) {
    super();
    store.subscribe(state => this.setState(state));
  }

  dispatch(state) {
    this.props.store.dispatch(state);
  }

  render() {
    const { showTitle, waiting, running, seed } = this.state;
    const showTutorial = !showTitle && !running;

    const i = ["A", "B", "C", "D", "E"][parseInt(seed) % 5]; // TODO: hard-coded

    return html`
      <div class="container">
        <img
          class="image ${showTitle ? "image--visible" : ""}"
          src="./images/TAP_ME_TO_START.png"
        />
        <img
          class="image ${showTutorial ? "image--visible" : ""}"
          src="./images/SHAKE_or_TAP_ME.png"
        />
        ${!showTitle &&
          !waiting &&
          !running &&
          isARQuickLookAvailable &&
          html`
            <a class="ar-link" href="./models/${i}.usdz" rel="ar">
              <img class="ar-link__image" src="./images/VIEW_in_AR.png" />
            </a>
          `}
        ${!showTitle &&
          !waiting &&
          !running &&
          isAndroid &&
          html`
            <a
              class="ar-link"
              href="intent://${i}.glb#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://one-night-game-jam.github.io/omikuji-kun;end;"
            >
              <img class="ar-link__image" src="./images/VIEW_in_AR.png" />
            </a>
          `}
      </div>
    `;
  }
}
