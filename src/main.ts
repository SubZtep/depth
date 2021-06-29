import { createApp } from "vue"
import App from "./components/App.vue"
import Toast from "vue-toastification"
import StatsPlugin from "./plugins/stats"
import GuiPlugin from "./plugins/datGUI"
import PositionDirective from "./directives/position"
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
  .directive("position", PositionDirective)
  .mount("#app")

// Object.defineProperty(HTMLVideoElement.prototype, "isPlaying", {
//   get: function () {
//     return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2)
//   },
// })
