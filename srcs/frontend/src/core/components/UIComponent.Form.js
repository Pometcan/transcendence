import UIComponent from "./UIComponent";

export class FormComponent extends UIComponent {
  constructor(id, props = {}) {
    super(id, props.styles, props.object, props.class);
    this.class = props.class || '';
    this.styles = props.styles || {};
    this.elements = props.elements || [];

    this.expectedListeners = () => ({
      click: this.onClick,
      mouseenter: this.onMouseEnter,
      mouseleave: this.onMouseLeave,
    });
  }

  render() {
    if ( this.element ) {
      return this.element;
    }

    this.element = this.createMenuElement();

    if (this.object)
      this.object.element = this.element;

    const menuElement = this.element

    this.applyStyles( menuElement );
    this.applyClasses(menuElement);

    this.elements.forEach( ( child ) => {
      menuElement.appendChild( child.render() );
    } );

    if ( this.transitionIn ) {
      this.transitionIn( menuElement );
    }

    this.addEventListeners( menuElement, this.expectedListeners() );

    return menuElement;
  }

  createMenuElement() {
    const menuElement = document.createElement( "form" );
    menuElement.id = this.id;
    return menuElement;
  }

  addElement( element ) {
    this.elements.push( element );
  }

  removeElement( element ) {
    this.elements = this.elements?.filter( ( e ) => e !== element );
  }
}
