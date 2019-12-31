export class Store {
  constructor() {
    this.state = {
      showTitle: true,
      waiting: true,
      running: false,
      seed: 0,
      power: 0
    };
    this.handlers = [];
  }

  dispatch(newState) {
    const state = {
      ...this.state,
      ...newState
    };
    for (let handler of this.handlers) {
      handler(state, this.state);
    }
    this.state = state;
  }

  subscribe(handler) {
    this.handlers.push(handler);
    handler(this.state, this.state);
  }
}

export const MODEL_NAMES = ["A", "B", "C", "D", "E"];
export const getModelIndex = state => parseInt(state.seed) % MODEL_NAMES.length;
export const getModelName = state => MODEL_NAMES[getModelIndex(state)];
