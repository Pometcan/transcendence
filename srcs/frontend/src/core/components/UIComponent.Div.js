import UIComponent from "./UIComponent";

export class DivComponent extends UIComponent {
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
      // Mevcut element varsa, çocukları yeniden render etmeden önce temizle
      this.clearDOMChildren(); // Mevcut DOM çocuklarını temizle
      this.elements.forEach( ( child ) => {
        this.element.appendChild( child.render() );
      });
      return this.element;
    }

    this.element = this.createMenuElement();

    if (this.object)
      this.object.element = this.element;

    const menuElement = this.element

    this.applyStyles( menuElement );
    this.applyClasses(menuElement);
    this.applyAttributes(menuElement);

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
    const menuElement = document.createElement( "div" );
    menuElement.id = this.id;
    return menuElement;
  }

  addStyle( style ) {
    this.styles = { ...this.styles, ...style };
  }

  addElement( element ) {
    this.elements.push( element );
  }

  removeElement( element ) {
    this.elements = this.elements?.filter( ( e ) => e !== element );
  }

  clearElements() {
    this.elements = []; // JavaScript dizisini temizle
    this.clearDOMChildren(); // DOM çocuklarını temizle
  }

  clearDOMChildren() {
    if (this.element) {
      while (this.element.firstChild) {
        this.element.removeChild(this.element.firstChild);
      }
    }
  }

  update(newProps) {
    super.update(newProps);
    if (newProps) {
      if (newProps.elements) {
        this.elements = newProps.elements;
        if (this.element) {
          this.clearDOMChildren(); // Mevcut DOM çocuklarını temizle
          this.elements.forEach( ( child ) => {
            this.element.appendChild( child.render() );
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
    }
  }
}
