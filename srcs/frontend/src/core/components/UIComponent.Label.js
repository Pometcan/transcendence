import UIComponent from "./UIComponent";

export class LabelComponent extends UIComponent {
  constructor(id, props = {}) {
    super(id, props.styles, props.class, props.object);
    this.text = props.text || '';
    this.object = props.object || {};
    this.class = props.class || '';
  }

  render() {
    if (this.element) {
      return this.element;
    }

    const textElement = document.createElement("label");

    this.element = textElement;

    textElement.id = this.id;
    textElement.innerText = this.text;
    if (this.object)
      if (this.object.for)
        textElement.htmlFor = this.object.for;

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
