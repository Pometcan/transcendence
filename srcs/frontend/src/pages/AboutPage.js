// pages/AboutPage.js
import { DivComponent, TextComponent } from '../core/components/Type.Component.js';

const AboutPage = {
  layoutVisibility: true,
  render: () => {
    const pageContainer = new DivComponent("aboutPage", { class: "page" });
    const title = new TextComponent("aboutTitle", { text: "Hakkımızda"});
    const content = new TextComponent("aboutContent", { text: "Burası hakkımızda sayfası içeriği." });

    pageContainer.elements = [
      title,
      content
    ];

    const renderedPage = pageContainer.render();
    return renderedPage;
  }
};

export default AboutPage;
