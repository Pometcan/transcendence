// src/core/components/UIComponent.SVG.js
import UIComponent from "./UIComponent";

export class SVGComponent extends UIComponent {
  constructor(id, props = {}) {
    super(id, props.styles, props.class);
    this.svgContent = props.svgContent;
    this.svgPath = props.svgPath;
    this.svgData = props.data; // Yeni: data prop'u
    this.styles = props.styles;
    this.class = props.class || '';
  }

  render() {
    if (this.element) {
      return this.element;
    }

    let element;

    if (this.svgData) {
      // Eğer data prop'u varsa <object> etiketi oluştur
      element = document.createElement("object");
      element.type = "image/svg+xml";
      element.data = this.svgData; // data prop'unu <object> etiketine ata
    } else {
      // Eğer data prop'u yoksa (svgContent veya svgPath varsa) <svg> etiketi oluştur
      element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      if (this.svgContent) {
        element.innerHTML = this.svgContent;
      } else if (this.svgPath) {
        console.warn("SVGComponent: svgPath özelliği henüz implemente edilmedi.");
      }
    }

    this.element = element;
    element.id = this.id;


    this.applyStyles(element);
    this.applyClasses(element);
    this.applyAttributes(element);

    if (this.transitionIn) {
      this.transitionIn(element);
    }

    return element;
  }

  update(newProps) {
    super.update(newProps);
    if (newProps) {
      if (newProps.svgContent !== undefined) {
        this.svgContent = newProps.svgContent;
        if (this.element)
          this.element.innerHTML = this.svgContent;
      }
      if (newProps.svgPath !== undefined) {
        this.svgPath = newProps.svgPath;
        if (this.element)
          console.warn("SVGComponent: svgPath özelliği henüz implemente edilmedi.");
      }
      if (newProps.svgData !== undefined) {
        this.svgData = newProps.svgData;
        if (this.element)
          this.element.data = this.svgData;
      }
    }
  }
}
