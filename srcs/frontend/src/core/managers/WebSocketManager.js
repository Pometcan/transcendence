class WebSocketManager {
    constructor(websocketURL, onMessageCallback) {
        this.websocketURL = websocketURL;
        this.onMessageCallback = onMessageCallback;
        this.websocket = null;
    }

    connect() {
        this.websocket = new WebSocket(this.websocketURL);

        this.websocket.onopen = () => {
            console.log("WebSocket bağlantısı açıldı.");
        };

        this.websocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (this.onMessageCallback) {
                    this.onMessageCallback(data);
                }
            } catch (error) {
                console.error("WebSocket mesajı ayrıştırılamadı:", error, event.data);
            }
        };

        this.websocket.onerror = (error) => {
            console.error("WebSocket hatası:", error);
        };

        this.websocket.onclose = () => {
            console.log("WebSocket bağlantısı kapandı.");
        };
    }

    send(message) {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify(message));
        } else {
            console.warn("WebSocket bağlantısı açık değil. Mesaj gönderilemedi:", message);
        }
    }

    close() {
        if (this.websocket) {
            this.websocket.close();
        }
    }

    get readyState() {
        if (this.websocket) {
            return this.websocket.readyState;
        }
        return WebSocket.CLOSED; // WebSocket henüz oluşturulmamışsa kapalı olarak kabul et
    }
}

export default WebSocketManager;
