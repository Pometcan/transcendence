import { Config } from "./config.js";
import { Router } from "./utils/router.js";
import Auth from "./components/auth.js";

const router = new Router({
  "/": {
    component: () => new Auth(),
  },
  404: {
    component: () => {
      const div = document.createElement("div");
      div.textContent = "404 - Page Not Found";
      return div;
    },
  },
});
