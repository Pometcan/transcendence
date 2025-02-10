import {MenuElement} from "../core/elements/Type.Element";
import { DivComponent, TextComponent } from "../core/components/Type.Component";
import WebSocketManager from "../core/managers/WebSocketManager";
import { getCookie } from "../core/Cookie";
const DashboardPage = {
  layoutVisibility: true,
  render:  () => {
    const pageContainer = MenuElement("DashboardPage");

    const status = new TextComponent("DashboardPageStatus", {text: "agla",style:{
      width: "100%",
      height: "100%",
      backgroundColor: "red"
    }});
    const userId =  getCookie("userId");
    const websocket = new WebSocket(`wss://` + window.location.host + `/api/auth/${userId}/`); // Sunucu adresinizi ve portunuzu güncelleyin
    if (websocket && websocket.readyState === WebSocket.OPEN) {
        alert("WebSocket is already connected.");
        return;
    }

    websocket.onopen = function(event) {
        console.log("WebSocket connection opened");
        status.update({text: "Connected"})
        addMessage("Connection opened");
    };

    websocket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        console.log("Message received:", data);
        if (data.type === 'online_user_list') {
            console.log("online_user_list = " + data.online_user_list);
        } else {
            console.log("unknown data = " + data);
        }
    };

    websocket.onclose = function(event) {
        console.log("WebSocket connection closed");
        status.update({text: "Disconnected"})
        addMessage("Connection closed");
    };

    websocket.onerror = function(error) {
        console.error("WebSocket error:", error);
        status.update({text: error})
        addMessage("Error: " + error);
    };


    pageContainer.elements[0].elements =  [status];


    return pageContainer.render();
  }
}

export default DashboardPage;
