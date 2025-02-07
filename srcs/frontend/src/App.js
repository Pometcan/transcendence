// App.js
import HomePage from "./pages/HomePage";
import Page404 from "./pages/404Page";
import Layout from "./pages/Layout";
import AuthPage from "./pages/AuthPage";
import AboutPage from "./pages/AboutPage";
import { PageManager } from "./core/managers/PageManager";
import Router from "./core/Router";
import { getCookie,setCookie } from "./core/Cookie";

export class App extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.pageManager = new PageManager(this.shadowRoot, Layout);
    this.router = new Router(this.pageManager);
    this.getCsrf();

    window.router = this.router;

    this.loadPages();
    this.initRouter();

    this.loadCSS();
  }

  initRouter() {
    this.router.addRoute("/", "homePage");
    this.router.addRoute("/about", "aboutPage");
    this.router.addRoute("/auth", "authPage");
    this.router.addRoute("/404", "/404");
  }

  loadPages() {
    this.pageManager.addPage("homePage", HomePage);
    this.pageManager.addPage("aboutPage", AboutPage);
    this.pageManager.addPage("authPage", AuthPage);
    this.pageManager.addPage("/404", Page404);
  }

  loadCSS() {
    const link = document.createElement('link');
    const animate = document.createElement('link');
    const bootstrapCSS = document.createElement('link');
    const bootstrapJS = document.createElement('script');
    link.rel = 'stylesheet';
    link.href = '../app.css';
    animate.rel = 'stylesheet';
    animate.href = 'src/css/Animation.css';
    bootstrapCSS.rel = 'stylesheet';
    bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
    bootstrapJS.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
    this.shadowRoot.appendChild(link);
    this.shadowRoot.appendChild(animate);
    this.shadowRoot.appendChild(bootstrapCSS);
    this.shadowRoot.appendChild(bootstrapJS);
  }

  connectedCallback() {
    if (getCookie("login") === "true")
      this.router.handleRoute("/");
    else
      this.router.navigate("/auth");
  }

  async getCsrf() {
    fetch(`https://${window.location.host}/api/users/csrf/`, {
        method: "GET",
        credentials: "include",
        headers: {
            Accept: "application/json",
        },
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("CSRF Token:", data.csrfToken);
      setCookie('csrftoken', data.csrfToken, 1);
    })
    .catch((error) => console.error("Error:", error));
  }
}

customElements.define("ft-transcendence", App);
