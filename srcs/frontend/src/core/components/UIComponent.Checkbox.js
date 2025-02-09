import UIComponent from "./UIComponent";

export class CheckboxComponent extends UIComponent {
  constructor( id, props = {} ) {
    super( id, props.styles, props.class, props.object );
    this.checked = props.checked || false;
    this.styles = props.styles || {};
    this.class = props.class || '';

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

    const checkboxElement = document.createElement( "input" );

    this.element = checkboxElement;

    checkboxElement.id = this.id;
    checkboxElement.type = "checkbox";
    checkboxElement.checked = this.checked;

    this.applyStyles( checkboxElement );
    this.applyClasses(checkboxElement);
    this.applyAttributes(checkboxElement);

    if ( this.transitionIn ) {
      this.transitionIn( checkboxElement );
    }
    this.addEventListeners( checkboxElement, this.expectedListeners() );
    return checkboxElement;
  }

  update(newProps) {
    super.update(newProps);
    if (newProps) {
      if (newProps.checked !== undefined) {
        this.checked = newProps.checked;
        if (this.element)
          this.element.checked = this.checked;
      }
    }
  }
}
