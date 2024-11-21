import { Config } from "../config.js";
import { store } from "../utils/reactive.js";
import { Component } from "../utils/component.js";
import { Template } from "../utils/temp.js";

export class Auth extends Component {
  constructor() {
    const templatePath = `${Config.paths.page}auth.html`;
    super(templatePath);

    // Initialize template loading immediately
    this.templateLoaded = this.loadTemplate(templatePath);

    // Wrap score in an object to match template syntax
    this.score = store.$state({ value: 0 });
    this.element = null;
  }

  async loadTemplate(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load template: ${path}`);
      }
      this.templateString = await response.text();
      return true;
    } catch (error) {
      console.error("Template loading error:", error);
      return false;
    }
  }

  async render() {
    try {
      // Ensure template is loaded first
      await this.templateLoaded;

      if (!this.templateString) {
        throw new Error("Template not loaded");
      }

      const processedTemplate = this.constructor.Template.processTemplate(
        this.templateString,
        { score: this.score.value }, // Pass value directly
      );

      // Create a container element
      const container = document.createElement("div");
      container.innerHTML = processedTemplate;

      // Get the first child element or use the container
      this.element = container.firstElementChild || container;

      // Bind events
      this.bindEvents();

      console.log("Auth Component Rendered:", this.element);

      return this.element;
    } catch (error) {
      console.error("Render error:", error);

      // Fallback error element
      const errorEl = document.createElement("div");
      errorEl.textContent = `Render Error: ${error.message}`;
      return errorEl;
    }
  }

  bindEvents() {
    if (!this.element) return;

    const incrementBtn = this.element.querySelector("#incrementBtn");
    if (incrementBtn) {
      incrementBtn.addEventListener("click", () => {
        this.score.value++;
        // Re-render or update the view if necessary
        this.render();
      });
    }
  }
}

Auth.Template = Template;
export default Auth;
