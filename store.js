export class Store {
  constructor(initialState) {
    this.state = initialState;
    this.handlers = [];
  }

  dispatch(state) {
    this.state = state;
    for (let handler of this.handlers) {
      handler(this.state);
    }
  }

  subscribe(handler) {
    this.handlers.push(handler);
    handler(this.state);
  }
}
