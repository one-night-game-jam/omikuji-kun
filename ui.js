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
    return html`
      <div class="container">
        <div class="screen">
          <button
            type="button"
            onClick=${() => requestDeviceMotionPermission()}
          >
            requestDeviceMotionPermission
          </button>
          <button
            type="button"
            onClick=${() =>
              this.dispatch({
                ...this.state,
                waiting: false,
                power: 1000 * Math.random()
              })}
          >
            shake
          </button>
        </div>
        <div class="screen">
          画面をタップするかスマホを振っておみくじを引こう!!<br />
          パワー: ${this.state.power}<br />
          めくり回数: ${this.state.seed}
        </div>
      </div>
    `;
  }
}
