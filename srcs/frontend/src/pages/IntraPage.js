import { DivComponent } from "../core/components/UIComponent.Div";
import { setCookie } from "../core/Cookie";
const IntraPage  = {
  layoutVisibility: false,
  render: (params) => {
    const pageContainer = new DivComponent;
    const urlcode = params.get("code");
    fetch(`https://${window.location.host}/api/auth/intra/42-auth${window.location.search}`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: urlcode }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Error:", data.error);
        setCookie('login', 'false', 1);
        window.router.navigate("/auth");
        return;
      }
      setCookie('login', 'true', 1);
      setCookie('userId', data.user_id, 1);
      setCookie('refreshToken', data.refresh, 1);
      setCookie('accessToken', data.access, 1);
      window.router.navigate("/");
    })
    .catch((error) => {
      console.error("Error:", error);
      setCookie('login', 'false', 1);
      window.router.navigate("/auth");
    });
    return pageContainer.render();
  }
}

export default IntraPage;
