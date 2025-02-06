import UIComponent from "./UIComponent";

export class LinkComponent extends UIComponent {
  constructor( id, props = {} ) {
    super( id, props.styles, props.class);
    this.href = props.href; // Link adresi
    this.text = props.text; // Link metni (label yerine text daha uygun olabilir linkler için)
    this.target = props.target; // _blank, _self vb. (isteğe bağlı)
    this.styles = props.styles;
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

    const linkElement = document.createElement( "a" ); // "a" elementi oluştur

    this.element = linkElement;

    linkElement.id = this.id;
    linkElement.href = this.href; // href attribute'unu ayarla
    linkElement.innerText = this.text; // Link metnini ayarla

    if (this.target) { // target attribute'u varsa ayarla
      linkElement.target = this.target;
    }

    this.applyStyles( linkElement );
    this.applyClasses(linkElement);

    if ( this.transitionIn ) {
      this.transitionIn( linkElement );
    }

    this.addEventListeners( linkElement, this.expectedListeners() );

    return linkElement;
  }
}
