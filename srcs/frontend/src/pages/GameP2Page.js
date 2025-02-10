import {MenuElement, InputElement} from "../core/elements/Type.Element";
import { TextComponent,ButtonComponent, withEventHandlers, DivComponent, InputComponent } from "../core/components/Type.Component"; // InputComponent ekledik
import Game3D from "../core/game/Game3D";
import { getCookie, getCsrfToken } from "../core/Cookie";

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
        pageContainer.class += "";
        pageContainer.elements[0].class += "container d-flex flex-column    p-4";
        pageContainer.elements[0].elements = [];

        console.log(params);
        if (params.size == 0)
        {
          const hostBtn = new ButtonComponent("hostBtn", { label: "Host Game", class: "btn btn-primary" });
          const joinBtn = new ButtonComponent("joinBtn", { label: "Join Game", class: "btn btn-primary" });
          const btnDiv = new DivComponent("btnDiv", {class: "d-flex justify-content-around", elements: [hostBtn, joinBtn]});
          const roomIdInput = InputElement("roomIdInput", "Room ID", "text");
          const backbtn = new ButtonComponent("backBtn", { label: "Back", class: "btn mt-2 btn-secondary " });
          pageContainer.elements[0].elements = [
            roomIdInput,
            btnDiv,
            backbtn,
          ];

          withEventHandlers(hostBtn, { onClick: async () =>  await hostGame(getCookie("userId"))});
          withEventHandlers(joinBtn, { onClick: async () =>  await joinGame(getCookie("userId"), roomIdInput.elements[0].value)});
          withEventHandlers(backbtn, { onClick: () => window.router.navigate("/") });

          pageContainer.update();
          return pageContainer.render();
        }
        else if (params.get("roomId"))
        {
          const skor = new TextComponent("skor", { text: "Score: 0", class: "text-center element-h2" });
          const roomId = params.get("roomId");
          const websocketURL = localStorage.getItem('websocketURL');
          const playerRole = localStorage.getItem('playerRole');
          if (!websocketURL)
          {
            console.log(websocketURL)
            console.error("WebSocket URL bulunamadı. Oyun başlatılamıyor.");
            window.router.navigate("/gamep2");
          }
          const game = new Game3D({inputMode: "websocket", websocketURL: websocketURL, playerRole: playerRole});
          game.onScoreChange = (scoreText) => {
              skor.update({ text: scoreText });
          };
          game.onGameEnd = (winner) => {
              game.gameStop();
          }
          pageContainer.elements[0].elements = [
            skor,
            new TextComponent("gameTitle", { text: "Game", class: "text-center element-h2" }),
            new DivComponent("gameContainer", { class: "d-flex justify-content-center", elements: [game.canvas] }),
          ];
          pageContainer.update();
          return pageContainer.render();
        }
        else if (params.get("roomId") && params.get("userId"))
        {
          const roomId = params.get("roomId");
          const userId = params.get("userId");
          const websocketURL = `wss://${window.location.host}/api/pong/${roomId}/${userId}`;
          const playerRole = "p2";
          const game = new Game3D({inputMode: "websocket", websocketURL: websocketURL, playerRole: playerRole});
          pageContainer.elements[0].elements = [
            new TextComponent("gameTitle", { text: "Game", class: "text-center element-h2" }),
            new DivComponent("gameContainer", { class: "d-flex justify-content-center", elements: [game.canvas] }),
          ];
          pageContainer.update();
          return pageContainer
        }
        else
        {
          window.router.navigate("/gamep2");
          pageContainer.update();
          return pageContainer.render();
        }
    }
};

export default GameP2Page;

async function hostGame(userId) {
  console.log("hostGame");
  const renponse = await sendPostRequest(`https://${window.location.host}/api/game/host/`, {user_id: userId});
  if (renponse.status === "success") {
    const roomId = renponse.room_id;
    if (!roomId)
      return;
    localStorage.setItem('playerRole', "p1");
    localStorage.setItem('websocketURL', `wss://${window.location.host}/api/pong/${roomId}/${userId}`);
    window.router.navigate(`/gamep2`, {roomId: roomId});
  } else
    console.error("Error: ", renponse.message);
  return renponse;
}

async function joinGame(userId, roomId) {
  if (!roomId)
    return;
  const response = await sendPostRequest(`https://${window.location.host}/api/game/join/`, {user_id: userId, room_id: roomId});
  if (response.status === "success") {
    console.log(response );
    if (!roomId)
      return;
    localStorage.setItem('playerRole', "p2");
    localStorage.setItem('websocketURL', `wss://${window.location.host}/api/pong/${roomId}/${userId}`);
  window.router.navigate(`/gamep2`, {roomId: roomId, userId: userId});
  } else
    console.error("Error: ", response.message);
  return response;
}

async function sendPostRequest(url, data) {
  try {
    const csrfToken = getCsrfToken();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
        "Authorization": `Bearer ${getCookie("accessToken")}`,
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("POST isteği hatası:", error);
    return { status: "error", message: "İstek gönderilirken bir hata oluştu." };
  }
}
