import {
  Component,
  html
} from "https://unpkg.com/htm@2/preact/standalone.module.js";
import { getModelName } from "./store.js";

const isARQuickLookAvailable = document
  .createElement("a")
  .relList.supports("ar");
const isAndroid = /android/i.test(navigator.userAgent);

const ARLink = props => html`
  <a ...${props} class="ar-link"><img src=""/></a>
`;

export class UI extends Component {
  constructor({ store }) {
    super();
    store.subscribe(state => this.setState(state));
  }

  dispatch(state) {
    this.props.store.dispatch(state);
  }

  render() {
    const { showTitle, waiting, running } = this.state;
    const showTutorial = !showTitle && !running;

    const modelName = getModelName(this.state);
    let quickLookButton = null;
    if (isARQuickLookAvailable) {
      const attrs = {
        href: `./models/${modelName}.usdz`,
        rel: "ar"
      };
      quickLookButton = html`
        <${ARLink} ...${attrs} />
      `;
    }
    if (isAndroid) {
      attrs = {
        href: `intent://${modelName}.glb#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://one-night-game-jam.github.io/omikuji-kun;end;`
      };
      quickLookButton = html`
        <${ARLink} ...${attrs} />
      `;
    }

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
        ${!showTitle && !waiting && !running && quickLookButton}
      </div>
    `;
  }
}
