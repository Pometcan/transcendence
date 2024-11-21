export class Config {
  static configs = {
    development: {
      basePath: "/home/pomet/project/web/trans/srcs/frontend/",
      apiUrl: "http://localhost:8000",
    },
    production: {
      //basePath: "/usr/share/nginx/html/",
      basePath: "http://tr.kirit00.com/",
      apiUrl: "http://api.kirit00.com/",
    },
  };

  static get paths() {
    const { basePath } = this.configs.production;
    return {
      css: `${basePath}css/`,
      js: `${basePath}js/`,
      component: `${basePath}js/component/`,
      lib: `${basePath}js/lib/`,
      page: `${basePath}page/`,
      utils: `${basePath}js/utils/`,
      static: `${basePath}static/`,
      img: `${basePath}static/img/`,
      fonts: `${basePath}static/fonts/`,
      mainHTML: `${basePath}index.html`,
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

  static features = {
    enableLogging: true,
    enablePerformanceTracking: false,
  };
}
