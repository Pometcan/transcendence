export class Router {
  constructor(routes) {
    this.routes = routes;
    this.rootElem = document.getElementById("app");

    // Bind methods to ensure correct context
    this.navigate = this.navigate.bind(this);
    this.render = this.render.bind(this);

    // Set up event listeners
    window.addEventListener("popstate", this.render);
    document.addEventListener("click", this.handleLinkClick.bind(this));

    // Initial render
    this.render();
  }

  handleLinkClick(e) {
    const link = e.target.closest("[data-link]");
    if (link) {
      e.preventDefault();
      this.navigate(link.href);
    }
  }

  async render() {
    const path = window.location.pathname;
    const route = this.routes[path] || this.routes[404];

    // Ensure route exists
    if (!route) {
      console.error(`No route found for path: ${path}`);
      return;
    }

    try {
      // Instantiate the component
      const componentInstance = await (typeof route.component === "function"
        ? route.component()
        : route.component);

      console.log("Component Instance:", componentInstance);

      // Clear previous content
      this.rootElem.innerHTML = "";

      // Determine how to render the component
      let renderedElement;
      if (componentInstance instanceof Node) {
        // If it's already a Node, use it directly
        renderedElement = componentInstance;
      } else if (
        componentInstance.render &&
        typeof componentInstance.render === "function"
      ) {
        // If it has a render method, call it
        renderedElement = await componentInstance.render();
      } else {
        // If it's not a Node and doesn't have a render method
        console.error("Invalid component: cannot render", componentInstance);
        renderedElement = document.createElement("div");
        renderedElement.textContent = "Error rendering component";
      }

      // Validate the rendered element
      if (!(renderedElement instanceof Node)) {
        console.error("Rendered element is not a Node:", renderedElement);
        renderedElement = document.createElement("div");
        renderedElement.textContent = "Error: Invalid component rendering";
      }

      console.log("Rendered Element:", renderedElement);

      // Append the rendered element
      this.rootElem.appendChild(renderedElement);
    } catch (error) {
      console.error("Routing error:", error);

      // Fallback error handling
      this.rootElem.innerHTML = `
        <div style="color: red;">
          <h2>Routing Error</h2>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  navigate(url) {
    window.history.pushState(null, null, url);
    this.render();
  }
}
