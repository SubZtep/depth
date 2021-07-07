import { createApp } from "vue"
import App from "./components/scene/App.vue"
import Toast from "vue-toastification"
import Router from "./plugins/router"
import Stats from "./plugins/stats"
import Gui from "./plugins/datGUI"
import Visible from "./directives/visible"
import "vue-toastification/dist/index.css"
import "./style.css"
import routes from "./routes"

createApp(App)
  .use(Toast, {
    timeout: 3000,
    position: "bottom-right",
    showCloseButtonOnHover: true,
  })
  .use(Router, {
    routes,
    // enableTransition: false,
  } as RouterOptions)
  .use(Stats)
  .use(Gui)
  .directive("visible", Visible)
  .mount("#app")
