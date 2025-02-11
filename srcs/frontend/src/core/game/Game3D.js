//game3D.js
import SceneManager from "../managers/SceneManager.js";
import Ball from "./ball.js";
import Paddle from "./paddle.js";
import InputManager from "../managers/InputManager.js";
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.136.0/build/three.module.js';

const GameState = {
  IDLE: "idle",        // Initial state, waiting to start
  RUNNING: "running",   // Game in progress
  PAUSED: "paused",     // Game is paused
  ENDED: "ended",       // Game has ended (win/loss)
  DESTROYED: "destroyed", // Game is destroyed
};

class Game3D {
  constructor(inputConfig = {}) {
    this.sceneManager = new SceneManager();
    this.inputManager = new InputManager(
      inputConfig.inputMode,
      inputConfig.websocketURL,
      inputConfig.playerRole,
      this.setBallPosition.bind(this),
      this.setPaddle1Position.bind(this),
      this.setPaddle2Position.bind(this),
      this.setPaddle3Position.bind(this), // Paddle 3 için setPaddle3Position eklendi
      this.setPaddle4Position.bind(this) // Paddle 4 için setPaddle4Position eklendi
    );
    this.setPaddle1Position = this.setPaddle1Position.bind(this);
    this.setPaddle2Position = this.setPaddle2Position.bind(this);
    this.setPaddle3Position = this.setPaddle3Position.bind(this); // Paddle 3 için setPaddle3Position eklendi
    this.setPaddle4Position = this.setPaddle4Position.bind(this); // Paddle 4 için setPaddle4Position eklendi

    this.gameType = inputConfig.inputMode;
    this.playerRole = inputConfig.playerRole;
    this.ball = new Ball(this.gameType );
    if (this.gameType === "local-4p") {
      this.paddle1 = new Paddle(0x00ff00, -Math.PI / 2); // Sol üst
      this.paddle2 = new Paddle(0xff0000, -Math.PI / 2); // Sol alt
      this.paddle3 = new Paddle(0x0000ff, Math.PI / 2); // Sağ üst
      this.paddle4 = new Paddle(0xffff00, Math.PI / 2); // Sağ alt
    }
    else {
      this.paddle1 = new Paddle(0x0000ff, -Math.PI / 2); // Sol
      this.paddle2 = new Paddle(0xff0000, Math.PI / 2); // Sağ
    }

    this.bounds = {
      xMin: -10,  // Sol duvar
      xMax: 10,   // Sag duvar
      yMin: -4,  // Alt duvar
      yMax: 4,   // Üst duvar
    };

    this.ball.mesh.position.set(0, 0, 0);
    if (this.gameType === "local-4p") {
    this.paddle1.mesh.position.set(-11.5, 1.5, 0);
    this.paddle2.mesh.position.set(-11.5, -1.5, 0);
    this.paddle3.mesh.position.set(11.5, 1.5, 0);
    this.paddle4.mesh.position.set(11.5, -1.5, 0);
    }
    else {
      this.paddle1.mesh.position.set(-11.5, 0, 0);
      this.paddle2.mesh.position.set(11.5, 0, 0);
    }

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

    this.sceneManager.camera.position.set(
      new THREE.Vector3(
        this.cameraDefualtPosition.top.x,
        this.cameraDefualtPosition.top.y,
        this.cameraDefualtPosition.top.z
      )
    );
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

    this.score = { p1: 0, p2: 0 };
    this.onScoreChange = (score) => { };
    this.onGameEnd = (winner) => { };
    this._gameState = GameState.IDLE;
    this.gameEnded = false;

    this.sceneManager.drawRectangleBorder(this.bounds);

    this.sceneManager.add(this.ball.mesh);
    this.sceneManager.add(this.paddle1.mesh);
    this.sceneManager.add(this.paddle2.mesh);
    if (this.gameType === "local-4p") {
      this.sceneManager.add(this.paddle3.mesh);
      this.sceneManager.add(this.paddle4.mesh);
    }
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

  get gameState() {
    return this._gameState;
  }

  set gameState(newState) {
    if (this.isValidTransition(this._gameState, newState ) )
      this._gameState = newState;
  }

  isValidTransition(currentState, newState) {
    switch (currentState) {
      case GameState.IDLE:
        return newState === GameState.RUNNING;
      case GameState.RUNNING:
        return [GameState.PAUSED, GameState.ENDED].includes(newState);
      case GameState.PAUSED:
        return newState === GameState.RUNNING;
      case GameState.ENDED:
        return newState === GameState.DESTROYED;
      case GameState.DESTROYED:
        return false;
      default:
        return false;
    }
  }

  gameStart() {
    if (this.gameState === GameState.IDLE || this.gameState === GameState.ENDED) {
      this.gameState = GameState.RUNNING;
      this.score = { p1: 0, p2: 0 }; // Skorlar resetlendi
      this.onScoreChange(this.score);
    } else {
      console.warn("Cannot start game from current state: " + this.gameState);
    }
  }

  gameRestart() {
    if (this.gameState === GameState.ENDED || this.gameState === GameState.PAUSED)
      this.gameStart();
  }

  gameEnd(winner) {
    if (this.gameState === GameState.RUNNING){
      if (winner)
        this.onGameEnd(winner);
      this.gameState = GameState.ENDED;
      this.gameEnded = true;
    }
  }

  gameDestroy() {
    if (this.gameState !== GameState.DESTROYED) {
      console.log("Oyun tamamen siliniyor...");

      this.gameState = GameState.DESTROYED;
      this.gameEnded = true;

      cancelAnimationFrame(this.animationFrameId);

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


      this.sceneManager.destroy();
      this.sceneManager = null;
      this.inputManager = null;
      this.ball = null;
      this.paddle1 = null;
      this.paddle2 = null;
      this.paddle3 = null; // Paddle 3 silindi
      this.paddle4 = null; // Paddle 4 silindi

      console.log("Oyun başarıyla silindi.");
    } else
      console.warn("Game is already destroyed.");
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

  setPaddle3Position(y) {
    if (this.gameType === "local-4p")
      this.paddle3.mesh.position.y = this.backendYtoFrontendY(y);
    return;
  }

  setPaddle4Position(y) {
    if (this.gameType === "local-4p")
      this.paddle4.mesh.position.y = this.backendYtoFrontendY(y);
    return;
  }

  update() {
    if (this.gameState !== GameState.RUNNING) return;

    if (this.gameType == "local") {
      this.ball.update(this.paddle1, this.paddle2, this.paddle3, this.paddle4, this); // ball.js hala 4 paddle bekliyor, sorun olmaz
      if (this.inputManager.keys.p1["w"]) this.paddle1.move(1);
      if (this.inputManager.keys.p1["s"]) this.paddle1.move(-1);
      if (this.inputManager.keys.p2["ArrowUp"]) this.paddle2.move(1);
      if (this.inputManager.keys.p2["ArrowDown"]) this.paddle2.move(-1);
    }
    else if (this.gameType == "local-4p"){
      console.log("4 player game");
      this.ball.update(this.paddle1, this.paddle2, this.paddle3, this.paddle4, this); // Paddle 3 ve 4 eklendi
      if (this.inputManager.keys.p1["w"]) this.paddle1.move(1); // Sol üst yukarı
      if (this.inputManager.keys.p1["s"]) this.paddle1.move(-1); // Sol üst aşağı
      if (this.inputManager.keys.p3["f"]) this.paddle2.move(1); // Sol alt yukarı (f)
      if (this.inputManager.keys.p3["v"]) this.paddle2.move(-1); // Sol alt aşağı (v)
      if (this.inputManager.keys.p2["ArrowUp"]) this.paddle3.move(1); // Sağ üst yukarı
      if (this.inputManager.keys.p2["ArrowDown"]) this.paddle3.move(-1); // Sağ üst aşağı
      if (this.inputManager.keys.p4["o"]) this.paddle4.move(1); // Sağ alt yukarı (o)
      if (this.inputManager.keys.p4["l"]) this.paddle4.move(-1); // Sağ alt aşağı (l)
    }
    else if (this.gameType == "websocket"){
      if (this.playerRole === "p1") {
        if (this.inputManager.keys.p1["w"]) this.inputManager.send({ type: "move", player: "p1", key: "w", pressed: true });
        if (this.inputManager.keys.p1["s"]) this.inputManager.send({ type: "move", player: "p1", key: "s", pressed: true });
      }
      if (this.playerRole === "p2") {
        if (this.inputManager.keys.p2["ArrowUp"]) this.inputManager.send({ type: "move", player: "p2", key: "ArrowUp", pressed: true });
        if (this.inputManager.keys.p2["ArrowDown"]) this.inputManager.send({ type: "move", player: "p2", key: "ArrowDown", pressed: true });
      }
      if (this.inputManager.keys.p1["1"]) {
        this.changeCameraPosition(this.cameraDefualtPosition.p1);
        this.changeCameraLookAt(this.cameraDefualtLookAt.p1);
      }
      if (this.inputManager.keys.p1["2"]){
        this.changeCameraPosition(this.cameraDefualtPosition.p2);
        this.changeCameraLookAt(this.cameraDefualtLookAt.p2);
      }
      else if (this.inputManager.keys.p1["3"]) {
        this.changeCameraPosition(this.cameraDefualtPosition.top);
        this.changeCameraLookAt(this.cameraDefualtLookAt.top);
      }

    }
    else {console.log("Invalid game type")}

  }

  scorePoint(player) { // player p1p2 veya p3p4 olabilir
    if (this.gameState !== GameState.RUNNING) return;

    this.score[player]++;
    let winner = null;

    this.onScoreChange(this.score);
    if (this.score.p1 >= 5) { // p1p2 skoru kontrolü
      winner = "p1";
      this.gameEnd(winner)
    } else if (this.score.p2 >= 5) { // p3p4 skoru kontrolü
      winner = "p2";
      this.gameEnd(winner)
    }
    console.log("Scored by", player, this.score);
    return this.score;
  }

  animate() {
    if (this.gameState !== GameState.DESTROYED) {
      this.animationFrameId = requestAnimationFrame(() => this.animate());
      this.update();
      this.sceneManager.render();
    }
  }
}

export default Game3D;
