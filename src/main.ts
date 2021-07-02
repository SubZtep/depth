import { createApp } from "vue"
import App from "./components/scene/App.vue"
import Toast from "vue-toastification"
import StatsPlugin from "./plugins/stats"
import GuiPlugin from "./plugins/datGUI"
import VisibleDirective from "./directives/visible"
import "vue-toastification/dist/index.css"
import "./style.css"

createApp(App)
  .use(Toast, {
    timeout: 3000,
    position: "bottom-right",
    showCloseButtonOnHover: true,
  })
  .use(StatsPlugin)
  .use(GuiPlugin)
  .directive("visible", VisibleDirective)
  .mount("#app")
