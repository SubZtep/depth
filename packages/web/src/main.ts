import { createApp } from "vue"
import { createPinia } from "pinia"
import CssAspectRatio from "./directives/css-aspect-ratio"
import StopPropagation from "./directives/stop-propagation"
// import { navigationGui, preferencesGui } from "./misc/hud"
import { UserEvents } from "./events"
import Visible from "./directives/visible"
// import { SupabasePlugin } from "@depth/supabase"
// import settings from "../SETTINGS.toml"
// import { ThreejsPlugin } from "@depth/three.js"
import Toast from "vue-toastification"
// import { AudioPlugin } from "@depth/audio"
// import { StatsPlugin } from "@depth/stats.js"
// import { GuiPlugin } from "@depth/dat.gui"
import App from "./App/App.vue"
import router from "./router"
import "virtual:windi.css"

import "./style.css"

const app = createApp(App)
  .use(createPinia())
  .use(router)
  .use(Toast, {
    timeout: 4569,
    maxToasts: 13,
    position: POSITION.BOTTOM_RIGHT,
    showCloseButtonOnHover: true,
  })
  // .use(SupabasePlugin, {
  //   url: import.meta.env.VITE_SUPABASE_URL,
  //   key: import.meta.env.VITE_SUPABASE_KEY,
  // })
  // .use(StatsPlugin, { mosaic: true })
  // .use(ThreejsPlugin, { toastEvents: false })
  // .use(GuiPlugin, { addons: [navigationGui(router.getRoutes()), preferencesGui] })
  // .use(AudioPlugin, settings.audio)
  .use(UserEvents)
  .directive("visible", Visible)
  .directive("css-aspect-ratio", CssAspectRatio)
  .directive("stop-propagation", StopPropagation)

if (process.env.NODE_ENV === "production") {
  app.config.errorHandler = (err, instance, info) => {
    console.log("My Error Handler", { err, instance, info })
  }
}

app.mount("#hud")
