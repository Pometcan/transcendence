// WebSocketManager.js
class WebSocketManager {
    constructor(websocketURL, onInputMessage) {
        this.websocketURL = websocketURL;
        this.onInputMessage = onInputMessage; // Callback function to handle input messages
        this.websocket = null;
    }

    connect() {
        if (!this.websocketURL) {
            console.error("WebSocket URL is not provided.");
            return;
        }

        this.websocket = new WebSocket(this.websocketURL);

        this.websocket.onopen = () => {
            console.log("WebSocket bağlantısı açıldı:", this.websocketURL);
            // You can add any on open logic here if needed, e.g., sending a "join" message
        };

        this.websocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("WebSocket Gelen Mesaj:", data);
                if (this.onInputMessage) {
                    this.onInputMessage(data); // Call the callback with the received data
                }
            } catch (error) {
                console.error("WebSocket mesajı işlenirken hata:", error);
                console.error("Alınan mesaj:", event.data);
            }
        };

        this.websocket.onerror = (error) => {
            console.error("WebSocket hatası:", error);
            // Handle error, maybe try to reconnect or notify user
        };

        this.websocket.onclose = () => {
            console.log("WebSocket bağlantısı kapandı.");
            // Handle connection close, maybe try to reconnect or notify user
        };
    }

    send(message) {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket bağlantısı açık değil. Mesaj gönderilemedi:", message);
        }
    }

    close() {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.close();
        }
    }
}

export default WebSocketManager;
