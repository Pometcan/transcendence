import MenuElement from '../core/elements/Element.Menu.js';
import {FormComponent, ButtonComponent, InputComponent,  withEventHandlers, DivComponent } from '../core/components/Type.Component.js';
import { setCookie, getCookie, listCookies, getCsrfToken } from '../core/Cookie.js';

const LoginElement = () => {
  const loginForm = new DivComponent("loginForm", {});
  const usernameInput = new InputComponent("usernameInput", { type: "text", name: "username", placeholder: "Kullanıcı Adı" });
  const emailInput = new InputComponent("emailInput", { type: "email", name: "email", placeholder: "E-posta" });
  const passwordInput = new InputComponent("passwordInput", { type: "password", name: "password", placeholder: "Şifre" });
  const submitButton = new ButtonComponent("submitButton", { label: "Giriş Yap" });
  const errorDiv = new DivComponent("loginError", { styles: { color: 'red', marginTop: '10px', display: 'none' } });

  loginForm.elements = [
    usernameInput,
    emailInput,
    passwordInput,
    submitButton,
    errorDiv
  ];
  withEventHandlers(submitButton, { onClick: async () => {
    errorDiv.element.style.display = 'none';
    const csrfToken = await getCsrfToken();
    fetch(`https://${window.location.host}/api/rest-auth/login/`, {
        method: "POST",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({
            username: usernameInput.value,
            email: emailInput.value,
            password: passwordInput.value
        }),
    })
    .then((response) => { // İlk .then bloğu, response burada tanımlı
          if (!response.ok) { // response.ok kontrolü burada yapılıyor
            return response.json().then(data => { // Hata durumunda JSON'ı parse et ve hatayı işle
              let errorMessage = "Giriş başarısız.";
              if (data && data.non_field_errors) {
                errorMessage = data.non_field_errors.join(", ");
              } else if (data) {
                for (const field in data) {
                  errorMessage += `${field}: ${data[field].join(", ")} `;
                }
              }
              errorDiv.element.textContent = errorMessage;
              errorDiv.element.style.display = 'block';
              throw new Error(errorMessage); // Hata durumunda throw et ki catch bloğu yakalasın
            });
          }
          return response.json(); // Başarılı durumda JSON'ı parse et ve sonraki .then'e geçir
        })
        .then((data) => { // İkinci .then bloğu, data burada tanımlı (JSON verisi)
          if (data.key) {
            setCookie('login', 'true', 1);
            setCookie('loginKey',data.key, 1);
            window.router.navigate("/");
          }
        })
        .catch((error) => { // Hata bloğu, hem fetch hatalarını hem de yukarıda throw edilen hataları yakalar
          console.error("Error:", error);
          errorDiv.element.textContent = error.message || "Sunucuya bağlanırken bir hata oluştu."; // Hata mesajını göster
          errorDiv.element.style.display = 'block';
        });
      }
    });

  return loginForm;
}

const RegisterElement = () => {
  const registerForm = new DivComponent("registerForm", { styles: { display: 'none' } });
  const usernameInput = new InputComponent("usernameInput", { type: "text", name: "username", placeholder: "Kullanıcı Adı" });
  const emailInput = new InputComponent("emailInput", { type: "email", name: "email", placeholder: "E-posta" });
  const passwordInput = new InputComponent("passwordInput", { type: "password", name: "password", placeholder: "Şifre" });
  const password2Input = new InputComponent("password2Input", { type: "password", name: "password2", placeholder: "Şifre Tekrar" });
  const submitButton = new ButtonComponent("submitButton", { label: "Kayıt Ol" });
  const errorDiv = new DivComponent("registerError", { styles: { color: 'red', marginTop: '10px', display: 'none' } });

  registerForm.elements = [
    usernameInput,
    emailInput,
    passwordInput,
    password2Input,
    submitButton,
    errorDiv
  ];

  withEventHandlers(submitButton, { onClick: async() => {
    errorDiv.element.style.display = 'none'; // Onceki hatalari temizle

        if (passwordInput.value !== password2Input.value) {
          errorDiv.element.textContent = "Şifreler eşleşmiyor.";
          errorDiv.element.style.display = 'block';
          return;
        }
    fetch(`https://${window.location.host}/api/rest-auth/registration/`, {
        method: "POST",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            username: usernameInput.value,
            email: emailInput.value,
            password1: passwordInput.value,
            password2: password2Input.value
        }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (response.ok) { // response.ok ile basari kontrolu
        if (data.key) {
          setCookie('login', 'true', 1);
          setCookie('loginKey',data.key, 1);
          window.router.navigate("/");
        }
      } else {
        // API'den hata geldi
        let errorMessage = "Kayıt başarısız.";
        if (data && data.non_field_errors) { // Genel hatalar
          errorMessage = data.non_field_errors.join(", ");
        } else if (data) { // Alan bazli hatalar (ornegin username, email, password)
          for (const field in data) {
            errorMessage += `${field}: ${data[field].join(", ")} `;
          }
        }
        errorDiv.element.textContent = errorMessage;
        errorDiv.element.style.display = 'block';
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      errorDiv.element.textContent = "Sunucuya bağlanırken bir hata oluştu.";
      errorDiv.element.style.display = 'block';
    });
  }
  });

  return registerForm;
}

const AuthPage = {
  layoutVisibility: false,
  render: () => {
    const pageContainer = MenuElement("authPage");
    const loginButton = new ButtonComponent("loginButton", { label: "Login" });
    const registerButton = new ButtonComponent("registerButton", { label: "Register" });

    const loginForm = LoginElement();
    const registerForm = RegisterElement();

    withEventHandlers(loginButton, { onClick: () => {
      loginForm.element.style.display = 'block';
      registerForm.element.style.display = 'none';
    } });

    withEventHandlers(registerButton, { onClick: () => {
      loginForm.element.style.display = 'none';
      registerForm.element.style.display = 'block';
    } });

    pageContainer.elements[0].elements = [loginButton, registerButton, loginForm, registerForm];
    const renderedPage = pageContainer.render();
    return renderedPage;
  }
};

export default AuthPage;
