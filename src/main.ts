import type { Route } from "~/types/settings.d"
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
import Howler from "./packages/Howler"
import { preferencesGui } from "./preferences"
import settings from "../SETTINGS.toml"
import "./icons"

import "virtual:windi.css"
import "vue-toastification/dist/index.css"
import "./vendors.css"
import "./style.css"

const routes = normalizeRoutes(settings.router.routes)

createApp(App)
  .use(createPinia())
  .use(Toast, {
    timeout: 4569,
    maxToasts: 13,
    position: "bottom-right",
    showCloseButtonOnHover: true,
  })
  .use(Supabase, {
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_KEY,
  })
  .use(Router, { routes, transition: settings.router.transition })
  .use(ThreeJs, { toastEvents: true })
  .use(Stats, { mosaic: true })
  .use(Gui, { addons: [navigationGui(routes), preferencesGui] })
  .use(Howler, { sounds: settings.sounds })
  .component("fa", FontAwesomeIcon)
  .directive("visible", Visible)
  .directive("dbvideo", DBVideo)
  .directive("css-aspect-ratio", CssAspectRatio)
  .directive("stop-propagation", StopPropagation)
  .mount("#hud")
