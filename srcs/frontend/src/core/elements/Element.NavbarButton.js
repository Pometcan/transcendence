import { ButtonComponent } from "../components/UIComponent.Button";

const NavbarButton = (id, text) => {
  return new ButtonComponent(id, {
    class: 'navbar-button',
    styles: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      fontSize: '1.2em',
      padding: '0.5em 1em',
    },
    label: text,
  });
}

export default NavbarButton;
