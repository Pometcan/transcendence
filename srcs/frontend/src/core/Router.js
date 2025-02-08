// Router.js
export default class Router {
  constructor(pageManager) {
     this._routes = {};
     this.pageManager = pageManager;
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

  navigate(path) {
    if (this._routes[path]) {
      window.history.pushState({}, "", path);
      this.selectedPage = path;
      this.handleRoute(path);
    }
  }

  getSelectedPage() {
    return this.selectedPage;
  }

  get routes() {
    return this._routes;
  }

  handleRoute(path) {
      const fullUrl = window.location.href; // Tam URL'yi al
      const urlParams = new URLSearchParams(window.location.search); // Query parametrelerini ayrıştır

      const pageId = this._routes[path];
      this.selectedPage = path;
      if (pageId) {
        this.pageManager.setActivePage(pageId, urlParams); // Parametreleri setActivePage'e ilet
      } else {
        if (this._routes["/404"]) {
          this.pageManager.setActivePage("/404", urlParams); // 404 sayfası için de parametreleri iletmek isteyebilirsiniz
        }
      }
    }
}
