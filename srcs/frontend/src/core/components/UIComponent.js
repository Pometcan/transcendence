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
    this.render(); // Ensure element is rendered before accessing object
    return this._object;
  }

  set object( value ) {
    this._object = value;
    this.update(); // Automatically update the component when the object is set
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
    if ( this._object ) { // Use _object here to reflect the current state
      for ( const [key, value] of Object.entries( this._object ) ) {
        if (key !== 'element') // Prevent setting element as attribute
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

    if(this._object) // Make sure _object exists before trying to assign element
      this._object.element = this.element;

    const createdElement = this.element

    this.applyStyles( createdElement );
    this.applyClasses(createdElement);
    this.applyAttributes(createdElement); // Apply attributes during initial render

    if ( this.transitionIn ) {
      this.transitionIn( createdElement );
    }

    this.addEventListeners( createdElement, this.expectedListeners() );
    return createdElement;
  }

  createElement() {
    const createdElement = document.createElement( "div" );
    createdElement.id = this.id;
    return createdElement;
  }

  update(newObject) {
    if (newObject) {
      this._object = { ...this._object, ...newObject }; // Merge new object with existing one
    }

    if (this.element) {
      // Re-apply styles, classes, and attributes to update the existing element
      this.applyStyles( this.element );
      this.applyClasses(this.element);
      this.applyAttributes(this.element);
    } else {
      // If element doesn't exist yet (shouldn't happen if update is called after render), render it.
      this.render();
    }
  }
}

export default UIComponent;
