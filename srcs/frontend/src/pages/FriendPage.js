import {MenuElement, SearchInput} from "../core/elements/Type.Element";
import { DivComponent, TextComponent, ImageComponent, ButtonComponent, withEventHandlers } from "../core/components/Type.Component";
import { getCsrfToken, getCookie } from "../core/Cookie";
const FriendPage = {
  layoutVisibility: true,
  render: () => {
    const pageContainer = MenuElement("FriendPage");
    const searchInput = SearchInput("searchInput", "Sea");
    withEventHandlers(searchInput.elements[0].elements[2], {onClick: async () => {
     await findUser(searchInput.elements[0].elements[0].value).then((data) => {
      for (let i = 0; i < data.length; i++) {
        const row = new DivComponent(data[i].id, {class: ""});
        row.elements = [
          new TextComponent("username", { text: data[i].username }),
          new ImageComponent("avatar", { src: data[i].avatar }),
          new ButtonComponent(`addFriend${data[i].id}`, { label: "add Friend ", class: "btn btn-primary" })
        ];
        withEventHandlers(row.elements[0], {onClick: () => {
          window.router.navigate(`/profile`, {id: data[i].id});
        }});
        withEventHandlers(row.elements[1], {onClick: () => {
          window.router.navigate(`/profile`, {id: data[i].id});
        }});
        withEventHandlers(row.elements[2], {onClick: async () => {
          const csrfToken = await getCsrfToken();
          await fetch(`https://${window.location.host}/api/auth/sent-friendship-request/`, {
            method: "POST",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
              "Authorization": `Bearer ${getCookie('accessToken')}`
            },
            body: JSON.stringify({receiver: data[i].id})
          })
          .then((response) => {
            console.log("addFriend Yanıt Durumu:", response.status, response.statusText);
            if (!response.ok) {
              const message = `HTTP error! status: ${response.status}`;
              throw new Error(message);
            }
            console.log("Friend request sent");
            window.router.navigate("/friends");
          })
          .catch((error) => {
            console.error("addFriend Hatası:", error);
          });
        }})
        userListDiv.elements.push(row);

      userListDiv.update( {elements: userListDiv.elements} );
      }})}});


    const userListDiv= new DivComponent("userListDiv", {class: "", style: {overflowY: "scroll"}});
    getAllUser()
      .then((data) => {
      for (let i = 0; i < data.length; i++) {
        const row = new DivComponent(data[i].id, {class: ""});
        row.elements = [
          new TextComponent("username", { text: data[i].username }),
          new ImageComponent("avatar", { src: data[i].avatar }),
          new ButtonComponent(`addFriend${data[i].id}`, { label: "add Friend ", class: "btn btn-primary" })
        ];
        withEventHandlers(row.elements[0], {onClick: () => {
          window.router.navigate(`/profile`, {id: data[i].id});
        }});
        withEventHandlers(row.elements[1], {onClick: () => {
          window.router.navigate(`/profile`, {id: data[i].id});
        }});
        withEventHandlers(row.elements[2], {onClick: async () => {
          const csrfToken = await getCsrfToken();
          await fetch(`https://${window.location.host}/api/auth/sent-friendship-request/`, {
            method: "POST",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
              "Authorization": `Bearer ${getCookie('accessToken')}`
            },
            body: JSON.stringify({receiver: data[i].id})
          })
          .then((response) => {
            console.log("addFriend Yanıt Durumu:", response.status, response.statusText);
            if (!response.ok) {
              const message = `HTTP error! status: ${response.status}`;
              throw new Error(message);
            }
            console.log("Friend request sent");
            window.router.navigate("/friends");
          })
          .catch((error) => {
            console.error("addFriend Hatası:", error);
          });
        }});
        userListDiv.elements.push(row);
      }
      userListDiv.update( {elements: userListDiv.elements} );
      })
      .catch((error) => {
        console.error("getAllUser Hatası:", error); // Hata durumunda logla
      });

    pageContainer.elements[0].elements = [
      searchInput,
      userListDiv
    ];
    return pageContainer.render();
  }
}

export default FriendPage;

async function getAllUser() {
  try {
    const csrfToken = await getCsrfToken();

    const response =await fetch(`https://${window.location.host}/api/auth/user-list/`, {
      method: "GET",
      credentials: "include",
      headers: {
          "X-CSRFToken": csrfToken,
          "Authorization": `Bearer ${getCookie('accessToken')}`
      }
    });

    console.log("getAllUser Yanıt Durumu:", response.status, response.statusText); // Yanıt durumunu logla

    if (!response.ok) {
      const message = `HTTP error! status: ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
      console.error("getAllUser Hatası:", error);
  }
}

async function findUser(username) {
  try {
    const csrfToken = await getCsrfToken();

    const response = await fetch(`https://${window.location.host}/api/auth/search-user?search=${username}`, {
      method: "GET",
      credentials: "include",
      headers: {
          Accapt: "application/json",
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
          "Authorization": `Bearer ${getCookie('accessToken')}`
      }
    });

    console.log("findUser Yanıt Durumu:", response.status, response.statusText); // Yanıt durumunu logla

    if (!response.ok) {
      const message = `HTTP error! status: ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
      console.error("findUser Hatası:", error);
  }
}
