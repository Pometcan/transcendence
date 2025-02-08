import UIComponent from "./UIComponent";

export class ButtonComponent extends UIComponent {
  constructor( id, props = {} ) {
    super( id, props.styles, props.class);
    this.label = props.label;
    this.styles = props.styles;
    this.class = props.class || '';

    this.expectedListeners = () => ({
      click: this.onClick,
      mouseenter: this.onMouseEnter,
      mouseleave: this.onMouseLeave,
      hover: this.onHover,
    });
  }

  render() {
    if ( this.element ) {
      return this.element;
    }

    const buttonElement = document.createElement( "button" );

    this.element = buttonElement;

    buttonElement.id = this.id;
    buttonElement.innerText = this.label;

    this.applyStyles( buttonElement );
    this.applyClasses(buttonElement);
    this.applyAttributes(buttonElement);

    if ( this.transitionIn ) {
      this.transitionIn( buttonElement );
    }
    this.addEventListeners( buttonElement, this.expectedListeners() );
    return buttonElement;
  }

  update(newProps) {
    super.update(newProps);
    if (newProps) {
      if (newProps.label !== undefined) {
        this.label = newProps.label;
        if (this.element)
          this.element.innerText = this.label;
      }
    }
  }
}
