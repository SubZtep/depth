import { createApp } from "vue"
import App from "./components/App.vue"
import GuiPlugin from "./plugins/datGUI"
import StatsPlugin from "./plugins/stats"
import "./style.css"

const app = createApp(App)
app.use(StatsPlugin)
app.use(GuiPlugin)
app.mount("#app")

Object.defineProperty(HTMLVideoElement.prototype, "isPlaying", {
  get: function () {
    return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2)
  },
})
