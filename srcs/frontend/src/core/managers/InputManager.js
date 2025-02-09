// InputManager.js
import WebSocketManager from "../managers/WebSocketManager.js";

class InputManager {
    constructor(inputMode = "local", websocketURL = null) {
        this.keys = {
            p1: { "w": false, "s": false },
            p2: { "ArrowUp": false, "ArrowDown": false }
        };
        this.inputMode = inputMode;
        this.websocketManager = null; // WebSocketManager örneğini saklamak için

        if (this.inputMode === "websocket") {
            if (!websocketURL) {
                console.error("WebSocket modu seçildi, ancak websocketURL belirtilmedi!");
                this.inputMode = "local"; // URL yoksa yerel moda geri dön
                this.setupLocalKeyboard(); // Yerel klavyeyi varsayılan olarak ayarla
            } else {
                this.setupWebSocket(websocketURL);
            }
        } else if (this.inputMode === "local") {
            this.setupLocalKeyboard();
        } else {
            console.warn(`Bilinmeyen giriş modu: ${inputMode}. Yerel klavye modu kullanılıyor.`);
            this.inputMode = "local";
            this.setupLocalKeyboard();
        }
    }

    setupWebSocket(websocketURL) {
        this.websocketManager = new WebSocketManager(websocketURL, (data) => {
            this.handleWebSocketMessage(data); // WebSocketManager'dan gelen mesajları işle
        });
        this.websocketManager.connect();
    }

    setupLocalKeyboard() {
        window.addEventListener("keydown", (event) => this.setKey(event, true));
        window.addEventListener("keyup", (event) => this.setKey(event, false));
    }

    handleWebSocketMessage(data) {
        // Gelen WebSocket mesajlarını işle ve tuş durumlarını güncelle
        if (data.type === 'move') { // Örnek: 'move' tipindeki mesajları işle
            if (data.player === 'p1' || data.player === 'p2') {
                if (data.key && this.keys[data.player] && this.keys[data.player][data.key] !== undefined) {
                    this.keys[data.player][data.key] = data.pressed; // `pressed` alanının boolean olduğunu varsayıyoruz
                }
            }
        }
        // Başka mesaj tiplerini de burada işleyebilirsiniz (örn. 'update_ball', 'disconnect' - eğer input ile ilgiliyse)
    }


    setKey(event, isPressed) {
        if (this.keys.p1[event.key] !== undefined) this.keys.p1[event.key] = isPressed;
        if (this.keys.p2[event.key] !== undefined) this.keys.p2[event.key] = isPressed;
    }

    // WebSocket mesajı göndermek için (gerekirse)
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
