class UIComponent {
  /**
   *
   * @param {string} id
   * @param {CSSRuleList} styles
   * @param {string} _class
   */
  constructor( id, styles = {}, object, _class ) {
    this.id = id;

    this.styles = styles;
    this._object = object;
    this.class = _class || '';
    this.active = false;
    this.element = null;

    this.expectedListeners = () => ({});
  }

  get object() {
    this.render();
    return this._object;
  }

  set object( value ) {
    this._object = value;
  }

  applyStyles( element ) {
    if ( this.styles ) {
      for ( const [key, value] of Object.entries( this.styles ) ) {
        element.style[key] = value;
      }
    }
  }

  applyClasses( element ) {
      if ( this.class ) {
        const classNames = this.class.split(' ');
        classNames.forEach(className => {
          if (className.trim() !== '') {
            element.classList.add(className.trim());
          }
        });
      }
    }

  applyAttributes( element ) {
    if ( this.object ) {
      for ( const [key, value] of Object.entries( this.object ) ) {
        element[key] = value;
      }
    }
  }

  removeEventListener( event ) {
    if ( this.element && this[event] ) {
      this.element.removeEventListener( event, this[event] );
    }
    this[event] = null;
  }

  addEventListener( event, handler ) {
    if ( this.element && this[event] ) {
      this.element.removeEventListener( event, this[event] );
    }
    this[event] = handler;
  }

  addEventListeners( element, expectedListeners ) {
    for ( const [event, handler] of Object.entries( expectedListeners ) ) {
      if ( handler ) {
        element.addEventListener( event, handler );
      }
    }
  }

  render() {
    if ( this.element ) {
      return this.element;
    }

    this.element = this.createElement();

    if (this.object)
      this.object.element = this.element;

    const createdElement = this.element

    this.applyStyles( createdElement );
    this.applyClasses(createdElement);

    if ( this.transitionIn ) {
      this.transitionIn( createdElement );
    }

    this.addEventListeners( createdElement, this.expectedListeners() ); // **Satır 114 - Hata burada**

    return createdElement;
  }

  createElement() {
    const createdElement = document.createElement( "div" );
    createdElement.id = this.id;
    return createdElement;
  }
}

export default UIComponent;
