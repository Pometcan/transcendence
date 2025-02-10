// App.js
import { HomePage, AuthPage, ProfilePage, IntraPage, VerifyPage, FriendPage, Page404, Layout } from "./pages/Type.Page.js";
import { PageManager } from "./core/managers/PageManager";
import { getCookie,setCookie } from "./core/Cookie";
import { init, changeLanguage} from "./i42n.js";
import FriendPage from "./pages/FriendPage.js";
import DashboardPage from "./pages/Dashboard.js";

import Router from "./core/Router";

export class App extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.pageManager = new PageManager(this.shadowRoot, Layout);
    this.router = new Router(this.pageManager);
    this.loadPages();
    this.initRouter();
    this.loadCSS();
    window.pageManager = this.pageManager;
    window.router = this.router;
    window.app = this;
  }

 
  initRouter() {
    const routesConfig = {
      "/": "homePage",
      "/auth": "authPage",
      "/profile": "profilePage",
      "/intra-auth": "IntraPage",
      "/verify": "VerifyPage",
      "/friends": "friendPage",
      "/dashboard":"dashboard"
      "/404": "/404"
    };
    for (const [key, value] of Object.entries(routesConfig)) {
      this.router.addRoute(key, value);
    }
  }

  loadPages() {
    const pageComponents = {
      "homePage": HomePage,
      "authPage": AuthPage,
      "profilePage": ProfilePage,
      "IntraPage": IntraPage,
      "VerifyPage": VerifyPage,
      "friendPage": FriendPage,
      "dashboard": DashboardPage,
      "/404": Page404
    }
    for (const [key, value] of Object.entries(pageComponents)) {
      this.pageManager.addPage(key, value);
    }
  }

  loadCSS() {
    const link = document.createElement('link');
    const animate = document.createElement('link');
    const elements = document.createElement('link');
    const bootstrapCSS = document.createElement('link');
    const bootstrapJS = document.createElement('script');
    link.rel = 'stylesheet';
    link.href = '../app.css';
    animate.rel = 'stylesheet';
    animate.href = 'src/css/Animation.css';
    elements.rel = 'stylesheet';
    elements.href = 'src/css/Elements.css';
    bootstrapCSS.rel = 'stylesheet';
    bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
    bootstrapJS.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
    this.shadowRoot.appendChild(link);
    this.shadowRoot.appendChild(animate);
    this.shadowRoot.appendChild(elements);
    this.shadowRoot.appendChild(bootstrapCSS);
    this.shadowRoot.appendChild(bootstrapJS);
  }

  async connectedCallback() {
    await this.initLanguage();
    //await new Promise(resolve => setTimeout(resolve, 3000));
    if (getCookie("login") === "true")
    {
      const path = window.location.pathname;
      if (path === "/auth")
        this.router.navigate("/");
      else
        this.router.handleRoute(path);
    }
    else
      this.router.navigate("/auth");
  }

  async initLanguage() {
    try {
      const translations = {};
      const enResponse = await fetch('../assets/locales/en.json');
      translations.en = await enResponse.json();
      const trResponse = await fetch('../assets/locales/tr.json');
      translations.tr = await trResponse.json();
      const jaResponse = await fetch('../assets/locales/ja.json');
      translations.ja = await jaResponse.json();
      init({ translations: translations, defaultLanguage: ["en",  "ja", "tr"]});
      if (!getCookie("lang"))
        setCookie("lang", navigator.language.split("-")[0], 1);
      changeLanguage(getCookie("lang"));
    } catch (error) {
      console.error("Language files could not be loaded:", error);
    }
  }
}

customElements.define("ft-transcendence", App);
