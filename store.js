export class Store {
  constructor(initialState) {
    this.state = initialState;
    this.handlers = [];
  }

  dispatch(state) {
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
