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

    if (newProps)
    {
      if (newProps.value !== undefined)
        this.value = newProps.value;
      if (newProps.placeholder !== undefined) {
        this.placeholder = newProps.placeholder;
        if (this.element)
          this.element.placeholder = this.placeholder;
      }
      if (newProps.type !== undefined)
      {
        this.type = newProps.type;
        if (this.element)
          this.element.type = this.type;
      }
    }
  }
}
