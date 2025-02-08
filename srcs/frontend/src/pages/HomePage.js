// HomePage.js
import { ButtonComponent, DivComponent, TextComponent, withEventHandlers } from '../core/components/Type.Component.js';
import MenuElement from '../core/elements/Element.Menu.js';
import {eraseCookie} from '../core/Cookie.js';

let sayac = 0; // Örnek bir değişken

const HomePage = {
  layoutVisibility: true,
  render: () => {
    const pageContainer = MenuElement("homePage");
    const title = new TextComponent("homeTitle", { text: "Ana Sayfa" });
    const content = new TextComponent("homeContent", { text: `Sayaç Değeri: ${sayac}` }); // Değişkeni içeriğe yansıt

    const arttirBtn = new ButtonComponent("arttirBtn", { label: "Sayacı Arttır", class: "btn btn-primary" });
    const exitBtn = new ButtonComponent("exitBtn", { label: "Çıkış", class: "btn btn-primary" });
    pageContainer.elements[0].elements = [
      title,
      content,
      arttirBtn,
      exitBtn
    ];

    withEventHandlers(exitBtn, { onClick: () => {
        eraseCookie("login");
        window.router.navigate("/auth");
      }
    });

    withEventHandlers(arttirBtn, { onClick: () => {
        sayac++;
        content.update({text: `Sayaç Değeri: ${sayac}`});
      }
    });

    const renderedPage = pageContainer.render();
    return renderedPage;
  }
};

export default HomePage;
