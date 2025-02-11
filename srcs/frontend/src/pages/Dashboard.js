import {MenuElement} from "../core/elements/Type.Element";
import { DivComponent, TextComponent } from "../core/components/Type.Component";
import WebSocketManager from "../core/managers/WebSocketManager";
import { getCookie } from "../core/Cookie";
const DashboardPage = {
  layoutVisibility: true,
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

    const gameHistory = new DivComponent("gameHistory", {});

    getGameHistroy().then((data) => {
      if (data && data.message && Array.isArray(data.message)) {
        for (let i = 0; i < data.message.length; i++) {
          gameHistory.addElement(
            new TextComponent("gameHistory", {
              text: `${data.message[i].player1_id} vs ${data.message[i].player2_id} | ${data.message[i].winner_id} : ${data.message[i].player1_score}-${data.message[i].player2_score} | ${data.message[i].end_date}`,
              class: "text-center element-h2",
              styles: { display: "block" }
            })
          )
        }
        gameHistory.update({elements: gameHistory.elements});
      }
    });





    pageContainer.elements[0].elements =  [status, gameHistory];


    return pageContainer.render();
  }
}

export default DashboardPage;


async function getGameHistroy() {
  getCookie("csrfToken");
  const response = await fetch(`https://${window.location.host}/api/game/getDB/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrfToken"),
      "Authorization": `Bearer ${getCookie('accessToken')}`
    },
    credentials: "include",
  });

  if (response.ok)
    return await response.json();
  return null;
}
