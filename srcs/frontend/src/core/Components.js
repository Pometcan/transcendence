export default class Component {
  constructor() {
    this.type = this.constructor.name;
  }
}

export class PositionComponent extends Component {
  constructor( x, y ) {
    super();
    this.x = x;
    this.y = y;
  }
}

export class VelocityComponent extends Component {
  constructor( vx, vy ) {
    super();
    this.vx = vx;
    this.vy = vy;
  }
}

export class BoundaryComponent extends Component {
  constructor( top, bottom, left, right ) {
    super();
    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;
  }
}

export class AssetComponent extends Component {
  constructor( key ) {
    super();
    this.key = key;
  }
}
