import Router from "./core/Router.js";

// Initialize the router
const router = new Router({
  // Example component returning a DOM element
  "/": {
    component: () => {
      const div = document.createElement("div");
      div.textContent = "Agla Kudur";
      return div; // Ensure this is a DOM element
    },
  },
  "/profile/:id": {
    component: async (params) => {
      const div = document.createElement("div");
      div.textContent = `PROFILE = ${params.id}`;
      return div; // Ensure this is a DOM element
    },
  },
  "/404": {
    component: async () => {
      const div = document.createElement("div");
      try {
        const response = await fetch("/page/error/404.html");
        if (!response.ok) throw new Error("404 page not found");
        div.innerHTML = await response.text();
      } catch (error) {
        div.textContent = "404 - Page Not Found";
      }
      return div; // Ensure this is a DOM element
    },
  },
});

// Initialize routing when the page loads or URL changes
window.addEventListener("load", () => router.init());
window.addEventListener("hashchange", () => router.onRouteChange());

// Ornek :id kullanimi
//
// Veri cek
/* async function fetchUserData(userId) {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error("User not found");
  const data = await response.json();
  return data;
}
*/
//
// component: olarak yaz :
/*
"/profile/:id": {
    component: async (params) => {
      // Dinamik ID ile veriyi al
      const userData = await fetchUserData(params.id);
      const profileDiv = document.createElement("div");
      profileDiv.textContent = `Profil: ${userData.name}, ID: ${params.id}`;
      return profileDiv;
    },
  },
*/
