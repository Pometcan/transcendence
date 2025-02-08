import {InputElement, MenuElement, SubmitButton} from '../core/elements/Type.Element.js';
import { ButtonComponent, InputComponent,  withEventHandlers, DivComponent } from '../core/components/Type.Component.js';
import { setCookie, getCsrfToken, getCookie } from '../core/Cookie.js';
import {t} from '../i42n.js';

const LoginElement = () => {
  const loginForm = new DivComponent("loginForm", {});
  const usernameInput = InputElement("usernameInput", t("auth.username"), "text");
  const passwordInput = InputElement("passwordInput", t("auth.password"), "password");
  const authButton = SubmitButton("authButton", "42 INTRA" );
  const submitButton = SubmitButton("submitButton", t("auth.loginSubmitButton") );
  const errorDiv = new DivComponent("loginError", { styles: { color: 'red', marginTop: '10px', display: 'none' } });

  authButton.styles = {backgroundColor: '#000', color: '#fff', width: '100%', marginTop: '10px'};
  loginForm.elements = [
    usernameInput,
    passwordInput,
    submitButton,
    authButton,
    errorDiv
  ];

  withEventHandlers(authButton, {
    onClick: () => {
      fetch(`https://${window.location.host}/api/auth/intra/login`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error:", data.error);
          setCookie('login', 'false', 1);
          return;
        }
        setCookie('login', 'true', 1);
        setCookie('userId', data.user_id, 1);
        window.location.href = data.auth_url;
      })
      .catch((error) => {
        console.error("Error:", error);
        setCookie('login', 'false', 1);
      });
    }
  });


  withEventHandlers(submitButton, { onClick: async () => {
    errorDiv.element.style.display = 'none';
    errorDiv.element.textContent = "";

    const csrfToken = await getCsrfToken();
    const payload = {
      username: usernameInput.elements[0].value,
      password: passwordInput.elements[0].value
    };

    try {
      const response = await fetch(`https://${window.location.host}/api/auth/login/`, {
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
        if (data.refresh && data.access) {
          setCookie('userId', data.user_id, 1);
          setCookie('refreshToken', data.refresh, 1);
          setCookie('accessToken', data.access, 1);
          if (data.mfa_enabled)
          {
            setCookie("qrCode", data.qr_code, 1);
            window.router.navigate("/verify");
          }
          else
          {
            setCookie('login', 'true', 1);
            window.router.navigate("/");
          }
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
  const usernameInput = InputElement("usernameInput", t("auth.username"), "text");
  const emailInput = InputElement("emailInput",  t("auth.email"), "email");
  const passwordInput = InputElement("passwordInput", t("auth.password"),"password");
  const password2Input = InputElement("password2Input", t("auth.password2") ,"password");
  const submitButton = SubmitButton("submitButton", t("auth.registerSubmitButton") );
  const intraButton = SubmitButton("intraButton", "42 INTRA" );
  const errorDiv = new DivComponent("registerError", { styles: { color: 'red', marginTop: '10px', display: 'none' } });

  intraButton.styles = {backgroundColor: '#000', color: '#fff', width: '100%', marginTop: '10px'};
  registerForm.elements = [
    usernameInput,
    emailInput,
    passwordInput,
    password2Input,
    submitButton,
    intraButton,
    errorDiv
  ];

  withEventHandlers(intraButton, {
    onClick: () => {
      fetch(`https://${window.location.host}/api/auth/intra/login`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error:", data.error);
          setCookie('login', 'false', 1);
          return;
        }
        window.location.href = data.auth_url;
      })
      .catch((error) => {
        console.error("Error:", error);
        setCookie('login', 'false', 1);
      });
    }
  });

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
      username: usernameInput.elements[0].value,
      email: emailInput.elements[0].value,
      password1: passwordInput.elements[0].value,
      password2: password2Input.elements[0].value
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
        if (data) {
          const csrfToken = await getCsrfToken();
          const response = await fetch(`https://${window.location.host}/api/auth/login/`, {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({username:payload.username, password:payload.password1}),
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
            if (data.refresh && data.access) {
              setCookie('login', 'true', 1);
              setCookie('userId', data.user_id, 1);
              setCookie('refreshToken', data.refresh, 1);
              setCookie('accessToken', data.access, 1);
              console.log(data);
              if (data.mfa_enabled)
                window.router.navigate("/verify");
              else
                window.router.navigate("/");
            }
          }
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
