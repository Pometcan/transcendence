import { DivComponent } from "../core/components/UIComponent.Div.js";
import { TextComponent } from "../core/components/UIComponent.Text";
import { withEventHandlers } from "../core/components/UIComponent.Util.js";
import { SubmitButton, InputElement } from "../core/elements/Type.Element.js";
import Game3D from "../core/game/Game3D.js";
import confetti from 'https://cdn.skypack.dev/canvas-confetti';
import Router from "../core/Router.js";
import GameTournamentPage from "./GameTournamentPage.js";

const GameLocalPage = {
  layoutVisibility: false,
  gameRound1: null,
  gameRound2: null,
  gameRound3: null,
  player1Name: "",
  player2Name: "",
  player3Name: "",
  player4Name: "",
  winner1: "", // Store winner name of round 1
  winner2: "", // Store winner name of round 2
  finalWinner: "",
  currentGameRound: 0,

  pageLoad: () => {
  },

  pageLeave: () => {
    console.log("GameLocalPage.pageLeave");
    GameLocalPage.destroyGame();
  },

  destroyGame: () => {
    if (GameLocalPage.gameRound1) {
      GameLocalPage.gameRound1.gameDestroy();
      GameLocalPage.gameRound1 = null;
    }
    if (GameLocalPage.gameRound2) {
      GameLocalPage.gameRound2.gameDestroy();
      GameLocalPage.gameRound2 = null;
    }
    if (GameLocalPage.gameRound3) {
      GameLocalPage.gameRound3.gameDestroy();
      GameLocalPage.gameRound3 = null;
    }
  },

  startGameRound: (roundNumber) => {
    GameLocalPage.currentGameRound = roundNumber;
    let currentGame = null;
    let p1Name = "";
    let p2Name = "";

    if (roundNumber === 1) {
      currentGame = GameLocalPage.gameRound1;
      p1Name = GameLocalPage.player1Name;
      p2Name = GameLocalPage.player2Name;
    } else if (roundNumber === 2) {
      currentGame = GameLocalPage.gameRound2;
      p1Name = GameLocalPage.player3Name;
      p2Name = GameLocalPage.player4Name;
    } else if (roundNumber === 3) {
      currentGame = GameLocalPage.gameRound3;
      p1Name = GameLocalPage.winner1; // Use winner name from round 1
      p2Name = GameLocalPage.winner2; // Use winner name from round 2
    }

    if (currentGame) {
      currentGame.gameStart();
      const p1nameElem = document.getElementById("p1name");
      const p2nameElem = document.getElementById("p2name");
      if (p1nameElem) p1nameElem.innerText = p1Name;
      if (p2nameElem) p2nameElem.innerText = p2Name;
    }
  },


  render: () => {
    const pageContainer = new DivComponent("FriendPage", {
      class: "d-flex flex-column",
      styles: {
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: "20px",
        borderRadius: "10px",
      }
    });

    const startBtn = SubmitButton("startBtn", "Start Tournament");
    const skor = new TextComponent("skor", { text: "0 - 0", class: "text-center element-h2", styles: { display: "none" } });
    const p1Input = InputElement("p1Input", "1 Player Name", "text");
    const p2Input = InputElement("p2Input", "2 Player Name", "text");
    const p3Input = InputElement("p3Input", "3 Player Name", "text");
    const p4Input = InputElement("p4Input", "4 Player Name", "text");
    const p1name = new TextComponent("p1name", {
      text: "Player 1", class: "text-center element-h2",
      styles: {
        display: "none",
        position: "absolute",
        top: "30px",
        left: "30px"
      }
    });
    const p2name = new TextComponent("p2name", {
      text: "Player 2", class: "text-center element-h2",
      styles: {
        display: "none",
        position: "absolute",
        top: "30px",
        right: "30px"
      }
    });
    const winnerText = new TextComponent("winnerText", { text: "", class: "text-center element-h2", styles: { display: "none" } });
    const restartBtn = SubmitButton("restartBtn", "Restart Tournament");
    restartBtn.styles = { display: "none", margin: "10px", backgroundColor: "green" };
    const backBtn = SubmitButton("backBtn", "Back");
    backBtn.styles = { margin: "10px", backgroundColor: "gray" };

    withEventHandlers(startBtn, {
      onClick: () => {
        if (p1Input.elements[0].value === "" || p2Input.elements[0].value === "" || p3Input.elements[0].value === "" || p4Input.elements[0].value === "") {
          startBtn.update({ label: "Enter All Names" });
          return;
        }
        GameLocalPage.player1Name = p1Input.elements[0].value;
        GameLocalPage.player2Name = p2Input.elements[0].value;
        GameLocalPage.player3Name = p3Input.elements[0].value;
        GameLocalPage.player4Name = p4Input.elements[0].value;

        GameLocalPage.startGameRound(1);

        pageContainer.update({
          styles: {
            position: "absolute",
            top: "30px",
            width: "100%",
            justifyContent: "space-between",
            transform: "translate(-50%, 0)",
            backgroundColor: "rgba(0, 0, 0, 0)"
          }
        });
        startBtn.update({ styles: { display: "none" } });
        p1Input.update({ styles: { display: "none" } });
        p2Input.update({ styles: { display: "none" } });
        p3Input.update({ styles: { display: "none" } });
        p4Input.update({ styles: { display: "none" } });
        backBtn.update({ styles: { display: "none" } });
        winnerText.update({ styles: { display: "none" } });
        skor.update({ styles: { display: "block" } });
        p1name.update({ text: GameLocalPage.player1Name, styles: { display: "block" } });
        p2name.update({ text: GameLocalPage.player2Name, styles: { display: "block" } });
      }
    });

    GameLocalPage.gameRound1 = new Game3D({ inputMode: "local" });
    GameLocalPage.gameRound2 = new Game3D({ inputMode: "local" });
    GameLocalPage.gameRound3 = new Game3D({ inputMode: "local" });

    const commonGameHandlers = (gameInstance) => {
      gameInstance.onScoreChange = (score) => {
        skor.update({ text: `${score.p1} - ${score.p2}` });
      };
    };

    commonGameHandlers(GameLocalPage.gameRound1);
    commonGameHandlers(GameLocalPage.gameRound2);
    commonGameHandlers(GameLocalPage.gameRound3);


    GameLocalPage.gameRound1.onGameEnd = (winner) => {
      skor.update({ text: `${GameLocalPage.gameRound1.score.p1} - ${GameLocalPage.gameRound1.score.p2}` });
      confetti();
      if (winner === "p1") {
        GameLocalPage.winner1 = GameLocalPage.player1Name; // Store player 1's name if p1 wins
      } else {
        GameLocalPage.winner1 = GameLocalPage.player2Name; // Store player 2's name if p2 wins
      }
      GameLocalPage.gameRound1.gameDestroy();


      p1name.update({ text: GameLocalPage.player3Name });
      p2name.update({ text: GameLocalPage.player4Name });
      GameLocalPage.startGameRound(2);

    };

    GameLocalPage.gameRound2.onGameEnd = (winner) => {
      skor.update({ text: `${GameLocalPage.gameRound2.score.p1} - ${GameLocalPage.gameRound2.score.p2}` });
      confetti();
      if (winner === "p1") {
        GameLocalPage.winner2 = GameLocalPage.player3Name; // Store player 3's name if p1 wins
      } else {
        GameLocalPage.winner2 = GameLocalPage.player4Name; // Store player 4's name if p2 wins
      }
      GameLocalPage.gameRound2.gameDestroy();


      p1name.update({ text: GameLocalPage.winner1 }); // Set p1name to winner of round 1
      p2name.update({ text: GameLocalPage.winner2 }); // Set p2name to winner of round 2
      GameLocalPage.startGameRound(3);

    };

    GameLocalPage.gameRound3.onGameEnd = (winner) => {
      skor.update({ text: `${GameLocalPage.gameRound3.score.p1} - ${GameLocalPage.gameRound3.score.p2}` });
      confetti();
      if (winner === "p1") {
        GameLocalPage.finalWinner = GameLocalPage.winner1; // Final winner is winner of round 1
      } else {
        GameLocalPage.finalWinner = GameLocalPage.winner2; // Final winner is winner of round 2
      }
      winnerText.update({ text: `${GameLocalPage.finalWinner} Wins the Tournament!`, styles: { display: "block" } });
      pageContainer.update({
        styles: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }
      });
      restartBtn.update({ styles: { display: "block" } });
      backBtn.update({ styles: { display: "block" } });
      GameLocalPage.gameRound3.gameDestroy();
    };


    withEventHandlers(restartBtn, {
      onClick: () => {
        GameLocalPage.destroyGame();
        GameLocalPage.gameRound1 = new Game3D({ inputMode: "local" });
        GameLocalPage.gameRound2 = new Game3D({ inputMode: "local" });
        GameLocalPage.gameRound3 = new Game3D({ inputMode: "local" });
        commonGameHandlers(GameLocalPage.gameRound1);
        commonGameHandlers(GameLocalPage.gameRound2);
        commonGameHandlers(GameLocalPage.gameRound3);
        GameLocalPage.gameRound1.onGameEnd = GameLocalPage.gameRound1.onGameEnd;
        GameLocalPage.gameRound2.onGameEnd = GameLocalPage.gameRound2.onGameEnd;
        GameLocalPage.gameRound3.onGameEnd = GameLocalPage.gameRound3.onGameEnd;


        pageContainer.update({
          styles: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            position: "relative",
            top: "auto",
            transform: "none",
            justifyContent: "center"
          }
        });
        restartBtn.update({ styles: { display: "none" } });
        backBtn.update({ styles: { display: "none" } });
        winnerText.update({ text: "", styles: { display: "none" } });
        startBtn.update({ styles: { display: "block", label: "Start Tournament" } });
        p1Input.update({ styles: { display: "block", value: "" } });
        p2Input.update({ styles: { display: "block", value: "" } });
        p3Input.update({ styles: { display: "block", value: "" } });
        p4Input.update({ styles: { display: "block", value: "" } });
        skor.update({ styles: { display: "none", text: "0 - 0" } });
        p1name.update({ styles: { display: "none" } });
        p2name.update({ styles: { display: "none" } });
        GameLocalPage.currentGameRound = 0;
        GameLocalPage.winner1 = "";
        GameLocalPage.winner2 = "";
        GameLocalPage.finalWinner = "";
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
      p3Input,
      p4Input,
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
export default GameLocalPage;
