import { createApp } from "vue"
import { createPinia } from "pinia"
import CssAspectRatio from "~/directives/css-aspect-ratio"
import StopPropagation from "~/directives/stop-propagation"
import { navigationGui, preferencesGui } from "~/misc/hud"
import { UserEvents } from "./events"
import Howler from "~/packages/Howler/plugin"
import Visible from "~/directives/visible"
import Supabase from "~/packages/Supabase"
import settings from "~/../SETTINGS.toml"
import ThreeJs from "~/packages/ThreeJS"
import Toast from "vue-toastification"
import Stats from "~/packages/Stats"
import Gui from "~/packages/datGUI"
import App from "~/App/App.vue"
import router from "~/router"
import "virtual:windi.css"
import "~/style.css"

const app = createApp(App)
  .use(createPinia())
  .use(router)
  .use(Toast, {
    timeout: 4569,
    maxToasts: 13,
    position: POSITION.BOTTOM_RIGHT,
    showCloseButtonOnHover: true,
  })
  .use(Supabase, {
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_KEY,
  })
  .use(Stats, { mosaic: true })
  .use(ThreeJs, { toastEvents: false })
  .use(Gui, { addons: [navigationGui(router.getRoutes()), preferencesGui] })
  // .use(Howler, settings.audio)
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
