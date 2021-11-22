import { createApp } from "vue"
import { createPinia } from "pinia"
import UAParser from "ua-parser-js"
import Toast, { POSITION } from "vue-toastification"
import { SupabasePlugin, piniaToSupabase } from "@depth/supabase"
import { ThreejsPlugin } from "@depth/three.js"
import { AudioPlugin } from "@depth/audio"
import { GuiPlugin } from "@depth/dat.gui"
import { StatsPlugin } from "@depth/stats.js"
import Visible from "./directives/visible"
import CssAspectRatio from "./directives/css-aspect-ratio"
import StopPropagation from "./directives/stop-propagation"
import router, { navigationGui } from "./router"
import { UserEvents } from "./events"
import App from "./App/App.vue"
import "virtual:windi.css"
import "./styles/main.css"

const isMobile = new UAParser().getDevice().type === "mobile"

const pinia = createPinia()
pinia.use(piniaToSupabase)

const app = createApp(App)
  .use(pinia)
  .use(router)
  .use(Toast, {
    timeout: 4569,
    maxToasts: 13,
    position: isMobile ? POSITION.TOP_CENTER : POSITION.BOTTOM_RIGHT,
    showCloseButtonOnHover: true,
  })
  .use(SupabasePlugin, {
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_KEY,
  })
  .use(StatsPlugin, {
    addClass: "Stats",
    mosaic: true,
  })
  .use(ThreejsPlugin)
  .use(GuiPlugin, {
    addClass: "depth",
    hooked: [navigationGui],
    closeOnTop: false,
    autoPlace: false,
    width: 285,
    closeAtStart: isMobile,
  })
  .use(AudioPlugin)
  .use(UserEvents)
  .directive("visible", Visible)
  .directive("css-aspect-ratio", CssAspectRatio)
  .directive("stop-propagation", StopPropagation)

// if (process.env.NODE_ENV === "production") {
//   app.config.errorHandler = (err, instance, info) => {
//     console.log("My Error Handler", { err, instance, info })
//   }
// }

app.mount("#hud")
