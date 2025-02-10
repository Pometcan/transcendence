import * as THREE from "https://cdn.skypack.dev/three@0.136.0";

class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    document.body.appendChild(this.renderer.domElement);

    this.camera.position.set(0, -10, 10);
    this.camera.lookAt(0, 2, 0);
    window.addEventListener("resize", () => this.onWindowResize());

    this.addLights();
  }

  changeCameraPosition(c) {
    this.camera.position.set(c.x, c.y, c.z);
    this.render();
  }

  changeCameraLookAt(c) {
    this.camera.lookAt(c.x, c.y, c.z);
    this.render();
  }

  add(object) {
    this.scene.add(object);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.renderer.domElement.remove();
    this.renderer.forceContextLoss();
    this.renderer.context = null;
    this.renderer.domElement = null;
    this.renderer = null;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  drawRectangleBorder(bounds) { // bounds argüman olarak aliniyor
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      bounds.xMin, bounds.yMin, 0, // Alt Sol
      bounds.xMax, bounds.yMin, 0, // Alt Sag
      bounds.xMax, bounds.yMax, 0, // Üst Sag
      bounds.xMin, bounds.yMax, 0, // Üst Sol
      bounds.xMin, bounds.yMin, 0  // Döngüyü kapatmak için tekrar Alt Sol
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.LineBasicMaterial({ color: 0xffffff }); // Beyaz renk veya istediginiz renk
    const rectangle = new THREE.Line(geometry, material);

    this.add(rectangle); // this.sceneManager.add yerine this.add kullaniliyor cünkü zaten SceneManager icindeyiz
  }

  addLights() {
      // 🌞 Ortam Işığı (Hafif parlaklık)
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // (Renk, Güç)
      this.scene.add(ambientLight);

      // 🔦 Yönlü Işık (Spaceship'leri vurgulamak için)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(3, 5, 2); // Işığın konumu (X, Y, Z)
      directionalLight.castShadow = true; // Gölge oluştursun
      this.scene.add(directionalLight);

      // 💡 Nokta Işığı (Daha dramatik bir etki)
      const pointLight = new THREE.PointLight(0xff5500, 1, 10);
      pointLight.position.set(0, 0, 3);
      this.scene.add(pointLight);
    }
}

export default SceneManager;
