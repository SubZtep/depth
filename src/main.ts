import { createApp } from "vue"
import App from "./components/App.vue"
import Toast from "vue-toastification"
import StatsPlugin from "./plugins/stats"
// import GuiPlugin from "./plugins/datGUI"
import VisibleDirective from "./directives/visible"
import "vue-toastification/dist/index.css"
import "./style.css"

createApp(App)
  .use(Toast, {
    position: "bottom-right",
    timeout: 3000,
    showCloseButtonOnHover: true,
  })
  .use(StatsPlugin)
  // .use(GuiPlugin)
  .directive("visible", VisibleDirective)
  .mount("#app")
