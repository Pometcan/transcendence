import SceneManager from "../managers/SceneManager.js";
import Ball from "./ball.js";
import Paddle from "./paddle.js";
import InputManager from "../managers/InputManager.js";
import confetti from 'https://cdn.skypack.dev/canvas-confetti';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.136.0/build/three.module.js';

class Game3D {
  constructor(inputConfig = {}) {
    this.sceneManager = new SceneManager();
    this.inputManager = new InputManager(
      inputConfig.inputMode,
      inputConfig.websocketURL,
      inputConfig.playerRole,
      this.setBallPosition.bind(this), // onBallUpdate callback'ini InputManager'a geçir
      this.setPaddle1Position.bind(this), // Paddle 1 pozisyon güncelleme callback'i
      this.setPaddle2Position.bind(this)  // Paddle 2 pozisyon güncelleme callback'i
    );
    this.setBallPosition = this.setBallPosition.bind(this);
    this.setPaddle1Position = this.setPaddle1Position.bind(this);
    this.setPaddle2Position = this.setPaddle2Position.bind(this);

    this.gameType = inputConfig.inputMode;
    this.playerRole = inputConfig.playerRole;
    this.ball = new Ball();
    this.paddle1 = new Paddle(0x00ff00, -Math.PI / 2); // Yeşil ve 90° döndürülmüş
    this.paddle2 = new Paddle(0xff0000, Math.PI / 2); // Mavi ve -90° döndürülmüş

    this.bounds = {
      xMin: -10,  // Sol duvar
      xMax: 10,   // Sag duvar
      yMin: -4,  // Alt duvar
      yMax: 4,   // Üst duvar
    };

    this.ball.mesh.position.set(0, 0, 0);
    this.paddle1.mesh.position.set(-10, 0, 0);
    this.paddle2.mesh.position.set(10, 0, 0);

    this.cameraDefualtPosition = {
      top: { x: 0, y: 0, z: 10 },
      p1: { x: -10, y: 0, z: 10 },
      p2: { x: 10, y: 0, z: 10 },
    };

    this.cameraDefualtLookAt = {
      top: { x: 0, y: Math.PI / 3, z: 0 },
      p1: { x: 0, y: 0, z: Math.PI / 2 },
      p2: { x: Math.PI / 2, y: 0, z: 0 },
    };

    this.sceneManager.camera.position.set(this.cameraDefualtPosition.top.x, this.cameraDefualtPosition.top.y, this.cameraDefualtPosition.top.z);
    this.sceneManager.camera.lookAt(
      new THREE.Vector3(
        this.cameraDefualtLookAt.top.x,
        this.cameraDefualtLookAt.top.y,
        this.cameraDefualtLookAt.top.z
      )
    );
    if (this.playerRole === "p1") {
      this.changeCameraPosition(this.cameraDefualtPosition.p1);
      this.changeCameraLookAt(this.cameraDefualtLookAt.p1);
    } else if (this.playerRole === "p2") {
      this.changeCameraPosition(this.cameraDefualtPosition.p2);
      this.changeCameraLookAt(this.cameraDefualtLookAt.p2);
    } else {
      this.changeCameraPosition(this.cameraDefualtPosition.top);
      this.changeCameraLookAt(this.cameraDefualtLookAt.top);
    }

    this.cameraPosition = 1;
    this.score = { p1: 0, p2: 0 };
    this.onScoreChange = (score) => { };
    this.onGameEnd = (winner) => { };
    this.gameState = "stopped";
    this.gameEnded = false;

    this.sceneManager.drawRectangleBorder(this.bounds);

    this.sceneManager.add(this.ball.mesh);
    this.sceneManager.add(this.paddle1.mesh);
    this.sceneManager.add(this.paddle2.mesh);

    this.animate();
  }

  backendXtoFrontendX(backendX) {
    // Backend X (0-100) -> Frontend X (-10 - 10)
    return (backendX / 100) * 20 - 10;
  }

  backendYtoFrontendY(backendY) {
    // Backend Y (0-100) -> Frontend Y (-4 - 4)
    return (backendY / 100) * 8 - 4;
  }


  changeCameraPosition(c) {
    this.sceneManager.camera.position.set(c.x, c.y, c.z);
  }

  changeCameraLookAt(c) {
    this.sceneManager.camera.lookAt(c.x, c.y, c.z);
  }

  gameStart() {
    this.gameState = "started";
    this.score = { p1: 0, p2: 0 };
    this.onScoreChange(this.score);
  }

  gameStop() {
    this.gameState = "stopped";
  }

  gameRestart() {
    this.gameState = "started";
    this.score = { p1: 0, p2: 0 };
    this.onScoreChange(this.score);
  }

  gameEnd() {
    this.gameState = "ended";
    this.gameEnded = true;
  }

  gameDestroy() {
    console.log("Oyun tamamen siliniyor...");

    this.gameState = "destroyed";
    this.gameEnded = true;

    // 🚀 1. `requestAnimationFrame()` döngüsünü durdur
    cancelAnimationFrame(this.animationFrameId);

    // 🚀 2. Sahnedeki tüm nesneleri temizle
    while (this.sceneManager.scene.children.length > 0) {
      let child = this.sceneManager.scene.children[0];
      this.sceneManager.scene.remove(child);

      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
      if (child.texture) child.texture.dispose();
    }

    // 🚀 3. SceneManager'ı yok et
    this.sceneManager.destroy();

    // 🚀 4. Three.js'in HTML `<canvas>` elementini kaldır
    if (this.sceneManager.renderer && this.sceneManager.renderer.domElement) {
      this.sceneManager.renderer.domElement.remove();
    }

    // 🚀 5. Tüm değişkenleri temizle
    this.sceneManager = null;
    this.inputManager = null;
    this.ball = null;
    this.paddle1 = null;
    this.paddle2 = null;

    console.log("Oyun başarıyla silindi.");


  }

