import UIComponent from "./UIComponent";

export class ButtonComponent extends UIComponent {
  constructor( id, props = {} ) {
    super( id, props.styles, props.class);
    this.label = props.label;
    this.styles = props.styles;
    this.hoverStyles = props.hoverStyles || {};
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

    if ( this.transitionIn ) {
      this.transitionIn( buttonElement );
    }

    this.addEventListeners( buttonElement, this.expectedListeners() );

    return buttonElement;
  }

}
