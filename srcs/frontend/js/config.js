export class Config {
  //static basePath = "/usr/share/nginx/html/";
  static configs = {
    development: {
      basePath: "/home/dev/project/frontend/",
      apiUrl: "http://localhost:8000",
    },
    production: {
      basePath: "/usr/share/nginx/html/",
      apiUrl: "http://localhost:8000",
    },
  };
  basePath =
    Config.configs[Config.env.isDevelopment ? "development" : "production"]
      .basePath;
  apiUrl =
    Config.configs[Config.env.isDevelopment ? "development" : "production"]
      .apiUrl;

  static get paths() {
    return {
      css: `${this.basePath}css/`,
      html: `${this.basePath}html/`,
      js: `${this.basePath}js/`,
      component: `${this.basePath}js/component/`,
      lib: `${this.basePath}js/lib/`,
      page: `${this.basePath}js/page/`,
      static: `${this.basePath}static/`,
      img: `${this.basePath}static/img/`,
      fonts: `${this.basePath}static/fonts/`,
      mainHTML: `${this.basePath}index.html`,
    };
  }

  static resolvePath(subPath) {
    return `${this.basePath}${subPath}`;
  }

  static languageCache = new Map();

  static async loadLanguage(language, page) {
    const cacheKey = `${language}-${page}`;
    if (this.languageCache.has(cacheKey)) {
      return this.languageCache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.basePath}js/lang/${language}.json`);
      if (!response.ok) {
        throw new Error(`Language file could not be loaded: ${language}.json`);
      }

      const data = await response.json();
      const pageTranslations = data[page] || {};

      this.languageCache.set(cacheKey, pageTranslations);

      return pageTranslations;
    } catch (error) {
      console.error("Language loading error:", error);
      return {};
    }
  }

  static env = {
    isDevelopment: window.location.hostname === "localhost",
    apiBaseUrl:
      window.location.hostname === "localhost"
        ? "http://localhost:8000/api"
        : "/api",
  };

  static features = {
    enableLogging: true,
    enablePerformanceTracking: false,
  };
}
