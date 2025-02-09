// GameP2Page.js (Kullanım örneği)
import {MenuElement} from "../core/elements/Type.Element";
import { TextComponent,ButtonComponent } from "../core/components/Type.Component";
import Game3D from "../core/game/Game3D";
import { getCsrfToken } from "../core/Cookie";

const GameP2Page = {
    layoutVisibility: false,
    render:  (params) => {
        const pageContainer = MenuElement("GameP2Page");
        pageContainer.addStyle = {
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
        };
        if (params.get("id") === null)
        {
          hostButton = new ButtonComponent("hostButton", { label: "Oda Aç", class: "btn btn-primary" });
          withEventHandlers(hostButton, { onClick: async() => await hostGame() });
          pageContainer.elements = [ hostButton ];
          pageContainer.update();
          return pageContainer.render();
        }
        else
        {
          const skor = new TextComponent("skor", { text: "Skor: 0-0", class: "element-h2" });

          let game
          const roomID = params.get("id");
          game = new Game3D({ inputMode: "websocket", websocketURL: 'wss://' + window.location.host + "/pong/" + params.roomId }); // params.roomId'i kullanarak oda ID'sini alıyoruz

          game.onScoreChange = (scoreText) => {
              skor.update({ text: scoreText });
          };
          pageContainer.elements[0].elements = [ skor];
          pageContainer.update();
          return pageContainer.render();
        }

    }
};

export default GameP2Page;

async function hostGame() {
  const csrfToken = getCsrfToken();
    const response = await fetch(`https://${window.location.host}/api/game/host`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },body: JSON.stringify({user_id: userID}),
    });
    const data = await response.json();
    if (response.ok) {
      roomID = response.room_id;

      connectWebSocket('/ws/pong/' + roomID + '/' + userID);
      window.router.navigate(`/gamep2?id=${data.roomId}`);
    } else {
        alert(data.message);
    }
}
