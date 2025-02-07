// HomePage.js
import { ButtonComponent, DivComponent, TextComponent, withEventHandlers } from '../core/components/Type.Component.js';
import MenuElement from '../core/elements/Element.Menu.js';
import {eraseCookie, getCookie} from '../core/Cookie.js';

const HomePage = {
  layoutVisibility: true,
  render: () => {
    if (getCookie("login") !== "true") {
      window.router.navigate("/auth");
      return;
    }
    const pageContainer = MenuElement("homePage");
    const title = new TextComponent("homeTitle", { text: "Ana Sayfa" });
    const content = new TextComponent("homeContent", { text: "Burası ana sayfa içeriği." });

    const exitBtn = new ButtonComponent("exitBtn", { label: "Çıkış", class: "btn btn-primary" });
    pageContainer.elements[0].elements = [
      title,
      content,
      exitBtn
    ];

    withEventHandlers(exitBtn, { onClick: () => {
        eraseCookie("login");
        window.router.navigate("/auth");
      }
    });

    const renderedPage = pageContainer.render();
    return renderedPage;
  }
};

export default HomePage;
