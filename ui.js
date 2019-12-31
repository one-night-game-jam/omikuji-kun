import {
  Component,
  html
} from "https://unpkg.com/htm@2/preact/standalone.module.js";

const requestDeviceMotionPermission = async () => {
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    const response = await DeviceOrientationEvent.requestPermission();
    return response === "granted";
  }
};

export class UI extends Component {
  constructor({ store }) {
    super();

    this.dispatch = state => store.dispatch(state);
    store.subscribe(state => this.setState(state));
  }

  componentDidMount() {
    addEventListener("devicemotion", e => {
      const { x, y, z } = e.acceleration;
      const v = Math.sqrt(x * x + y * y + z * z) / e.interval;
      if (v < 1000) return;

      this.dispatch({
        power: this.state.power + v
      });
    });

    const reducePower = () => {
      let power = parseInt(this.state.power * 0.5);
      if (power < 1) {
        power = 0;
      }
      this.dispatch({ ...this.state, power });
      setTimeout(reducePower, 100);
    };
    reducePower();
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
            onClick=${() => this.dispatch({ ...this.state, power: 2000 })}
          >
            shake
          </button>
        </div>
        <div class="screen">
          画面をタップするかスマホを振っておみくじを引こう!!<br />
          パワー: ${this.state.power}
        </div>
      </div>
    `;
  }
}
