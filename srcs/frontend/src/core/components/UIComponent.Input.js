import UIComponent from "./UIComponent";

export class InputComponent extends UIComponent {
  constructor(id, props = {}) {
    super(id, props.styles, props.class);
    this.placeholder = props.placeholder || "";
    this._value = props.value || "";
    this.type = props.type || "text";
    this.styles = props.styles || {};
    this.class = props.class || "";

    this.expectedListeners = {
      input: this.onInput,
      focus: this.onFocus,
      blur: this.onBlur,
    };
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
    if (this.element) {
      this.element.value = newValue;
    }
  }

  render() {
    if (this.element) {
      return this.element;
    }

    const inputElement = document.createElement("input");

    this.element = inputElement;

    inputElement.id = this.id;
    inputElement.type = this.type;
    inputElement.placeholder = this.placeholder;
    inputElement.value = this._value;

    this.applyStyles(inputElement);
    this.applyClasses(inputElement);

    if (this.transitionIn) {
      this.transitionIn(inputElement);
    }

    this.addEventListeners(inputElement, this.expectedListeners); // Doğru kullanım: obje direkt olarak geçiriliyor

    return inputElement;
  }

  onInput = (event) => {
    this.value = event.target.value;
  };
}
