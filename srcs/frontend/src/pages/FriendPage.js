import {MenuElement, SearchInput} from "../core/elements/Type.Element";
import { DivComponent } from "../core/components/Type.Component";
import { getCsrfToken } from "../core/Cookie";
const FriendPage = {
  layoutVisibility: true,
  render: () => {
    const pageContainer = MenuElement("FriendPage");
    const searchInput = SearchInput("searchInput", "Search for a friend");

    getAllUser()
      .then((data) => {
        console.log("getAllUser Başarılı Yanıt:", data);
      })
      .catch((error) => {
        console.error("getAllUser Hatası:", error); // Hata durumunda logla
      });

    pageContainer.elements[0].elements = [
      searchInput,
    ];
    return pageContainer.render();
  }
}

export default FriendPage;

async function getFriends() {
  try {
    const response = await fetch(`http://${window.location.host}/api/friends`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    });

    console.log("getFriends Yanıt Durumu:", response.status, response.statusText); // Yanıt durumunu logla

    if (!response.ok) { // response.ok, status kodunun 200-299 aralığında olup olmadığını kontrol eder
      const message = `HTTP error! status: ${response.status}`;
      throw new Error(message); // Hata durumunda hata fırlat
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("getFriends Hatası:", error); // Hata durumunda logla
    throw error; // Hatayı yukarıya fırlat ki çağıran fonksiyon da hatayı işleyebilsin
  }
}

async function getAllUser() {
  try {
    const response = await fetch(`http://${window.location.host}/api/auth/user-list/`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
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
    console.error("getAllUser Hatası:", error); // Hata durumunda logla
    throw error; // Hatayı yukarıya fırlat
  }
}
