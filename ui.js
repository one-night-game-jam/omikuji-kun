import {
  Component,
  html
} from "https://unpkg.com/htm@2/preact/standalone.module.js";

const requestDeviceMotionPermission = async () => {
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    await DeviceOrientationEvent.requestPermission();
  }
};

export class UI extends Component {
  constructor({ store }) {
    super();
    store.subscribe(state => this.setState(state));
  }

  dispatch(state) {
    this.props.store.dispatch(state);
  }

  render() {
    const { showTitle, waiting, finished } = this.state;
    const showTutorial = !showTitle && (!waiting || !finished);
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

  start() {
    return;
    this.dispatch({
      ...this.state,
      showTitle: false
    });
  }

  shake() {
    return;
    this.dispatch({
      ...this.state,
      waiting: false,
      finished: false,
      power: 50 + 50 * Math.random()
    });
  }
}
