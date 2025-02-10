import WebSocketManager from "../managers/WebSocketManager.js";

class InputManager {
constructor(inputMode = "local", websocketURL = null, playerRole = "p2", onBallUpdate, onPaddle1Update, onPaddle2Update) {
this.keys = {
  p1: { "w": false, "s": false },
  p2: { "ArrowUp": false, "ArrowDown": false },
  camera: {"c": false, "c_pressed": false}
};
this.inputMode = inputMode;
this.websocketManager = null;
this.playerRole = playerRole;
this.onBallUpdate = onBallUpdate;
this.onPaddle1Update = onPaddle1Update;
this.onPaddle2Update = onPaddle2Update;


if (this.inputMode === "websocket") {
  if (!websocketURL) {
      this.inputMode = "local";
      this.setupLocalKeyboard();
  } else {
      this.setupWebSocket(websocketURL, this.playerRole);
  }
  } else if (this.inputMode === "local") {
    this.setupLocalKeyboard();
  } else {
    this.inputMode = "local";
    this.setupLocalKeyboard();
  }
}

setupWebSocket(websocketURL, playerRole) {
    this.websocketManager = new WebSocketManager(websocketURL, (data) => {
        this.handleWebSocketMessage(data, playerRole);
    });
    this.websocketManager.connect();
    this.setupWebSocketKeyboard();
}

setupWebSocketKeyboard() {
    window.addEventListener("keydown", (event) => this.setWebSocketKey(event, true));
    window.addEventListener("keyup", (event) => this.setWebSocketKey(event, false));
}

setupLocalKeyboard() {
    window.addEventListener("keydown", (event) => this.setKey(event, true));
    window.addEventListener("keyup", (event) => this.setKey(event, false));
}
backendYtoFrontendY(backendY) {
  // Backend Y (0-100) -> Frontend Y (-4 - 4)
  return (backendY / 100) * 8 - 4;
}
handleWebSocketMessage(data, playerRole) {
    if (data.type === 'move') {
      console.log("WebSocket mesajı alındı:", data, playerRole);
      if (data.p1_y)
      {
        if (this.onPaddle1Update) {
          this.onPaddle1Update(data.p1_y);
        }
        else {
          console.warn("onPaddle1Update callback fonksiyonu tanımlı değil!");
        }
      }
      if (data.p2_y)
      {
        if (this.onPaddle2Update) {
          this.onPaddle2Update(data.p2_y);
        }
        else {
          console.warn("onPaddle2Update callback fonksiyonu tanımlı değil!");
        }
      }

    } else if (data.type === 'update_ball') {
        if (this.onBallUpdate) {
            this.onBallUpdate(data.ball_x, data.ball_y);
        }
        else {
            console.warn("onBallUpdate callback fonksiyonu tanımlı değil!");
        }
    }
}

setKey(event, isPressed) {
    if (this.keys.p1[event.key] !== undefined) this.keys.p1[event.key] = isPressed;
    if (this.keys.p2[event.key] !== undefined) this.keys.p2[event.key] = isPressed;
    if (this.keys.camera[event.key] !== undefined) {
        this.keys.camera[event.key] = isPressed;
        if (event.key === 'c' && isPressed) {
            this.keys.camera.c_pressed = true;
        }
    }
}

setWebSocketKey(event, isPressed) {
    let player = this.playerRole;
    let key = event.key;

        if (key === 'ArrowUp') {
            key = 'up'
        } else if (key === 'ArrowDown') {
            key = 'down';
        } else if (key === 'w') {
            key = 'up';
        }
        else if (key === 's') {
            key = 'down';
        }
    console.log("Key pressed:", key, isPressed);
    const message = {
        type: 'move',
        direction: key,
    };
    this.sendWebSocketMessage(message);

    if (this.keys[player] && this.keys[player][key] !== undefined) {
        this.keys[player][key] = isPressed;
    }
}

resetCameraKeyPressed() {
    this.keys.camera.c_pressed = false;
}


  sendWebSocketMessage(message) {
    if (this.websocketManager) {
        this.websocketManager.send(message);
    } else {
        console.warn("WebSocketManager başlatılmamış. Mesaj gönderilemedi.");
    }
  }

  send(message) {
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
