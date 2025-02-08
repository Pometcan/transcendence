import { ButtonComponent, DivComponent, TextComponent, ImageComponent, withEventHandlers } from '../core/components/Type.Component.js';
import {MenuElement, ProfilePhoto, SwitchBox} from '../core/elements/Type.Element.js';
import {eraseCookie, getCookie, getCsrfToken} from '../core/Cookie.js';

// TextComponent örneklerini saklamak için değişkenler
let emailComponent;
let usernameComponent;

const ProfilePage = {
  layoutVisibility: true,
  render: () => {
    const pageContainer = MenuElement("ProfilePage");
    const exitBtn = new ButtonComponent("exitBtn", { label: "Çıkış", class: "btn btn-primary" });
    const deleteBtn = new ButtonComponent("deleteBtn", { label: "Hesabı Sil", class: "btn btn-danger" });
    const photo = ProfilePhoto("profilePhoto" );
    const changePhotoBtn = new ButtonComponent("changePhotoBtn", { label: "Fotoğrafı Değiştir", class: "btn btn-primary" });
    const deletePhotoBtn = new ButtonComponent("deletePhotoBtn", { label: "Fotoğrafı Sil", class: "btn btn-danger" });
    emailComponent = new TextComponent("email", { text: "E-posta: Yükleniyor..." });
    usernameComponent = new TextComponent("username", { text: "Kullanıcı Adı: Yükleniyor..." });
    //const SwitchBox2FA = SwitchBox("FA2","2FA Etkinlestir");
    const fa2btnEnable = new ButtonComponent("fa2btnEnable", { label: "2FA Etkinleştir", class: "btn btn-primary" });
    const fa2btnDisable = new ButtonComponent("fa2btnDisable", { label: "2FA Devre Dışı Bırak", class: "btn btn-danger" });
    getUser()
    .then(user => {
      emailComponent.update({ text: `E-posta: ${user.email}` });
      usernameComponent.update({ text: `Kullanıcı Adı: ${user.username}` });
      photo.elements[0].update({ src: user.avatar });
    }).catch(error => {
      console.error("Veri çekme hatası:", error);
      emailComponent.update({ text: `E-posta: Hata oluştu.` });
      usernameComponent.update({ text: `Kullanıcı Adı: Hata oluştu.` });
    });

    pageContainer.elements[0].elements = [
      exitBtn,
      deleteBtn,
      emailComponent,
      usernameComponent,
      photo,
      changePhotoBtn,
      deletePhotoBtn,
      fa2btnEnable,
      fa2btnDisable,
    ];

    withEventHandlers(fa2btnEnable, { onClick: async() => {
      await fetch(`https://${window.location.host}/api/auth/2fa-enable`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${getCookie('accessToken')}`
        }
        });
      }
    });

    withEventHandlers(fa2btnDisable, { onClick: async() => {
      await fetch(`https://${window.location.host}/api/auth/2fa-disable`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${getCookie('accessToken')}`
        }});
    }});

    withEventHandlers(changePhotoBtn, { onClick: async() => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          const csrfToken = await getCsrfToken();
          const formData = new FormData();
          formData.append('avatar', file);

          await fetch(`https://${window.location.host}/api/auth/avatar/`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "X-CSRFToken": csrfToken,
                "Authorization": `Bearer ${getCookie('accessToken')}`
            },
            body: formData
          });
        }
      };
      fileInput.click();

    }});

    withEventHandlers(deletePhotoBtn, { onClick: async() => {
      const csrfToken = await getCsrfToken();
      await fetch(`https://${window.location.host}/api/auth/avatar/`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrfToken,
            "Authorization": `Bearer ${getCookie('accessToken')}`
        }});
    }});

    withEventHandlers(deleteBtn, { onClick: async() => {
      const csrfToken = await getCsrfToken();

      await fetch(`https://${window.location.host}/api/auth/user-list/${getCookie("userId")}/`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrfToken,
            "Authorization": `Bearer ${getCookie('accessToken')}`
        }
      });
      eraseCookie("login");
      window.router.navigate("/auth");
    }});

    withEventHandlers(exitBtn, { onClick: async() => {
        const csrfToken = await getCsrfToken();
        await fetch(`https://${window.location.host}/api/rest-auth/logout/`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${getCookie('accessToken')}`,
            "X-CSRFToken": csrfToken
          }
        });
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
