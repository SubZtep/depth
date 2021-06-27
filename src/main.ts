import { createApp } from "vue"
import App from "./components/App.vue"
import StatsPlugin from "./plugins/stats"
import GuiPlugin from "./plugins/datGUI"
import "./style.css"

createApp(App).use(StatsPlugin).use(GuiPlugin).mount("#app")

Object.defineProperty(HTMLVideoElement.prototype, "isPlaying", {
  get: function () {
    return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2)
  },
})
