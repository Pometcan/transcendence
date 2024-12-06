import { Config } from "./config.js";
import { Router } from "./utils/router.js";
import App from "./components/Apps.js";

const router = new Router({
  "/": {
    component: () => new App(),
  },
  404: {
    component: () => {
      const div = document.createElement("div");
      div.textContent = "404 - Page Not Found";
      return div;
    },
  },
});
