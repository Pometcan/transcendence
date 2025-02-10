import { DivComponent } from "../core/components/UIComponent.Div.js";
import { TextComponent } from "../core/components/UIComponent.Text";
import {MenuElement} from "../core/elements/Type.Element.js";
import Game3D from "../core/game/Game3D.js";

const GameLocalPage = {
  layoutVisibility: false,
  render:  () => {
    const pageContainer = new DivComponent("FriendPage", {
      class: "",
      styles: {
        position: "absolute",
        top: "30px",
        left: "50%",
        transform: "translate(-50%, 0)",
        alignItems: "center",
      }
    });
    const skor = new TextComponent("skor", { text: "0 - 0", class: "text-center element-h2" });
    const game = new Game3D({inputMode: "local"});
    game.onScoreChange = (score) => {
      skor.update({ text: `${score.p1} - ${score.p2}` });
      console.log("Skor: ", score);
    };
    game.onGameEnd = (winner) => {
      console.log("Kazanan: ", winner);
      skor.update({ text: `${game.score.p1} - ${game.score.p2} Kazanan: ${winner}` });
      game.gameStop();
    }
    pageContainer.elements = [
      skor
    ];
    return pageContainer.render();
  }
}

export default GameLocalPage;
