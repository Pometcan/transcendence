import * as THREE from "https://cdn.skypack.dev/three@0.136.0";

class Ball {
  constructor() {
    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.mesh = new THREE.Mesh(geometry, material);

    this.velocity = { x: 0.1, y: 0.1 };

    // Pong sahası sınırları
    this.bounds = {
      xMin: -10,  // Sol duvar
      xMax: 10,   // Sağ duvar
      yMin: -4,  // Alt duvar
      yMax: 4,   // Üst duvar
    };
  }

  update(paddle1, paddle2, game) {
    this.mesh.position.x += this.velocity.x;
    this.mesh.position.y += this.velocity.y;

    // Üst ve alt duvarlardan sekme
    if (this.mesh.position.y > this.bounds.yMax || this.mesh.position.y < this.bounds.yMin) {
      this.velocity.y *= -1;
    }

    // Paddle'lar ile çarpışma
    if (this.checkCollision(paddle1) || this.checkCollision(paddle2)) {
      this.velocity.x *= -1; // X yönünü tersine çevir
    }

    // Skor kontrolü
    if (this.mesh.position.x > this.bounds.xMax) {
      game.scorePoint("p1");
      this.reset();
    } else if (this.mesh.position.x < this.bounds.xMin) {
      game.scorePoint("p2");
      this.reset();
    }
  }

  checkCollision(paddle) {
    const ballBox = new THREE.Box3().setFromObject(this.mesh);
    const paddleBox = new THREE.Box3().setFromObject(paddle.mesh);
    return ballBox.intersectsBox(paddleBox);
  }

  reset() {
    this.mesh.position.set(0, Math.random(-2,2) , 0);
    this.velocity.x *= -1; // Yönü değiştir
  }
}

export default Ball;
