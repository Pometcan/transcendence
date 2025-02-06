// HomePage.js
import { DivComponent, TextComponent, withEventHandlers } from '../core/components/Type.Component.js';
import MenuElement from '../core/elements/Element.Menu.js';

const HomePage = {
  layoutVisibility: true,
  render: () => {
    const pageContainer = MenuElement("homePage");
    const title = new TextComponent("homeTitle", { text: "Ana Sayfa" });
    const content = new TextComponent("homeContent", { text: "Burası ana sayfa içeriği." });

    const exitBtn = new TextComponent("exitBtn", { text: "Çıkış", class: "btn btn-primary" });
    pageContainer.elements[0].elements = [
      title,
      content,
      exitBtn
    ];

    const renderedPage = pageContainer.render();
    return renderedPage;
  }
};

export default HomePage;
