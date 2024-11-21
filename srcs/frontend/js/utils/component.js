// js/utils/component.js
import { Template } from "./temp.js";

export class Component {
  constructor(templatePath) {
    console.log("Component constructor called", { templatePath });
    this.templatePath = templatePath;
    this.element = null;
    this.templateString = null;
  }

  async loadTemplate() {
    console.log("Load template called", { path: this.templatePath });
    if (!this.templateString) {
      try {
        const response = await fetch(this.templatePath);
        if (!response.ok) {
          throw new Error(`Failed to load template: ${this.templatePath}`);
        }
        this.templateString = await response.text();
        console.log("Template loaded", { template: this.templateString });
      } catch (error) {
        console.error("Template loading error:", error);
        this.templateString = `<div>Error loading template: ${this.templatePath}</div>`;
      }
    }
    return this.templateString;
  }

  async render(data = {}) {
    console.log("Component render called", { data });

    // Ensure Template is imported correctly
    if (!Template || typeof Template.processTemplate !== "function") {
      console.error("Template import failed", { Template });
      throw new Error("Template module failed to import");
    }

    // Load template if not already loaded
    await this.loadTemplate();

    // Ensure we always return a valid node
    const processedTemplate = Template.processTemplate(
      this.templateString,
      data,
    );
    const div = document.createElement("div");
    div.innerHTML = processedTemplate;

    // Return the first child element, or the div if no child exists
    return div.firstElementChild || div;
  }
}
