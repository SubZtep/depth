import { createApp } from "vue"
import { createPinia } from "pinia"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import Toast from "vue-toastification"
import App from "./components/scene/App.vue"
import Visible from "./directives/visible"
import CssAspectRatio from "./directives/css-aspect-ratio"
import StopPropagation from "./directives/stop-propagation"
import Supabase from "./packages/Supabase"
import ThreeJs from "./packages/ThreeJS"
import Stats from "./packages/Stats"
import Gui from "./packages/datGUI"
import Howler from "./packages/Howler/plugin"
import { navigationGui, preferencesGui } from "./misc/hud"
import settings from "~/../SETTINGS.toml"
// import videoPlugin from "./stores/videoPlugin"
import router from "./router"
import "./icons"
import "virtual:windi.css"
import "./style.css"

export const useSharedMediaControls = createSharedComposable(useMediaControls)

const piana = createPinia()
// .use(videoPlugin)

const app = createApp(App)
  .use(router)
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
  .use(ThreeJs, { toastEvents: false })
  .use(Stats, { mosaic: true })
  .use(Gui, { addons: [navigationGui(router.getRoutes()), preferencesGui] })
  .use(Howler, settings.audio)
  .component("fa", FontAwesomeIcon)
  .directive("visible", Visible)
  .directive("css-aspect-ratio", CssAspectRatio)
  .directive("stop-propagation", StopPropagation)

if (process.env.NODE_ENV === "production") {
  app.config.errorHandler = (err, instance, info) => {
    console.log("My Error Handler", { err, instance, info })
  }
}

app.mount("#hud")
