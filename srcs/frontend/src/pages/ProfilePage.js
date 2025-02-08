import { ButtonComponent, DivComponent, TextComponent, withEventHandlers } from '../core/components/Type.Component.js';
import MenuElement from '../core/elements/Element.Menu.js';
import {eraseCookie, getCookie} from '../core/Cookie.js';

// TextComponent örneklerini saklamak için değişkenler
let emailComponent;
let usernameComponent;

const ProfilePage = {
  layoutVisibility: true,
  render: () => {
    const pageContainer = MenuElement("ProfilePage");
    const exitBtn = new ButtonComponent("exitBtn", { label: "Çıkış", class: "btn btn-primary" });
    const deleteBtn = new ButtonComponent("deleteBtn", { label: "Hesabı Sil", class: "btn btn-danger" });

    // TextComponent örneklerini oluştur ve değişkenlere ata
    emailComponent = new TextComponent("email", { text: "E-posta: Yükleniyor..." });
    usernameComponent = new TextComponent("username", { text: "Kullanıcı Adı: Yükleniyor..." });

    getUser()
    .then(user => {
      // TextComponent'lerin text özelliklerini update metodu ile güncelle
      emailComponent.update({ text: `E-posta: ${user.email}` });
      usernameComponent.update({ text: `Kullanıcı Adı: ${user.username}` });
    }).catch(error => {
      console.error("Veri çekme hatası:", error);
      // TextComponent'lerin text özelliklerini update metodu ile hata mesajlarıyla güncelle
      emailComponent.update({ text: `E-posta: Hata oluştu.` });
      usernameComponent.update({ text: `Kullanıcı Adı: Hata oluştu.` });
    });

    pageContainer.elements[0].elements = [
      exitBtn,
      deleteBtn,
      emailComponent, // Güncellenecek TextComponent örneklerini kullan
      usernameComponent // Güncellenecek TextComponent örneklerini kullan
    ];

    withEventHandlers(exitBtn, { onClick: () => {
        eraseCookie("login");
        window.router.navigate("/auth");
      }
    });

    const renderedPage = pageContainer.render();
    return renderedPage;
  },
};

async function getUser() {
  const userId = getCookie('userId');
  try {
    const response = await fetch(`https://${window.location.host}/api/auth/user-list/${userId}/`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getCookie('accessToken')}`
      }
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return {};
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
    return {};
  }
}

export default ProfilePage;
