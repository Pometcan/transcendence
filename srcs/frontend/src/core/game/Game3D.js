// Game3D.js
import SceneManager from "../managers/SceneManager.js";
import Ball from "./ball.js";
import Paddle from "./paddle.js";
import InputManager from "../managers/InputManager.js";
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

class Game3D {
  constructor(inputConfig = {}, isOnline) { // inputConfig parametresi eklendi, varsayılan boş obje
    this.sceneManager = new SceneManager();
    this.inputManager = new InputManager(inputConfig.inputMode, inputConfig.websocketURL); // InputManager'a parametreleri geçir

    this.isOnline = isOnline;
    this.roomId = null;
    this.playerId = null;
    this.playerId = null;
    this.ball = new Ball(this);
    this.paddle1 = new Paddle(-8);
    this.paddle2 = new Paddle(8);

    this.score = { p1: 0, p2: 0 };
    this.onScoreChange = (scoreText) => {}; // onScoreChange artık skor objesi değil, text alacak
    this.gameEnded = false; // Oyunun bitip bitmediğini takip etmek için bir değişken ekleyelim

    this.sceneManager.add(this.ball.mesh);
    this.sceneManager.add(this.paddle1.mesh);
    this.sceneManager.add(this.paddle2.mesh);

    this.animate();
  }

  async initialize() {
    if (this.isOnline) {
      this.roomId = await this.inputManager.createRoom();
      this.playerId = await this.inputManager.joinRoom(this.roomId);
    }
  }

  update() {
    if (this.gameEnded) return; // Oyun bittiyse update fonksiyonundan çık

    this.ball.update(this.paddle1, this.paddle2, this);

    if (this.inputManager.keys.p1["w"]) this.paddle1.move(1);
    if (this.inputManager.keys.p1["s"]) this.paddle1.move(-1);
    if (this.inputManager.keys.p2["ArrowUp"]) this.paddle2.move(1);
    if (this.inputManager.keys.p2["ArrowDown"]) this.paddle2.move(-1);
  }

  scorePoint(player) {
    if (this.gameEnded) return; // Oyun bittiyse skorlama yapma

    this.score[player]++;
    let scoreText = `Skor: ${this.score.p1}-${this.score.p2}`; // Başlangıçta normal skoru oluştur
    let winner = null;

    if (this.score.p1 >= 5) {
      winner = "Sol Oyuncu Kazandı!";
      this.gameEnded = true;
      scoreText = winner; // Kazanan varsa skoru kazanan mesajıyla değiştir
      this.onGameEnd(winner); // Oyun bittiğinde yapılacak ek işlemler için bir fonksiyon çağırabiliriz
    } else if (this.score.p2 >= 5) {
      winner = "Sağ Oyuncu Kazandı!";
      this.gameEnded = true;
      scoreText = winner; // Kazanan varsa skoru kazanan mesajıyla değiştir
      this.onGameEnd(winner); // Oyun bittiğinde yapılacak ek işlemler için bir fonksiyon çağırabiliriz
    }

    this.onScoreChange(scoreText); // scoreText'i gönderiyoruz, skor objesini değil
    return this.score;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.update();
    this.sceneManager.render();
  }

  // İsteğe bağlı: Oyun bittiğinde yapılacak ek işlemler için fonksiyon (örneğin konfeti)
  onGameEnd(winner) {
    console.log("Oyun Bitti! Kazanan: " + winner);
    confetti(); // Konfeti efektini tetikle
  }
}

export default Game3D;
