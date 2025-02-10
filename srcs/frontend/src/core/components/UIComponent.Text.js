import UIComponent from "./UIComponent";

export class TextComponent extends UIComponent {
  constructor(id, props = {}) {
    super(id, props.styles);
    this.text = props.text;
    this.class = props.class || '';
    this.props = props;
  }

  render() {
    if (this.element) {
      return this.element;
    }

    const textElement = document.createElement("p");

    this.element = textElement;

    textElement.id = this.id;
    textElement.innerText = this.text;

    this.applyStyles(textElement);
    this.applyClasses(textElement);
    this.applyAttributes(textElement);

    if (this.transitionIn) {
      this.transitionIn(textElement);
    }

    return textElement;
  }

  update(newProps) {
    super.update(newProps);
    if (newProps) {
      if (newProps.text !== undefined) {
        this.text = newProps.text;
        if (this.element)
          this.element.innerText = this.text;
      }
    }
  }
}
