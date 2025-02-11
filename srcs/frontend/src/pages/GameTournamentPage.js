
import { DivComponent } from "../core/components/UIComponent.Div.js";
import { TextComponent } from "../core/components/UIComponent.Text";
import { withEventHandlers } from "../core/components/UIComponent.Util.js";
import { SubmitButton, InputElement } from "../core/elements/Type.Element.js";
import Game3D from "../core/game/Game3D.js";
import confetti from 'https://cdn.skypack.dev/canvas-confetti';
import Router from "../core/Router.js";

const GameTournamentPage = {
  layoutVisibility: false,
  game:null,
  Players: [],
  gamePlayNmes: [],
  /*
    ornek
    {
      "game1": [
        "player7",
        "player2"
      ],
      "game2": [
        "player5",
        "player6"
      ],
      "game3": [
        "player8"
      ],
    }
  */
  rounds: {},
  /*
    ornek
    {
      rounds1: {
        game: {
          plater:[player1, player2]
          skor:[1, 2]
          winner: player2
        }
      }
    }
  */
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
    startBtn.styles = { display: "none", margin: "10px", backgroundColor: "red" };
    const skor = new TextComponent("skor", { text: "0 - 0", class: "text-center element-h2", styles: { display: "none" } });
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
    const createInputsDiv = new DivComponent("createInputsDiv", {styles: {display: "none", class: "d-flex flex-column"}});
    const createInput = InputElement("createInput", "Create Players", "text");
    const createInputs =  SubmitButton("createInputs", "Create Players");
    createInputs.styles = { margin: "10px", backgroundColor: "green" };


    withEventHandlers(createInputs, { onClick: () => {
      const playerCount = createInput.elements[0].value;
      if (playerCount < 2 || playerCount > 8 || isNaN(playerCount)) {
        createInputs.update({styles: {backgroundColor: "red"}, label:"Invalid Entry" });
        return;
      }
      const playerNames = getPlayerNamesInputs(playerCount);
      createInputsDiv.update({elements: playerNames, styles: {display: "block"}});
      startBtn.update({styles: {display: "block", backgroundColor: "blue"}});
      GameTournamentPage.Players = playerNames;
      createInputs.update({styles: {backgroundColor: "green"}, label:"Create Players" });

    }});

    withEventHandlers(startBtn, {
      onClick: () => {
        const playerNames = GameTournamentPage.Players.map(player => player.elements[0].value);
        GameTournamentPage.gamePlayNmes = createRandomGameMatches(playerNames);
        const inputElements = Array.from(createInputsDiv.elements);
        for (const inputElement of inputElements) {
          if (inputElement.elements[0].value.trim() === "") {
            startBtn.update({ label: "Name Please", styles: { backgroundColor: "red" } });
            return;
          }
        }
        startBtn.update({ label: "Start Game", styles: { backgroundColor: "green" } });
        pageContainer.update({styles: {
          position: "absolute",
          top: "30px",
          width: "100%",
          justifyContent: "between",
          transform: "translate(-50%, 0)",
          backgroundColor: "rgba(0, 0, 0, 0)"
        }})
        createInputsDiv.update({styles: {display: "none"}});
        createInput.update({styles: {display: "none"}});
        createInputs.update({styles: {display: "none"}});
        startBtn.update({styles: {display: "none"}});
        backBtn.update({styles: {display: "none"}});
        winnerText.update({styles: {display: "none"}});
        skor.update({styles: {display: "block" }});
        console.log (turnuvaAsamasiEkle(GameTournamentPage.gamePlayNmes, GameTournamentPage.rounds))
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
      createInputsDiv,
      createInput,
      createInputs,
      p1name,
      skor,
      winnerText,
      p1name,
      p2name,
      startBtn,
      restartBtn,
      backBtn,
    ];
    return pageContainer.render();
  }
}

export default GameTournamentPage;

function getPlayerNamesInputs(count)
{
  const playerNames = [];
  for (let i = 0; i < count; i++) {
    const input = InputElement(`playerInput${i}`, `Player Name ${i+1}`, "text");
    playerNames.push(input);
  }
  return playerNames;
}

function createRandomGameMatches(players) {
  if (!players || players.length === 0) {
    return {}; // Boş oyuncu listesi
  }

  const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
  const gameMatches = {};
  let gameCounter = 1;

  while (shuffledPlayers.length > 0) {
    const player1 = shuffledPlayers.shift();
    const player2 = shuffledPlayers.length > 0 ? shuffledPlayers.shift() : null;
    const gameName = `game${gameCounter}`;
    gameMatches[gameName] = player2 ? [player1, player2] : [player1];

    gameCounter++;
  }

  return gameMatches;
}

function turnuvaAsamasiEkle(gamePlayNmes, mevcutRounds) {
  const asamaNumaralari = Object.keys(mevcutRounds)
    .map(key => parseInt(key.replace("rounds", "")))
    .filter(num => !isNaN(num));

  const yeniAsamaNumarasi = asamaNumaralari.length > 0 ? Math.max(...asamaNumaralari) + 1 : 1;
  const yeniAsamaKey = `rounds${yeniAsamaNumarasi}`;

  const oyuncuSayisi = gamePlayNmes.length;
  if (oyuncuSayisi === 0) {
    console.warn("Oyuncu listesi boş. Yeni aşama eklenmedi.");
    return mevcutRounds;
  }

  const eslesmeler = [];

  if (oyuncuSayisi % 2 === 0) {
      // Oyuncuları eşleştir (ikişerli gruplar halinde)
      for (let i = 0; i < oyuncuSayisi; i += 2) {
          eslesmeler.push([gamePlayNmes[i], gamePlayNmes[i + 1]]);
      }
  } else {
      // Tek sayıda oyuncu varsa, son oyuncuyu otomatik olarak bir sonraki aşamaya geçir.
      for (let i = 0; i < oyuncuSayisi - 1; i += 2) {
          eslesmeler.push([gamePlayNmes[i], gamePlayNmes[i + 1]]);
      }
      eslesmeler.push([gamePlayNmes[oyuncuSayisi - 1]]); // Son oyuncuyu tek başına ekle
  }

  // Yeni aşamayı oluştur
  const yeniAsama = {
    game: {} // Oyun detayları buraya gelecek (oyuncular, skorlar, kazanan vb.)
  };

  // Eşleşmeleri yeni aşamaya ekle
  eslesmeler.forEach((eslesme, index) => {
      const oyunAdi = `oyun${index + 1}`; // oyun1, oyun2, ...
      yeniAsama.game[oyunAdi] = {
          players: eslesme,
          skor: [], // Skorlar henüz belli değil
          winner: null // Kazanan henüz belli değil
      };
  });

  // Yeni aşamayı mevcut aşamalara ekle
  mevcutRounds[yeniAsamaKey] = yeniAsama;

  return mevcutRounds;
}
