import "./style.css"

import { createApp } from "vue"
import App from "./App.vue"

const app = createApp(App)
app.mount("#app")

Object.defineProperty(HTMLVideoElement.prototype, "isPlaying", {
  get: function () {
    return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2)
  },
})
