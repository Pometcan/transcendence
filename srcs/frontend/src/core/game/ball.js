//ball.js
import * as THREE from "https://cdn.skypack.dev/three@0.136.0";

class Ball {
  constructor(gameType) {
    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.3
    });
    this.gameType = gameType;
    this.mesh = new THREE.Mesh(geometry, material);
    this.velocity = { x: 0.1, y: 0.1 };
    this.bounds = {
      xMin: -10,
      xMax: 10,
      yMin: -4,
      yMax: 4,
    };
  }

  update(paddle1, paddle2, paddle3, paddle4, game) { // Paddle 3 ve 4 eklendi
    this.mesh.position.x += this.velocity.x;
    this.mesh.position.y += this.velocity.y;

    // Üst ve alt duvarlardan sekme
    if (this.mesh.position.y > this.bounds.yMax || this.mesh.position.y < this.bounds.yMin) {
      this.velocity.y *= -1;
    }

    // Paddle'lar ile çarpışma
    if (this.checkCollision(paddle1) || this.checkCollision(paddle2)) {
      if (this.gameType === "local-4p" )
      {
        if (this.checkCollision(paddle3) || this.checkCollision(paddle4))
          this.velocity.x *= -1;
      }
      this.velocity.x *= -1;
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
