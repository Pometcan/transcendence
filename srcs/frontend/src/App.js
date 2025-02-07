// App.js
import HomePage from "./pages/HomePage";
import Page404 from "./pages/404Page";
import Layout from "./pages/Layout";
import AuthPage from "./pages/AuthPage";
import AboutPage from "./pages/AboutPage";
import { PageManager } from "./core/managers/PageManager";
import Router from "./core/Router";
import { getCookie,setCookie } from "./core/Cookie";
import { init, changeLanguage} from "./i42n.js";
/*import enJson from "../assets/images/locales/en.json";
import trJson from "../assets/images/locales/tr.json";
import deJson from "../assets/images/locales/de.json";*/

export class App extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.pageManager = new PageManager(this.shadowRoot, Layout);
    this.router = new Router(this.pageManager);

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

  async connectedCallback() {
    await this.initLanguage();
    await new Promise(resolve => setTimeout(resolve, 3000));
    if (getCookie("login") === "true")
      this.router.handleRoute("/");
    else
      this.router.navigate("/auth");
  }

  async initLanguage() {
      const translations = {};

      try {
          const enResponse = await fetch('../assets/locales/en.json');
          translations.en = await enResponse.json();
          const trResponse = await fetch('../assets/locales/tr.json');
          translations.tr = await trResponse.json();
          const jaResponse = await fetch('../assets/locales/ja.json');
          translations.ja = await jaResponse.json();
          init({ translations: translations, defaultLanguage: ["en",  "ja", "tr"]});
          setCookie("lang", navigator.language.split("-")[0], 1);
          changeLanguage(getCookie("lang"));
      } catch (error) {
          console.error("Language files could not be loaded:", error);
      }
  }
}

customElements.define("ft-transcendence", App);
