import { DivComponent } from "../components/Type.Component.js";

const MenuElement = (id) => {
  const holoplate = new DivComponent(id, {
    styles: {
      background: 'linear-gradient(180.2deg, \
      rgba(0, 0, 0, 0.8) 15%, \
      rgba(100, 100, 100, 0.8) 60%, \
      rgba(0, 40, 100, 0.8) 75%)',
      borderRadius: '10px',
      backgroundSize: '100% 13px',
      backgroundRepeat: 'repeat-y',
      filter: 'contrast(101%)',
      animation: 'holoEffect 1s steps(14) infinite',
      flex: 1,
    },
    class: ""
  });

  const menuContainer = new DivComponent("menuContainer", {
    styles: {
      background: 'rgba(0, 40, 100, 0.2)',
      border: '2px solid rgba(0, 150, 255, 0.5)',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 0 20px rgba(0, 150, 255, 0.5), \
      0 0 40px rgba(0, 150, 255, 0.3), \
      0 0 60px rgba(0, 150, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      animation: 'pulse 2s infinite alternate',
      flex: 1,
    },
    class: ""
  });

  holoplate.elements = [
    menuContainer
  ];

  return holoplate;
}

export default MenuElement;
