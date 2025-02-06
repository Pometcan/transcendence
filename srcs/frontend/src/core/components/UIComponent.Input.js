import UIComponent from "./UIComponent";

export class InputComponent extends UIComponent {
  constructor(id, props = {}) {
    super(id, props.styles, props.class);
    this.placeholder = props.placeholder || "";
    this.value = props.value || "";
    this.type = props.type || "text";

    this.expectedListeners = {
      input: this.onInput,
      focus: this.onFocus,
      blur: this.onBlur,
    };
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
    inputElement.value = this.value;

    this.applyStyles(inputElement);
    this.applyClasses(inputElement);

    if (this.transitionIn) {
      this.transitionIn(inputElement);
    }

    this.addEventListeners(inputElement, this.expectedListeners);

    return inputElement;
  }
}
