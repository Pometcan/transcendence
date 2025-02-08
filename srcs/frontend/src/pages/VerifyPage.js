// HomePage.js
import { ButtonComponent, DivComponent, TextComponent,ImageComponent, withEventHandlers } from '../core/components/Type.Component.js';
import MenuElement from '../core/elements/Element.Menu.js';
import {getCookie,setCookie} from '../core/Cookie.js';
import InputElement from '../core/elements/Element.Input.js';
import SubmitButton from '../core/elements/Element.SubmitButton.js';
let sayac = 0; // Örnek bir değişken

const VerifyPage = {
  layoutVisibility: false,
  render: () => {
    const pageContainer = MenuElement("homePage");
    const qrCode = getCookie("qrCode");
    if (!qrCode) {
      window.router.navigate("/auth");
      return;
    }
    const qrImage = new ImageComponent("qrImage", {src: `data:image/png;base64,${qrCode}`, alt: "qrImage"});

    const input = InputElement("input", "2FA Kodu", "text");
    const submitButton = SubmitButton("submitButton", "Verify");


    pageContainer.elements[0].elements = [
      qrImage,
      input,
      submitButton
    ];

    withEventHandlers(submitButton, { onClick: async() => {
      const response = await fetch(`https://${window.location.host}/api/auth/2fa-verify`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getCookie('accessToken')}`
        },
        body: JSON.stringify({
          "token": input.elements[0].value
        })
      }).then((response) => response.json()).then((data) => {
        if (data.error) {
          console.error("Error:", data.error);
          window.router.navigate("/auth");
        }
        setCookie('login', 'true', 1);
        window.router.navigate("/");
      });
    }});


    const renderedPage = pageContainer.render();
    return renderedPage;
  }
};

export default VerifyPage;
