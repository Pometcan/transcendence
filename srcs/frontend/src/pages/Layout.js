// pages/Layout.js
import { DivComponent, ButtonComponent, withEventHandlers } from '../core/components/Type.Component.js';
import { Navbar, NavbarButton} from '../core/elements/Type.Element.js';


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

    const homeButton = NavbarButton("home-button", "Home");
    const profileButton = NavbarButton("profile-button", "Profile");
    withEventHandlers(homeButton, { onClick: () => window.router.navigate("/") });
    withEventHandlers(profileButton, { onClick: () => window.router.navigate("/profile") });

    const pageContentContainer = new DivComponent("page-content-container", {});
    col.elements = [homeButton, profileButton];

    layoutContainer.elements = [
      navbar,
      pageContentContainer
    ];

    const renderedLayout = layoutContainer.render();
    return renderedLayout;
  }
};

export default Layout;
