import { createApp } from "vue"
import App from "./App.vue"
import GuiPlugin from "./plugins/datGUI"
import "./style.css"

const app = createApp(App)
app.use(GuiPlugin)
app.mount("#app")


Object.defineProperty(HTMLVideoElement.prototype, "isPlaying", {
  get: function () {
    return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2)
  },
})
