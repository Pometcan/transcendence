export default class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = "/";
  }

  // Initialize router and handle the first route
  init() {
    this.onRouteChange();
  }

  // Handle route change based on the current URL hash
  onRouteChange() {
    const hash = window.location.hash.slice(1) || "/"; // Get current route
    const route = this.matchRoute(hash); // Match the route
    if (route) {
      this.renderComponent(route.component, route.params); // Render the matched component
    } else {
      this.renderComponent(this.routes["/404"].component); // Fallback to 404
    }
  }

  // Match a route from the defined routes
  matchRoute(url) {
    for (let path in this.routes) {
      const route = this.routes[path];
      const regex = this.pathToRegExp(path);
      const match = url.match(regex);
      if (match) {
        const params = this.extractParams(path, match);
        return { component: route.component, params };
      }
    }
    return null;
  }

  // Convert path to regular expression
  pathToRegExp(path) {
    const pathParts = path.split("/").filter(Boolean);
    const regexStr = pathParts
      .map((part) => (part.startsWith(":") ? "([^/]+)" : part))
      .join("/");
    return new RegExp(`^${regexStr}$`);
  }

  // Extract dynamic parameters from the URL
  extractParams(path, match) {
    const pathParts = path.split("/").filter(Boolean);
    const params = {};
    match.slice(1).forEach((val, index) => {
      if (pathParts[index].startsWith(":")) {
        const key = pathParts[index].slice(1);
        params[key] = val;
      }
    });
    return params;
  }

  // Render the component for the matched route
  // Render the component for the matched route
  renderComponent(component, params = {}) {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = ""; // Clear previous component

    const newComponent = component(params); // Get the new component
    if (newComponent instanceof Node) {
      // Ensure it's a valid DOM node
      appDiv.appendChild(newComponent); // Append the DOM node
    } else {
      console.error("Component did not return a valid DOM node");
    }
  }
}
