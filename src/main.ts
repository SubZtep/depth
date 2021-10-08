import { createApp } from "vue"
import { createPinia } from "pinia"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import Toast from "vue-toastification"
import App from "./components/scene/App.vue"
import Visible from "./directives/visible"
import DBVideo from "./directives/dbvideo"
import CssAspectRatio from "./directives/css-aspect-ratio"
import StopPropagation from "./directives/stop-propagation"
import Supabase from "./packages/Supabase"
import ThreeJs from "./packages/ThreeJS"
import Router, { navigationGui, normalizeRoutes } from "./packages/router"
import Stats from "./packages/Stats"
import Gui from "./packages/datGUI"
import Howler from "./packages/Howler/plugin"
import preferencesGui from "./misc/preferencesGui"
import settings from "~/../SETTINGS.toml"
import videoPlugin from "./stores/videoPlugin"
import "./icons"
import "virtual:windi.css"
import "./style.css"

const routes = normalizeRoutes(settings.router.routes)

const piana = createPinia()
// .use(videoPlugin)

const app = createApp(App)
  .use(piana)
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
  .use(Router, { routes, transition: settings.router.transition })
  .use(ThreeJs, { toastEvents: false })
  .use(Stats, { mosaic: true })
  .use(Gui, { addons: [navigationGui(routes), preferencesGui] })
  .use(Howler, settings.audio)
  .component("fa", FontAwesomeIcon)
  .directive("visible", Visible)
  .directive("dbvideo", DBVideo)
  .directive("css-aspect-ratio", CssAspectRatio)
  .directive("stop-propagation", StopPropagation)

app.config.errorHandler = (err, instance, info) => {
  console.log("My Error Handler", { err, instance, info })
}

app.mount("#hud")
