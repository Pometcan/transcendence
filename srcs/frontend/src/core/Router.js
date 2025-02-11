// Router.js
export default class Router {
  constructor(pageManager) {
     this._routes = {};
     this.pageManager = pageManager;
     this.currentPageId = null;

     window.addEventListener("popstate", () =>
       this.handleRoute(window.location.pathname),
     );

     if (!this._routes[window.location.pathname]) {
       this.navigate("/");
     } else {
       this.handleRoute(window.location.pathname);
     }

     this.selectedPage = window.location.pathname;

     document.body.addEventListener("click", (event) => {
       const target = event.target;

       if (target.tagName === "A") {
         const link = target;
         if (link.href && link.href.startsWith(window.location.origin)) {
           event.preventDefault();
           const path = link.getAttribute("href");
           if (path) {
             this.navigate(path);
           } else {
             console.warn("Link has no href attribute.");
           }
         } else {
         }
       }
     });
   }

  addRoute(path, pageId) {
    if (this._routes[path]) {
      return;
    }
    this._routes[path] = pageId;
  }

  navigate(path, params = {}) {
    if (this._routes[path]) {
      if (params) {
        const urlParams = new URLSearchParams(params);
        window.history.pushState({}, "", path + "?" + urlParams.toString());
        this.selectedPage = path;
        this.handleRoute(path);
      }
      else {
        window.history.pushState({}, "", path);
        this.selectedPage = path;
        this.handleRoute(path);
      }
    }
  }

  getSelectedPage() {
    return this.selectedPage;
  }

  get routes() {
    return this._routes;
  }

  handleRoute(path) {
      const fullUrl = window.location.href;
      const urlParams = new URLSearchParams(window.location.search);
      const pageId = this._routes[path];
      const currentPageId = this.pageManager.getActivePageId();
      const currentPage = this.pageManager.getActivePage();

      this.selectedPage = path;
      this.currentPageId = pageId;

      if (pageId) {
        this.pageManager.setActivePage(pageId, urlParams);
      } else {
        if (this._routes["/404"]) {
          this.pageManager.setActivePage("/404", urlParams);
        }
      }

      const nextPage = this.pageManager.getActivePage();
      if (currentPage && currentPage.pageLeave && currentPageId !== pageId) {
         currentPage.pageLeave();
      }

       if (nextPage && nextPage.pageLoad && currentPageId !== pageId) {
         nextPage.pageLoad();
       }
    }
}
