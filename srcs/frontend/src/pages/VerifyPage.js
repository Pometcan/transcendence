// HomePage.js
import { ButtonComponent, DivComponent, TextComponent,ImageComponent, withEventHandlers } from '../core/components/Type.Component.js';
import MenuElement from '../core/elements/Element.Menu.js';
import {getCookie,setCookie} from '../core/Cookie.js';
import InputElement from '../core/elements/Element.Input.js';
import SubmitButton from '../core/elements/Element.SubmitButton.js';
const errorDiv = new DivComponent("veriftError", { styles: { color: 'red', marginTop: '10px', display: 'none' } });

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
      submitButton,
      errorDiv
    ];

    withEventHandlers(submitButton, {
      onClick: async () => {
        try {
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
          });

          // Response kontrolü
          if (!response.ok) {
            const errorData = await response.json();  // Hata mesajını al
            throw new Error(errorData.message || "Invalid 2FA code");
          }

          // Başarılı giriş
          setCookie('login', 'true', 1);
          window.router.navigate("/");
        } catch (error) {
          // Hata mesajını göster
          errorDiv.element.style.display = 'block';
          errorDiv.update({ text: error.message });
          window.router.navigate("/auth");
        }
      }
    });



    const renderedPage = pageContainer.render();
    return renderedPage;
  }
};

export default VerifyPage;
