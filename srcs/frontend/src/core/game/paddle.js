import * as THREE from "https://cdn.skypack.dev/three@0.136.0";

class Paddle {
  constructor(xPosition) {
    const geometry = new THREE.BoxGeometry(0.2, 1.5, 0.2);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.x = xPosition;

    // Paddle için sınırlar
    this.bounds = {
      yMin: -3.5, // En aşağı
      yMax: 3.5,  // En yukarı
    };
  }

  move(direction) {
    this.mesh.position.y += direction * 0.2;

    // Sınırları geçmesini engelle
    if (this.mesh.position.y > this.bounds.yMax) {
      this.mesh.position.y = this.bounds.yMax;
    }
    if (this.mesh.position.y < this.bounds.yMin) {
      this.mesh.position.y = this.bounds.yMin;
    }
  }
}

export default Paddle;