  setBallPosition(x, y) {
    this.ball.mesh.position.x = this.backendXtoFrontendX(x);
    this.ball.mesh.position.y = this.backendYtoFrontendY(y);
  }

  setPaddle1Position(y) {
    this.paddle1.mesh.position.y = this.backendYtoFrontendY(y);
  }

  setPaddle2Position(y) {
    this.paddle2.mesh.position.y = this.backendYtoFrontendY(y);
  }

  update() {
    if (this.gameEnded) return;

    console.log("Game3D.update() çalıştı. gameType:", this.gameType, "playerRole:", this.playerRole); // Debug logu: update fonksiyonu başlangıcı

    if (this.gameType == "local") {
      this.ball.update(this.paddle1, this.paddle2, this);

      // **P1 ise paddle1, P2 ise paddle2 kontrol eder**
      if (this.inputManager.keys.p1["w"]) this.paddle1.move(1);
      if (this.inputManager.keys.p1["s"]) this.paddle1.move(-1);
      if (this.inputManager.keys.p2["ArrowUp"]) this.paddle2.move(1);
      if (this.inputManager.keys.p2["ArrowDown"]) this.paddle2.move(-1);
      if (this.inputManager.keys.camera.c_pressed) { // c tuşu basıldıysa ve henüz işlenmediyse
        console.log("Kamera değiştiriliyor...");
        this.cameraPosition++;
        if (this.cameraPosition > 3) this.cameraPosition = 1;

        switch (this.cameraPosition) { // switch ifadesi ile daha okunabilir kamera pozisyonu ayarlama
          case 1:
            this.changeCameraPosition(this.cameraDefualtPosition.p1);
            this.changeCameraLookAt(this.cameraDefualtLookAt.p1);
            break;
          case 2:
            this.changeCameraPosition(this.cameraDefualtPosition.p2);
            this.changeCameraLookAt(this.cameraDefualtLookAt.p2);
            break;
          case 3:
            this.changeCameraPosition(this.cameraDefualtPosition.top);
            this.changeCameraLookAt(this.cameraDefualtLookAt.top);
            break;
        }
        this.inputManager.keys.camera.c_pressed = false; // c_pressed'i sıfırla, böylece tuşa basılı tutulsa bile sadece bir kere çalışır
      }
      //change camera position

    } else if (this.gameType == "network") {
      console.log("Game3D.update() - NETWORK MODU. playerRole:", this.playerRole); // Debug logu: network modu

      // Network oyununda toplu hareket backend'den gelecek, inputManager zaten handle ediyor
      // Sadece kendi raketimizi kontrol edebiliriz (eğer oyuncu rolümüz varsa)
      console.log("inputManager.keys:", this.inputManager.keys); // Debug logu: inputManager.keys değerleri

      if (this.playerRole === "p1") {
        if (this.inputManager.keys.p1["w"]) {
          console.log("P1 yukarı hareket öncesi paddle1.mesh.position.y:", this.paddle1.mesh.position.y); // Debug logu: hareket öncesi pozisyon
          this.paddle1.move(1);
          console.log("P1 yukarı hareket sonrası paddle1.mesh.position.y:", this.paddle1.mesh.position.y); // Debug logu: hareket sonrası pozisyon
        }
        if (this.inputManager.keys.p1["s"]) {
          console.log("P1 aşağı hareket öncesi paddle1.mesh.position.y:", this.paddle1.mesh.position.y); // Debug logu: hareket öncesi pozisyon
          this.paddle1.move(-1);
          console.log("P1 aşağı hareket sonrası paddle1.mesh.position.y:", this.paddle1.mesh.position.y); // Debug logu: hareket sonrası pozisyon
        }
      } else if (this.playerRole === "p2") {
        if (this.inputManager.keys.p2["ArrowUp"]) {
          console.log("P2 yukarı hareket öncesi paddle2.mesh.position.y:", this.paddle2.mesh.position.y); // Debug logu: hareket öncesi pozisyon
          this.paddle2.move(1);
          console.log("P2 yukarı hareket sonrası paddle2.mesh.position.y:", this.paddle2.mesh.position.y); // Debug logu: hareket sonrası pozisyon
        }
        if (this.inputManager.keys.p2["ArrowDown"]) {
          console.log("P2 aşağı hareket öncesi paddle2.mesh.position.y:", this.paddle2.mesh.position.y); // Debug logu: hareket öncesi pozisyon
          this.paddle2.move(-1);
          console.log("P2 aşağı hareket sonrası paddle2.mesh.position.y:", this.paddle2.mesh.position.y); // Debug logu: hareket sonrası pozisyon
        }
      }
      if (this.inputManager.keys.camera.c_pressed) {
        // ... kamera değiştirme kodu ...
        this.inputManager.keys.camera.c_pressed = false; // c_pressed'i sıfırla
      }
    }

  }

  scorePoint(player) {
    if (this.gameEnded) return;

    this.score[player]++;
    let winner = null;

    this.onScoreChange(this.score);
    if (this.score.p1 >= 5) {
      winner = "p1";
      this.gameEnded = true;
      this.onGameEnd(winner);
    } else if (this.score.p2 >= 5) {
      winner = "p2";
      this.gameEnded = true;
      this.onGameEnd(winner);
    }

    return this.score;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.update();
    this.sceneManager.render();
  }

  onGameEnd(winner) {
    confetti();
    this.gameDestroy();
  }
}

export default Game3D;
