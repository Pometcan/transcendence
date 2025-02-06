export class ComponentManager {
  constructor( componentType ) {
    this.components = new Map();
    this.componentType = componentType;
  }

  addComponent( entityId, component ) {
    if ( this.componentType !== component.type ) {
      throw new Error( `Component type mismatch. Expected ${this.componentType}, got ${component.type}` );
    }
    this.components.set( entityId, component );
  }

  getComponent( entityId ) {
    return this.components.get( entityId );
  }

  removeComponent( entityId ) {
    this.components.delete( entityId );
  }

  get entries() {
    return this.components.entries();
  }

  get size() {
    return this.components.size;
  }

  clear() {
    this.components.clear();
  }

  forEach( callback ) {
    this.components.forEach( callback );
  }
}
