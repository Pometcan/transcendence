import UIComponent from "./UIComponent";

export class CanvasComponent extends UIComponent {
  constructor(id, props = {}) {
    super(id, props.styles, props.object, props.class);
    this.class = props.class || '';
    this.styles = props.styles || {};
    this.elements = props.elements || [];
    this.width = props.width || 300;
    this.height = props.height || 150;
    this.context = null;

    this.expectedListeners = () => ({
      click: this.onClick,
      mouseenter: this.onMouseEnter,
      mouseleave: this.onMouseLeave,
    });
  }

  render() {
    if (this.element) {
      this.context.clearRect(0, 0, this.width, this.height);
      this.elements.forEach((child) => {
        child.draw(this.context);
      });
      return this.element;
    }

    this.element = this.createCanvasElement();
    this.context = this.element.getContext('2d');

    if (this.object)
      this.object.element = this.element;

    const canvasElement = this.element;

    this.applyStyles(canvasElement);
    this.applyClasses(canvasElement);
    this.applyAttributes(canvasElement);

    this.elements.forEach((child) => {
      child.draw(this.context);
    });

    if (this.transitionIn) {
      this.transitionIn(canvasElement);
    }

    this.addEventListeners(canvasElement, this.expectedListeners());

    return canvasElement;
  }

  createCanvasElement() {
    const canvasElement = document.createElement("canvas");
    canvasElement.id = this.id;
    canvasElement.width = this.width;
    canvasElement.height = this.height;
    return canvasElement;
  }

  addStyle(style) {
    this.styles = { ...this.styles, ...style };
  }

  addElement(element) {
    this.elements.push(element);
    if (this.context) {
      element.draw(this.context);
    }
  }

  removeElement(element) {
    this.elements = this.elements?.filter((e) => e !== element);
    if (this.context) {
      this.context.clearRect(0, 0, this.width, this.height);
      this.elements.forEach((child) => {
        child.draw(this.context);
      });
    }
  }

  clearElements() {
    this.elements = [];
    if (this.context) {
      this.context.clearRect(0, 0, this.width, this.height);
    }
  }

  clearCanvas() {
    if (this.context) {
      this.context.clearRect(0, 0, this.width, this.height);
    }
  }

  update(newProps) {
    super.update(newProps);
    if (newProps) {
      if (newProps.elements) {
        this.elements = newProps.elements;
        if (this.context) {
          this.context.clearRect(0, 0, this.width, this.height);
          this.elements.forEach((child) => {
            child.draw(this.context);
          });
        }
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
      if (newProps.width !== undefined) {
        this.width = newProps.width;
        if (this.element)
          this.element.width = this.width;
      }
      if (newProps.height !== undefined) {
        this.height = newProps.height;
        if (this.element)
          this.element.height = this.height;
      }
    }
  }
}
