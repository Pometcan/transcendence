import {MenuElement, SubmitButton} from '../core/elements/Type.Element.js';
import {FormComponent, ButtonComponent, InputComponent,  withEventHandlers, DivComponent } from '../core/components/Type.Component.js';
import { setCookie, getCookie, listCookies, getCsrfToken } from '../core/Cookie.js';

const LoginElement = () => {
  const loginForm = new DivComponent("loginForm", {});
  const usernameInput = new InputComponent("usernameInput", { type: "text", name: "username", placeholder: "Kullanıcı Adı" });
  const emailInput = new InputComponent("emailInput", { type: "email", name: "email", placeholder: "E-posta" });
  const passwordInput = new InputComponent("passwordInput", { type: "password", name: "password", placeholder: "Şifre" });
  const submitButton = SubmitButton("submitButton", "Giriş Yap" );
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
    errorDiv.element.textContent = "";

    const csrfToken = await getCsrfToken();
    const payload = {
      username: usernameInput.value,
      email: emailInput.value,
      password: passwordInput.value
    };

    try {
      const response = await fetch(`https://${window.location.host}/api/rest-auth/login/`, {
        method: "POST",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        let errorMessage = "Giriş başarısız. ";

        if (data) {
          for (const field in data) {
            errorMessage += `${field}: ${data[field].join(", ")} `;
          }
        }

        errorDiv.element.textContent = errorMessage.trim();
        errorDiv.element.style.display = 'block';
      } else {
        // Başarılı giriş işlemi
        if (data.key) {
          setCookie('login', 'true', 1);
          setCookie('loginKey', data.key, 1);
          window.router.navigate("/");
        }
      }
    } catch (error) {
      errorDiv.element.textContent = error.message || "Sunucuya bağlanırken bir hata oluştu.";
      errorDiv.element.style.display = 'block';
    }
  } });

  return loginForm;
}

const RegisterElement = () => {
  const registerForm = new DivComponent("registerForm", { styles: { display: 'none' } });
  const usernameInput = new InputComponent("usernameInput", { type: "text", name: "username", placeholder: "Kullanıcı Adı" });
  const emailInput = new InputComponent("emailInput", { type: "email", name: "email", placeholder: "E-posta" });
  const passwordInput = new InputComponent("passwordInput", { type: "password", name: "password", placeholder: "Şifre" });
  const password2Input = new InputComponent("password2Input", { type: "password", name: "password2", placeholder: "Şifre Tekrar" });
  const submitButton = SubmitButton("submitButton", "Kayıt Ol" );
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

    errorDiv.element.style.display = 'none';
    errorDiv.element.textContent = "";

    const csrfToken = await getCsrfToken();
    const payload = {
      username: usernameInput.value,
      email: emailInput.value,
      password1: passwordInput.value,
      password2: password2Input.value
    };

    try {
      const response = await fetch(`https://${window.location.host}/api/rest-auth/registration/`, {
        method: "POST",
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        let errorMessage = "Giriş başarısız. ";

        if (data) {
          for (const field in data) {
            errorMessage += `${field}: ${data[field].join(", ")} `;
          }
        }

        errorDiv.element.textContent = errorMessage.trim();
        errorDiv.element.style.display = 'block';
      } else {
        // Başarılı giriş işlemi
        if (data.key) {
          setCookie('login', 'true', 1);
          setCookie('loginKey', data.key, 1);
          window.router.navigate("/");
        }
      }
    } catch (error) {
      errorDiv.element.textContent = error.message || "Sunucuya bağlanırken bir hata oluştu.";
      errorDiv.element.style.display = 'block';
    }
  }
  });

  return registerForm;
}

const AuthPage = {
  layoutVisibility: false,
  render: () => {
    const loginButton = new ButtonComponent("loginButton", { label: "Login" });
    const registerButton = new ButtonComponent("registerButton", { label: "Register" });
    const loginForm = LoginElement();
    const registerForm = RegisterElement();
    const pageContainer = MenuElement("authPage", [loginButton, registerButton, loginForm, registerForm]  );

    withEventHandlers(loginButton, { onClick: () => {
      loginForm.element.style.display = 'block';
      registerForm.element.style.display = 'none';
    } });

    withEventHandlers(registerButton, { onClick: () => {
      loginForm.element.style.display = 'none';
      registerForm.element.style.display = 'block';
    } });

    const renderedPage = pageContainer.render();
    return renderedPage;
  }
};

export default AuthPage;
