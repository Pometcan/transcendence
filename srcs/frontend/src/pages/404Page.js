// pages/404Page.js
import { DivComponent, SVGComponent} from '../core/components/Type.Component.js';

const Page404 = {
  layoutVisibility: false,
  render: () => {
    const pageContainer = new DivComponent("404Page", { class: "404-page" });
    const svg = new SVGComponent("404SVG", {
      data: "https://cdn.svgator.com/images/2022/01/404-svg-animation.svg",
      class: "404-svg" ,
      styles: {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: 0.95,
        pointerEvents: 'none',
      }
    });
    pageContainer.elements = [
      svg
    ];
    return pageContainer.render();
  }
};
export default Page404;
