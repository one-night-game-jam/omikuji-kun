import {
  Component,
  html
} from "https://unpkg.com/htm@2/preact/standalone.module.js";

export class UI extends Component {
  constructor({ store }) {
    super();
    store.subscribe(state => this.setState(state));
  }

  dispatch(state) {
    this.props.store.dispatch(state);
  }

  render() {
    const { showTitle, running } = this.state;
    const showTutorial = !showTitle && !running;
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
      </div>
    `;
  }
}
