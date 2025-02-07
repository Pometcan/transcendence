import {MenuElement, SubmitButton} from '../core/elements/Type.Element.js';
import {FormComponent, ButtonComponent, InputComponent,  withEventHandlers, DivComponent } from '../core/components/Type.Component.js';
import { setCookie, getCookie, getCsrfToken } from '../core/Cookie.js';
import {t} from '../i42n.js';

const LoginElement = () => {
  const loginForm = new DivComponent("loginForm", {});
  const usernameInput = new InputComponent("usernameInput", { type: "text", name: "username", placeholder: t("auth.username")});
  const emailInput = new InputComponent("emailInput", { type: "email", name: "email", placeholder: t("auth.email") });
  const passwordInput = new InputComponent("passwordInput", { type: "password", name: "password", placeholder: t("auth.password") });
  const submitButton = SubmitButton("submitButton", t("auth.loginSubmitButton") );
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
        let errorMessage = t("error.loginFailed");

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
      errorDiv.element.textContent = error.message || t("error.serverError");
      errorDiv.element.style.display = 'block';
    }
  } });

  return loginForm;
}

const RegisterElement = () => {
  const registerForm = new DivComponent("registerForm", { styles: { display: 'none' } });
  const usernameInput = new InputComponent("usernameInput", { type: "text", name: "username", placeholder: t("auth.username")});
  const emailInput = new InputComponent("emailInput", { type: "email", name: "email", placeholder: t("auth.email") });
  const passwordInput = new InputComponent("passwordInput", { type: "password", name: "password", placeholder: t("auth.password") });
  const password2Input = new InputComponent("password2Input", { type: "password", name: "password2", placeholder: t("auth.password2") });
  const submitButton = SubmitButton("submitButton", t("auth.registerSubmitButton") );
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
    errorDiv.element.style.display = 'none';
    errorDiv.element.textContent = "";

    if (passwordInput.value !== password2Input.value) {
      errorDiv.element.textContent = t("error.passwordMismatch");
      errorDiv.element.style.display = 'block';
      return;
    }

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
        let errorMessage = t("error.registerFailed");

        if (data) {
          for (const field in data) {
            errorMessage += `${field}: ${data[field].join(", ")} `;
          }
        }

        errorDiv.element.textContent = errorMessage.trim();
        errorDiv.element.style.display = 'block';
      } else {
        if (data.key) {
          setCookie('login', 'true', 1);
          setCookie('loginKey', data.key, 1);
          window.router.navigate("/");
        }
      }
    } catch (error) {
      errorDiv.element.textContent = error.message || t("error.serverError");
      errorDiv.element.style.display = 'block';
    }
  }
  });

  return registerForm;
}

const AuthPage = {
  layoutVisibility: false,
  render: () => {
    const loginButton = new ButtonComponent("loginButton", { label: t("auth.login") });
    const registerButton = new ButtonComponent("registerButton", { label: t("auth.register") });
    const loginForm = LoginElement();
    const registerForm = RegisterElement();
    const pageContainer = MenuElement("authPage", [loginButton, registerButton, loginForm, registerForm],{
        "max-width": '500px',
      });
    pageContainer.elements[0].elements.class = "container-sm d-flex justify-content-center";
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
