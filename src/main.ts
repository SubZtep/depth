import { createApp } from "vue"
import Toast from "vue-toastification"
import App from "./components/scene/App.vue"
import Visible from "./directives/visible"
import ThreeJs from "./packages/ThreeJS/plugin"
import Router from "./packages/router/plugin"
import Gui from "./packages/datGUI/plugin"
import routes from "./routes"

import "vue-toastification/dist/index.css"
import "./vendors.css"
import "./style.css"

createApp(App)
  .use(Toast, {
    timeout: 3000,
    position: "bottom-right",
    showCloseButtonOnHover: true,
  })
  .use(Router, { routes })
  .use(ThreeJs)
  // .use(Stats)
  .use(Gui)
  .directive("visible", Visible)
  .mount("#app")
