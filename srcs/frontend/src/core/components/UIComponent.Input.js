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
    this.applyAttributes(inputElement);


    if (this.transitionIn) {
      this.transitionIn(inputElement);
    }

    this.addEventListeners(inputElement, this.expectedListeners);

    return inputElement;
  }

  onInput = (event) => {
    this.value = event.target.value;
  };

  update(newProps) {
    super.update(newProps);
    if (newProps) {
      if (newProps.value !== undefined) {
        this.value = newProps.value;
        if (this.element)
          this.element.innerText = this.text;
      }
      if (newProps.class !== undefined) {
        this.class = newProps.class;
        if (this.element)
          this.element.className = this.class;
      }
      if (newProps.styles !== undefined) {
        this.styles = newProps.styles;
        if (this.element)
          this.applyStyles(this.element);
      }
    }
  }
}
