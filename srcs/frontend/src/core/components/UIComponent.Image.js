import UIComponent from "./UIComponent";

export class ImageComponent extends UIComponent {
  constructor( id, props = {} ) {
    super( id, props.styles, props.class);
    this.src = props.src;
    this.alt = props.alt;
    this.styles = props.styles;
    this.class = props.class || '';
  }

  render() {
    if ( this.element ) {
      return this.element;
    }

    const imageElement = document.createElement( "img" );

    this.element = imageElement;

    imageElement.id = this.id;
    imageElement.src = this.src;
    imageElement.alt = this.alt;

    this.applyStyles( imageElement );
    this.applyClasses(imageElement);
    this.applyAttributes(imageElement);

    if ( this.transitionIn ) {
      this.transitionIn( imageElement );
    }

    return imageElement;
  }

  update(newProps) {
    super.update(newProps);
    if (newProps) {
      if (newProps.src !== undefined) {
        this.src = newProps.src;
        if (this.element)
          this.element.src = this.src;
      }
      if (newProps.alt !== undefined) {
        this.alt = newProps.alt;
        if (this.element)
          this.element.alt = this.alt;
      }
    }
  }
}

export default ImageComponent;
