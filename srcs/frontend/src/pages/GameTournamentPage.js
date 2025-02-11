
import { DivComponent } from "../core/components/UIComponent.Div.js";
import { TextComponent } from "../core/components/UIComponent.Text";
import { withEventHandlers } from "../core/components/UIComponent.Util.js";
import { SubmitButton, InputElement } from "../core/elements/Type.Element.js";
import Game3D from "../core/game/Game3D.js";
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

const GameTournamentPage = {
  layoutVisibility: false,
  game:null,
  pageLoad: () => {
 },

  pageLeave: () => {
    console.log("GameLocalPage.pageLeave");
    GameTournamentPage.destroyGame();
  },

  destroyGame: () => {
    if (GameTournamentPage.game) {
      GameTournamentPage.game.gameDestroy();
      GameTournamentPage.game = null;
    }
  },
  render:  () => {
    const pageContainer = new   DivComponent("FriendPage", {
      class: "d-flex flex-column",
      styles: {
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: "20px",
        borderRadius: "10px",
      }
    });

    const startBtn = SubmitButton("startBtn", "Start Game");
    const skor = new TextComponent("skor", { text: "0 - 0", class: "text-center element-h2", styles: { display: "none" } });
    const p1Input = InputElement("p1Input", "1 Player Name", "text");
    const p2Input = InputElement("p2Input", "2 Player Name", "text");
    const p1name = new TextComponent("p1name", { text: "Player 1", class: "text-center element-h2",
      styles: {
        display: "none",
        position: "absolute",
        top: "30px",
        left: "30px"
      }
    });
    const p2name = new  TextComponent("p2name", { text: "Player 2", class: "text-center element-h2",
      styles: {
        display: "none",
        position: "absolute",
        top: "30px",
        right: "30px"
      }
    });
    const winnerText = new TextComponent("winnerText", { text: "", class: "text-center element-h2", styles: { display: "none" } });
    const restartBtn = SubmitButton("restartBtn", "Restart Game");
    restartBtn.styles = { display: "none", margin: "10px", backgroundColor: "green" };
    const backBtn = SubmitButton("backBtn", "Back");
    backBtn.styles = { margin: "10px", backgroundColor: "gray" };

    withEventHandlers(startBtn, {
      onClick: () => {
        console.log(p1Input.elements[0].value, p2Input.elements[0].value);
        if (p1Input.elements[0].value === "" || p2Input.elements[0].value === ""){
          startBtn.update({label: "Name Please "})
          return;
        }
        GameLocalPage.game.gameStart();
        pageContainer.update({styles: {
          position: "absolute",
          top: "30px",
          width: "100%",
          justifyContent: "between",
          transform: "translate(-50%, 0)",
          backgroundColor: "rgba(0, 0, 0, 0)"
        }})
        startBtn.update({styles: {display: "none"}});
        p1Input.update({styles: {display: "none"}});
        p2Input.update({styles: {display: "none"}});
        backBtn.update({styles: {display: "none"}});
        winnerText.update({styles: {display: "none"}});
        skor.update({styles: {display: "block" }});
        p1name.update({text: p1Input.elements[0].value, styles: {display: "block"}});
        p2name.update({text: p2Input.elements[0].value, styles: {display: "block"}});
        console.log(p2name)
      }
    })

    GameTournamentPage.game = new Game3D({inputMode: "local"});
    GameTournamentPage.game.onScoreChange = (score) => {
      skor.update({ text: `${score.p1} - ${score.p2}` });
    };
    GameTournamentPage.game.onGameEnd = (winner) => {
      skor.update({ text: `${GameLocalPage.game.score.p1} - ${GameLocalPage.game.score.p2}`});
      confetti();
      winnerText.update({text: `${winner} wins`, styles: {display: "block"}});
      pageContainer.update({styles: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
      }})
      restartBtn.update({styles: {display: "block"}});
      backBtn.update({styles: {display: "block"}});
    }

    withEventHandlers(restartBtn, {
      onClick: () => {
        GameTournamentPage.game.gameRestart();
        pageContainer.update({styles: {
          backgroundColor: "rgba(0, 0, 0, 0)",
          position: "fixed",

        }})
        restartBtn.update({styles: {display: "none"}});
        backBtn.update({styles: {display: "none"}});
        GameTournamentPage.game.gameStart();
      }
    });

    withEventHandlers(backBtn, {
      onClick: () => {
        window.router.navigate("/");
      }
    });

    pageContainer.elements = [
      p1Input,
      p2Input,
      p1name,
      skor,
      winnerText,
      p2name,
      startBtn,
      restartBtn,
      backBtn,
    ];
    return pageContainer.render();
  }
}

export default GameTournamentPage;
