import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.136.0/build/three.module.js';


class Paddle {
  constructor(color = 0xff0000, rotation = 0) {
    this.mesh = new THREE.Group();

    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: color, metalness: 0.8, roughness: 0.3 });
    this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    this.mesh.add(this.body);

    const coneGeometry = new THREE.ConeGeometry(0.3, 0.5, 16);
    this.cone = new THREE.Mesh(coneGeometry, bodyMaterial);
    this.cone.position.y = 1.25;
    this.mesh.add(this.cone);

    const shieldGeometry = new THREE.CylinderGeometry(1, 0.1, 1,6);
    const shieldMaterial = new THREE.MeshStandardMaterial({
      color: 0x33aaff,
      metalness: 0.8,
      roughness: 0.3,
      emissive: 0x33aaff,
      emissiveIntensity: 0.5,
    });
    this.shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
    this.shield.position.y = 2.5;
    this.mesh.add(this.shield);

    const wingGeometry = new THREE.BoxGeometry(1, 0.8, 0.2);
    wingGeometry.translate(0, -0.3, 0);
    const wingMaterial = new THREE.MeshStandardMaterial({ color: color, metalness: 0.6, roughness: 0.2 });

    this.leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    this.leftWing.position.set(-0.35, 0, 0);
    this.mesh.add(this.leftWing);

    this.rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    this.rightWing.position.set(0.35, 0, 0);
    this.mesh.add(this.rightWing);

    this.mesh.rotation.z = rotation;

    this.bounds = { yMin: -3.5, yMax: 3.5 };
  }

  move(direction) {
    this.mesh.position.y += direction * 0.2;
    this.mesh.position.y = Math.max(this.bounds.yMin, Math.min(this.bounds.yMax, this.mesh.position.y));
  }

  update(position) {
    this.mesh.position.y = position
  }
}

export default Paddle;
