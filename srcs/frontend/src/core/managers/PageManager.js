// src/core/managers/PageManager.js
export class PageManager {
  constructor(containerElement, layout) {
    this.pages = new Map();
    this.activePage = null;
    this.containerElement = containerElement;
    this.layout = layout;
    this.layoutElement = null;
  }

  addPage(pageId, pageComponent) {
    this.pages.set(pageId, pageComponent);
  }

  getActivePage() {
    return this.pages.get(this.activePage);
  }

  setActivePage(pageId, urlParams) { // urlParams argümanı eklendi
    if (this.activePage) {
      const currentPage = this.pages.get(this.activePage);
      if (currentPage && currentPage.element) {
        const contentContainer = this.layoutElement ? this.layoutElement.querySelector("#page-content-container") : this.containerElement;
        if (contentContainer && currentPage.element.parentNode === contentContainer) {
          contentContainer.removeChild(currentPage.element);
        } else if (!this.layoutElement && currentPage.element.parentNode === this.containerElement) {
          this.containerElement.removeChild(currentPage.element);
        }
      }
    }

    this.activePage = pageId;
    const newPage = this.pages.get(pageId);

    if (newPage) {
      newPage.active = true;
      if (newPage.render) {
        // urlParams'ı render fonksiyonuna geçir
        const pageElement = newPage.render(urlParams);
        newPage.element = pageElement;
        pageElement.classList.add('page');

        if (newPage.layoutVisibility !== false) {
          if (!this.layoutElement) {
            this.layoutElement = this.layout.render();
            this.containerElement.appendChild(this.layoutElement);
          }
          const contentContainer = this.layoutElement.querySelector("#page-content-container");
          if (contentContainer) {
            contentContainer.appendChild(pageElement);
          } else {
            this.containerElement.appendChild(pageElement);
          }
          this.layoutElement.style.display = '';
        } else {
          if (this.layoutElement) {
            this.containerElement.removeChild(this.layoutElement);
            this.layoutElement = null;
          }
          this.containerElement.appendChild(pageElement);
        }
      }
    }
  }

  removePage(pageId) {
    const page = this.pages.get(pageId);
    if (page && page.element && page.element.parentNode === this.containerElement) {
      this.containerElement.removeChild(page.element);
      this.pages.delete(pageId);
    }
  }

  clearPages() {
    this.pages.forEach(page => {
      if (page.element && page.element.parentNode === this.containerElement) {
        this.containerElement.removeChild(page.element);
      }
    });
    this.pages.clear();
  }
}
