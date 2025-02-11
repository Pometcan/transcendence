import {MenuElement} from "../core/elements/Type.Element";
import { DivComponent, TextComponent } from "../core/components/Type.Component";
import WebSocketManager from "../core/managers/WebSocketManager";
import { getCookie } from "../core/Cookie";
const DashboardPage = {
  layoutVisibility: true,
  pageBack: () => {
    console.log("DashboardPage.pageBack");
    //if (GameLocalPage.game)
      //GameLocalPage.game.gameDestroy();
  },
  pageNext: () => {
    console.log("DashboardPage.pageNext");
    //if (GameLocalPage.game)
      //GameLocalPage.game.gameDestroy();
  },
  render:  () => {
    const pageContainer = MenuElement("DashboardPage");

    const status = new TextComponent("DashboardPageStatus", {text: "agla"});
    const userId =  getCookie("userId");
    const websocket = new WebSocket(`wss://` + window.location.host + `/api/auth/${userId}/`); // Sunucu adresinizi ve portunuzu güncelleyin
    if (websocket && websocket.readyState === WebSocket.OPEN) {
        return;
    }

    websocket.onopen = function() {
        status.update({text: "Connected"})
    };

    websocket.onclose = function() {
        status.update({text: "Disconnected"})
    };

    websocket.onerror = function(error) {
        console.error("WebSocket error:", error);
        status.update({text: error})
    };


    pageContainer.elements[0].elements =  [status];


    return pageContainer.render();
  }
}

export default DashboardPage;
