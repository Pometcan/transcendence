import {MenuElement, SubmitButton} from "../core/elements/Type.Element";
import {withEventHandlers} from "../core/components/Type.Component";
function singleMenu()
{
  const vs11 = SubmitButton("vs11", "1 vs 1");
  vs11.styles = {
    margin: "10px 10px 10px 0",
    backgroundColor: "Olive",
  }
  const vs22 = SubmitButton("vs22", "2 vs 2");
  vs22.styles = {
    margin: "10px 10px 10px 0",
    backgroundColor: "green",
  }
  const tournament = SubmitButton("tournament", t("homePage.Tournament"));
  tournament.styles = {
    margin: "10px 10px 10px 0",
    backgroundColor: "Navy",
  }
  const back = SubmitButton("back", t("homePage.back"));
  back.styles = {
    margin: "10px 10px 10px 0",
  }
  withEventHandlers(vs11, { onClick: () => window.router.navigate("/gamelocal") });
  withEventHandlers(vs22, { onClick: () => window.router.navigate("/gamelocal4p") });
  withEventHandlers(tournament, { onClick: () => window.router.navigate("/gametournament") });
  withEventHandlers(back, { onClick: () => window.router.navigate("/") });

  return [vs11, vs22, tournament, back];
}

const HomePage = {
  layoutVisibility: true,
  pageBack: () => {
  },
  pageNext: () => {
  },
  render:  () => {
    const pageContainer = MenuElement("FriendPage");

    const singlePlayerButton = SubmitButton("singlePlayerButton",  t("homePage.single") );
    singlePlayerButton.styles = {
      margin: "10px 10px 10px 0",
    };

    const multiPlayerButton = SubmitButton("multiPlayerButton", t("homePage.multiplayer") );
    multiPlayerButton.styles = {
      margin: "10px 10px 10px 0",
      backgroundColor: "green",
    };

    pageContainer.elements[0].elements = [
      singlePlayerButton,
      multiPlayerButton,
    ];

    withEventHandlers(singlePlayerButton, { onClick: () => {
      pageContainer.elements[0].update({elements: singleMenu()});
    }});

    withEventHandlers(multiPlayerButton, { onClick: () => {
      window.router.navigate("/gamep2");
    }});

    return pageContainer.render();
  }
}


export default HomePage;
