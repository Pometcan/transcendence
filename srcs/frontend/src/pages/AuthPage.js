import MenuElement from '../core/elements/Element.Menu.js';
import {ButtonComponent,  withEventHandlers } from '../core/components/Type.Component.js';
import { setCookie } from '../core/Cookie.js';

const LoginElement = {

}

const AuthPage = {
  layoutVisibility: false,
  render: () => {
    const pageContainer = MenuElement("authPage");
    const btn = new ButtonComponent("authButton", { label: "Login" });
    pageContainer.elements[0].elements = [
      btn
    ];

    withEventHandlers(btn, { onClick: () => {
        setCookie("login", "true", 1);
        window.router.navigate("/");
      }
    });

    const renderedPage = pageContainer.render(); // Burayı ekledik!
    return renderedPage; // Render edilmiş DOM elementini döndürüyoruz
  }
};

export default AuthPage;
