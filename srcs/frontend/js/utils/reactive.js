// js/utils/reactive.js
export class ReactiveState {
  constructor(initialValue) {
    this._value = initialValue;
    this._subscribers = new Set();
    this._dependentComponents = new Set();
  }

  get value() {
    // Track dependency when value is accessed
    this._trackDependency();
    return this._value;
  }

  set value(newValue) {
    // Only update and notify if value has changed
    if (this._value !== newValue) {
      this._value = newValue;
      this._notifySubscribers();
    }
  }

  _trackDependency() {
    const currentComponent = store.getCurrentComponent();
    if (currentComponent) {
      this._dependentComponents.add(currentComponent);
    }
  }

  _notifySubscribers() {
    // Notify subscribers (if any)
    this._subscribers.forEach((subscriber) => subscriber(this._value));

    // Re-render dependent components
    this._dependentComponents.forEach((component) => {
      try {
        component.render();
      } catch (error) {
        console.error("Error re-rendering component:", error);
      }
    });
  }

  subscribe(callback) {
    this._subscribers.add(callback);

    // Return an unsubscribe function
    return () => {
      this._subscribers.delete(callback);
    };
  }
}

export function createStore() {
  let currentComponent = null;

  return {
    // Create a reactive state with initial value
    $state(initialValue) {
      return new ReactiveState(initialValue);
    },

    // Set the current component being rendered
    setCurrentComponent(component) {
      currentComponent = component;
    },

    // Get the current component
    getCurrentComponent() {
      return currentComponent;
    },
  };
}

// Global store instance
export const store = createStore();
