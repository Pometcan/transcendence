class WebSocketManager {
  constructor(websocketURL, onInputMessage) {
    console.log("WebSocketManager constructor çalıştı. websocketURL:", websocketURL); // WebSocketManager oluşturulduğunda logla
    this.websocketURL = websocketURL;
    this.onInputMessage = onInputMessage;
    this.websocket = null;
  }

  connect() {
    console.log("WebSocketManager connect() çağrıldı. websocketURL:", this.websocketURL); // connect çağrıldığında logla
    if (!this.websocketURL) {
      console.error("WebSocket URL is not provided.");
      return;
    }

    this.websocket = new WebSocket(this.websocketURL);

    this.websocket.onopen = () => {
      console.log("WebSocket bağlantısı açıldı:", this.websocketURL); // Bağlantı açıldığında logla
    };

    this.websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket Gelen Mesaj:", data); // Gelen mesajı logla
        if (this.onInputMessage) {
          this.onInputMessage(data);
        }
      } catch (error) {
        console.error("WebSocket mesajı işlenirken hata:", error);
        console.error("Alınan mesaj:", event.data);
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
