import { ButtonComponent, DivComponent, TextComponent, ImageComponent, withEventHandlers, InputComponent } from '../core/components/Type.Component.js';
import {MenuElement, ProfilePhoto, SwitchBox} from '../core/elements/Type.Element.js';
import {eraseCookie, getCookie, getCsrfToken} from '../core/Cookie.js';

// TextComponent örneklerini saklamak için değişkenler
let emailComponent;
let usernameComponent;

const ProfilePage = {
  layoutVisibility: true,
  render: (params) => {
    const getId = params.get("id");
    const anotherProfile = getId ? true : false;
    const pageContainer = MenuElement("ProfilePage");
    const exitBtn = new ButtonComponent("exitBtn", { label: "Çıkış", class: "btn btn-primary" });
    const editBtn = new ButtonComponent("editButon", {isActive: true, label: "Düzenle", class: "btn btn-warning" });

    const deleteBtn = new ButtonComponent("deleteBtn", { label: "Hesabı Sil", class: "btn btn-danger" });
    const photo = ProfilePhoto("profilePhoto" );
    const changePhotoBtn = new ButtonComponent("changePhotoBtn", { label: "Fotoğrafı Değiştir", class: "btn btn-primary" });
    const deletePhotoBtn = new ButtonComponent("deletePhotoBtn", { label: "Fotoğrafı Sil", class: "btn btn-danger" });
    emailComponent = new TextComponent("email", { text: "E-posta: Yükleniyor..." });
    usernameComponent = new TextComponent("username", { text: "Kullanıcı Adı: Yükleniyor..." });
    
    const editForm = new DivComponent("Edit");
    const usernameLabel = new TextComponent("userNameLabel", { text: "Kullanıcı Adı:", class: "form-label" });
    const usernameInput = new InputComponent("usernameInput");
    const emailLabel = new TextComponent("emailLabel", { text: "E-posta:", class: "form-label" });
    const emailInput = new InputComponent("emailInput");
    const saveFormBtn = new ButtonComponent("save", {label: "Save", class: "btn btn-warning"});

    //const SwitchBox2FA = SwitchBox("FA2","2FA Etkinlestir");
    const fa2btnEnable = new ButtonComponent("fa2btnEnable", { label: "2FA Etkinleştir", class: "btn btn-primary" });
    const fa2btnDisable = new ButtonComponent("fa2btnDisable", { label: "2FA Devre Dışı Bırak", class: "btn btn-danger" });
    if (anotherProfile) {
      exitBtn.styles = { display: "none" };
      deleteBtn.styles = { display: "none" };
      changePhotoBtn.styles = { display: "none" };
      deletePhotoBtn.styles = { display: "none" };
      fa2btnEnable.styles = { display: "none" };
      fa2btnDisable.styles = { display: "none" };
    }
    let rank;
    let is_active;
    let id;
     getUser(anotherProfile ? getId  : getCookie("userId"))
      .then(user => {
        console.log(user);
        emailComponent.update({ text: `E-posta: ${user.email}` });
        usernameComponent.update({ text: `Kullanıcı Adı: ${user.username}` });
        usernameInput.update({value : user.username});
        emailInput.update({value: user.email});
        photo.elements[0].update({ src: user.avatar });
        rank = user.rank;
        is_active = user.is_active;
        id = user.id;

      }).catch(error => {
        console.error("Veri çekme hatası:", error);
        emailComponent.update({ text: `E-posta: Hata oluştu.` });
        usernameComponent.update({ text: `Kullanıcı Adı: Hata oluştu.` });
      });

    pageContainer.elements[0].elements = [
      exitBtn,
      deleteBtn,
      editBtn,
      emailComponent,
      usernameComponent,
      photo,
      changePhotoBtn,
      deletePhotoBtn,
      fa2btnEnable,
      fa2btnDisable,
    ];

   
    
    withEventHandlers(editBtn, { onClick: async() => {
      console.log(editBtn);
      if (editBtn.props.isActive == true){
        editForm.elements = [usernameLabel, usernameInput, emailLabel, emailInput, saveFormBtn];
        pageContainer.elements[0].elements.push(editForm);
        pageContainer.elements[0].update({elements: pageContainer.elements[0].elements});
        editBtn.props.isActive = false;
      }
      else if (editBtn.props.isActive == false)
      {
        editForm.update({elements : []})
        editBtn.props.isActive = true;
      }} 
    });

        
    withEventHandlers(saveFormBtn, { onClick: async() => {
      console.log(saveFormBtn);
      const csrfToken = await getCsrfToken();
      console.log(usernameComponent);
      const updatedData = {
        "id": id,
        "username": usernameInput.value,
        "email": emailInput.value,
        "avatar": photo.elements[0].src,
        "rank": rank,
        "is_active": is_active
      };
      const formData = new FormData();
      formData.append("id", updatedData.id);
      formData.append("username", updatedData.username);
      formData.append("email", updatedData.email);
      formData.append("is_active", updatedData.email);
      if (updatedData.avatar) {
        formData.append("avatar", updatedData.avatar);
      }
      await fetch(`https://${window.location.host}/api/auth/user-list/${id}/`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfToken,
          "Authorization": `Bearer ${getCookie('accessToken')}`
        },
        body: formData
        }).then(response => response.json()).then(data => {
          emailComponent.update({ text: `E-posta: ${data.email}`});
          usernameComponent.update({ text: `Kullanıcı Adı: ${data.username}`});
          console.log(usernameComponent);
          pageContainer.elements[0].update({elements: pageContainer.elements[0].elements});
          editForm.update({elements : []})
          editBtn.props.isActive = true;

        });
      }

    });




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
          }).then(response => response.json()).then(data => {
             photo.elements[0].update({ src: `${data.avatar}`});
          })
        }
      };
      fileInput.click();
    }});

    withEventHandlers(deletePhotoBtn, { onClick: async() => {
      const csrfToken = await getCsrfToken();
      const formData = new FormData();
      await fetch(`https://${window.location.host}/api/auth/avatar/`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrfToken,
            "Authorization": `Bearer ${getCookie('accessToken')}`
        },
        body: formData
      }).then(response => response.json()).then(data => {
         photo.elements[0].update({ src: `${data.avatar}?t=${new Date().getTime()}`});
      })
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

async function getUser(id) {
  try {
    const response = await fetch(`https://${window.location.host}/api/auth/user-list/${id}/`, {
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
