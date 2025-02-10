import WebSocketManager from "../managers/WebSocketManager.js";

class InputManager {
  constructor(inputMode = "local", websocketURL = null, playerRole = "p2", onBallUpdate) {
    this.keys = {
        p1: { "w": false, "s": false },
        p2: { "ArrowUp": false, "ArrowDown": false }
    };
    this.inputMode = inputMode;
    this.websocketManager = null;
    this.playerRole = playerRole;
    this.onBallUpdate = onBallUpdate;

    if (this.inputMode === "websocket") {
      if (!websocketURL) {
        console.error("WebSocket modu seçildi, ancak websocketURL belirtilmedi!");
        this.inputMode = "local";
        this.setupLocalKeyboard();
      } else {
        this.setupWebSocket(websocketURL, this.playerRole);
      }
    } else if (this.inputMode === "local") {
      this.setupLocalKeyboard();
    } else {
      console.warn(`Bilinmeyen giriş modu: ${inputMode}. Yerel klavye modu kullanılıyor.`);
      this.inputMode = "local";
      this.setupLocalKeyboard();
    }
  }

  setupWebSocket(websocketURL, playerRole) {
    console.log("setupWebSocket çağrıldı. websocketURL:", websocketURL, "playerRole:", playerRole);
    this.websocketManager = new WebSocketManager(websocketURL, (data) => {
      this.handleWebSocketMessage(data, playerRole);
    });
    console.log("WebSocketManager oluşturuldu:", this.websocketManager);
    this.websocketManager.connect();
    this.setupWebSocketKeyboard(); // setupWebSocketKeyboard çağrılıyor
  }

  setupWebSocketKeyboard() { // Yeni fonksiyon: websocket klavye olaylarını dinler
    window.addEventListener("keydown", (event) => this.setWebSocketKey(event, true));
    window.addEventListener("keyup", (event) => this.setWebSocketKey(event, false));
  }


  setupLocalKeyboard() {
    window.addEventListener("keydown", (event) => this.setKey(event, true));
    window.addEventListener("keyup", (event) => this.setKey(event, false));
  }

  handleWebSocketMessage(data, playerRole) {
    console.log("WebSocket mesajı alındı:", data, "Oyuncu Rolü:", playerRole);
    if (data.type === 'move') {
      const targetPlayer = data.player;
      if (targetPlayer === 'p1' || targetPlayer === 'p2') {
        if (data.key && this.keys[targetPlayer] && this.keys[targetPlayer][data.key] !== undefined) {
          this.keys[targetPlayer][data.key] = data.pressed;
        }
      }
    } else if (data.type === 'update_ball') {
      if (this.onBallUpdate) {
        this.onBallUpdate(data.ball_x, data.ball_y);
      } else {
        console.warn("onBallUpdate callback fonksiyonu tanımlı değil!");
      }
    }
  }

  setKey(event, isPressed) { // Yerel klavye için (websocket modunda kullanılmayacak)
    if (this.keys.p1[event.key] !== undefined) this.keys.p1[event.key] = isPressed;
    if (this.keys.p2[event.key] !== undefined) this.keys.p2[event.key] = isPressed;
  }


  setWebSocketKey(event, isPressed) { // Websocket klavye için (websocket modunda kullanılacak)
    let player = this.playerRole;
    let key = event.key;
    let hareketTusu = false;

    if (player === "p1") {
        if (key === "w" || key === "s") {
            hareketTusu = true;
        }
    } else if (player === "p2") {
        if (key === "ArrowUp" || key === "ArrowDown") {
            hareketTusu = true;
        }
    }

    if (hareketTusu) {
        const message = {
            type: 'move',
            player: player,
            key: key,
            pressed: isPressed
        };
        this.sendWebSocketMessage(message);
    }


    // Yerel olarak tuş durumunu güncelle (isteğe bağlı, sunucudan gelen güncellemeler de tuş durumunu ayarlayabilir)
    if (this.keys[player][key] !== undefined) {
        this.keys[player][key] = isPressed;
    }
  }


  sendWebSocketMessage(message) {
    if (this.websocketManager) {
      this.websocketManager.send(message);
    } else {
      console.warn("WebSocketManager başlatılmamış. Mesaj gönderilemedi.");
    }
  }

  closeWebSocket() {
    if (this.websocketManager) {
      this.websocketManager.close();
    }
  }
}

export default InputManager;
