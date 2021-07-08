import { createApp } from "vue"
import Toast from "vue-toastification"
import App from "./components/scene/App.vue"
import Visible from "./directives/visible"
import Router from "./plugins/router"
import Stats from "./plugins/stats"
import Gui from "./plugins/datGUI"
import routes from "./routes"

// import "vue-toastification/dist/index.css"
// import "./vendors.css"
import "./style.css"

createApp(App)
  // .use(Toast, {
  //   timeout: 3000,
  //   position: "bottom-right",
  //   showCloseButtonOnHover: true,
  // })
  // .use(Router, { routes })
  // .use(Stats)
  // .use(Gui)
  // .directive("visible", Visible)
  .mount("#app")
