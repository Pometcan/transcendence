import { DivComponent } from "../core/components/UIComponent.Div.js";
import { TextComponent } from "../core/components/UIComponent.Text";
import { withEventHandlers } from "../core/components/UIComponent.Util.js";
import {MenuElement} from "../core/elements/Type.Element.js";
import { SubmitButton } from "../core/elements/Type.Element.js";
import Game3D from "../core/game/Game3D.js";

const GameLocalPage = {
  layoutVisibility: false,
  game:null,
  pageLoad: () => {
 },

  pageLeave: () => {
    console.log("GameLocalPage.pageLeave");
    GameLocalPage.destroyGame();
  },

  destroyGame: () => {
    if (GameLocalPage.game) {
      GameLocalPage.game.gameDestroy();
      GameLocalPage.game = null;
    }
  },
  render:  () => {
    const pageContainer = new   DivComponent("FriendPage", {
      class: "",
      styles: {
        position: "absolute",
        top: "30px",
        left: "50%",
        transform: "translate(-50%, 0)",
        alignItems: "center",
      }
    });

    const startBtn = SubmitButton("startBtn", "Start Game");
    const skor = new TextComponent("skor", { text: "0 - 0", class: "text-center element-h2" });

    withEventHandlers(startBtn, {
      onClick: () => {
        GameLocalPage.game.gameStart();
        startBtn.element.style.display = "none";
      }
    })

    GameLocalPage.game = new Game3D({inputMode: "local"});
    GameLocalPage.game.onScoreChange = (score) => {
      skor.update({ text: `${score.p1} - ${score.p2}` });
      console.log("Skor: ", score);
    };
    GameLocalPage.game.onGameEnd = (winner) => {
      console.log("Kazanan: ", winner);
      skor.update({ text: `${GameLocalPage.game.score.p1} - ${GameLocalPage.game.score.p2} Kazanan: ${winner}` });
    }
    pageContainer.elements = [
      skor,
      startBtn,
    ];
    return pageContainer.render();
  }
}

export default GameLocalPage;
