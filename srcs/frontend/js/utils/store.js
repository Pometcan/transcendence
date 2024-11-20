export class Store {
  constructor(initialState) {
    this.state = initialState;
    this.subscribers = [];
  }

  set(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach((callback) => callback(this.state));
  }
}
