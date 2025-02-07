// MenuManager.js
export class MenuManager {
  constructor(containerElement) {
    this.menus = new Map();
    this.previousMenu = null;
    this.activeMenu = null;
    this.containerElement = containerElement;
  }

  listMenus() {
    return Array.from(this.menus.values);
  }

  addMenu(menu) {
    this.menus.set(menu.id, menu);
  }

  getActiveMenu() {
    return this.menus.get(this.activeMenu);
  }

  setActiveMenu(menuId) {
    if (this.activeMenu) {
      const currentMenu = this.menus.get(this.activeMenu);
      if (currentMenu && currentMenu.element && currentMenu.element.parentNode === this.containerElement) {
        this.containerElement.removeChild(currentMenu.element);
      }
    }

    this.activeMenu = menuId;
    const newMenu = this.menus.get(menuId);

    if (newMenu) {
      newMenu.active = true;
      if (newMenu.transitionIn) {
        newMenu.transitionIn();
      }
      if (newMenu.render) {
        const menuElement = newMenu.render();
        newMenu.element = menuElement;
        this.containerElement.appendChild(menuElement);
      }
    }
  }

  previous() {
    if (this.previousMenu) {
      this.switchMenu(this.previousMenu);
    }
  }

  switchMenu(menuId) {
    if (this.activeMenu) {
      const currentMenu = this.menus.get(this.activeMenu);
      if (currentMenu && currentMenu.element && currentMenu.element.parentNode === this.containerElement) {
        this.containerElement.removeChild(currentMenu.element);
      }
      this.previousMenu = this.activeMenu;
    }

    const newMenu = this.menus.get(menuId);
    if (newMenu) {
      this.activeMenu = menuId;
      newMenu.active = true;
      if (newMenu.transitionIn) {
        newMenu.transitionIn();
      }
      if (newMenu.render) {
        const menuElement = newMenu.render();
        newMenu.element = menuElement
        this.containerElement.appendChild(menuElement);
      }
    }
  }

  removeMenu(menuId) {
    const menu = this.menus.get(menuId);
    if (menu && menu.element && menu.element.parentNode === this.containerElement) {
      this.containerElement.removeChild(menu.element);
      this.menus.delete(menuId);
    }
  }

  clearMenus() {
    this.menus.forEach(menu => {
      if (menu.element && menu.element.parentNode === this.containerElement) {
        this.containerElement.removeChild(menu.element);
      }
    });
    this.menus.clear();
  }
}
