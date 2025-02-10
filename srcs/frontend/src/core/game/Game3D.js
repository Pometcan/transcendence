import SceneManager from "../managers/SceneManager.js";
import Ball from "./ball.js";
import Paddle from "./paddle.js";
import InputManager from "../managers/InputManager.js";
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

class Game3D {
  constructor(inputConfig = {}) {
    this.sceneManager = new SceneManager();
    this.inputManager = new InputManager(inputConfig.inputMode, inputConfig.websocketURL, inputConfig.playerRole, this.setBallPosition.bind(this)); // onBallUpdate callback'ini InputManager'a geçir // Değişiklik
    console.log("InputManager oluşturuldu:", this.inputManager);

    this.playerRole = inputConfig.playerRole;
    console.log(`Oyuncu rolü: ${this.playerRole}`);
    this.ball = new Ball();
    this.paddle1 = new Paddle(-8);
    this.paddle2 = new Paddle(8);

    this.score = { p1: 0, p2: 0 };
    this.onScoreChange = (score) => {};
    this.gameState = "stopped";
    this.gameEnded = false;

    this.sceneManager.add(this.ball.mesh);
    this.sceneManager.add(this.paddle1.mesh);
    this.sceneManager.add(this.paddle2.mesh);

    this.animate();
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


  setBallPosition(x, y) {
    this.ball.mesh.position.x = x;
    this.ball.mesh.position.y = y;
  }


  update() {
    if (this.gameEnded) return;

    this.ball.update(this.paddle1, this.paddle2, this);

    // **P1 ise paddle1, P2 ise paddle2 kontrol eder**
    if (this.playerRole === "p1") {
      if (this.inputManager.keys.p1["w"]) this.paddle1.move(1);
      if (this.inputManager.keys.p1["s"]) this.paddle1.move(-1);
    } else if (this.playerRole === "p2") {
      if (this.inputManager.keys.p2["ArrowUp"]) this.paddle2.move(1);
      if (this.inputManager.keys.p2["ArrowDown"]) this.paddle2.move(-1);
    }
  }

  scorePoint(player) {
    if (this.gameEnded) return;

    this.score[player]++;
    let scoreText = `Skor: ${this.score.p1}-${this.score.p2}`;
    let winner = null;

    if (this.score.p1 >= 5) {
      winner = "Sol Oyuncu Kazandı!";
      this.gameEnded = true;
      scoreText = winner;
      this.onGameEnd(winner);
    } else if (this.score.p2 >= 5) {
      winner = "Sağ Oyuncu Kazandı!";
      this.gameEnded = true;
      scoreText = winner;
      this.onGameEnd(winner);
    }

    this.onScoreChange(scoreText);
    return this.score;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.update();
    this.sceneManager.render();
  }

  onGameEnd(winner) {
    console.log("Oyun Bitti! Kazanan: " + winner);
    confetti();
  }
}

export default Game3D;
