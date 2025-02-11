// pages/Layout.js
import { DivComponent, ButtonComponent, withEventHandlers } from '../core/components/Type.Component.js';
import { Navbar, NavbarButton} from '../core/elements/Type.Element.js';
import { t } from "../i42n";

const Layout = {
  render: () => {
    const layoutContainer = new DivComponent("layout-container", {});
    const navbar = Navbar("navbar");
    navbar.class += "m-4 ";
    navbar.elements[0].class += "container text-center";

    const row = new DivComponent("row", { class: "row" });
    const col = new DivComponent("col", { class: "col" });
    row.elements = [col];
    navbar.elements[0].elements = [
      row,
    ];

    const homeButton = NavbarButton("home-button", t("Layout.home"));
    const profileButton = NavbarButton("profile-button", t("Layout.Profile"));
    const friendsButton = NavbarButton("friends-button", t("Layout.Friends"));
    const dashboardButton = NavbarButton("dashboard-button", t("Layout.Dashboard"));
    withEventHandlers(homeButton, { onClick: () => window.router.navigate("/") });
    withEventHandlers(profileButton, { onClick: () => window.router.navigate("/profile") });
    withEventHandlers(friendsButton, { onClick: () => window.router.navigate("/friends") });
    withEventHandlers(dashboardButton, {onClick: () => window.router.navigate("/dashboard")})
    col.elements = [homeButton, friendsButton, profileButton, dashboardButton];

    const pageContentContainer = new DivComponent("page-content-container", {});
    layoutContainer.elements = [
      navbar,
      pageContentContainer
    ];

    const renderedLayout = layoutContainer.render();
    return renderedLayout;
  }
};

export default Layout;
