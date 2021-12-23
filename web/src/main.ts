import { createApp } from "vue"
import { createPinia, storeToRefs } from "pinia"
import { PiniaUndo } from "pinia-undo"
import Toast, { POSITION } from "vue-toastification"
import { SupabasePlugin, piniaToSupabase } from "@depth/database"
import { CanvasPlugin } from "@depth/canvas"
import { ControllerPlugin } from "@depth/controller"
// import { AudioPlugin } from "@depth/audio"
import { PhysicsPlugin } from "@depth/physics"
import { GuiPlugin } from "@depth/hud"
import { StatsPlugin } from "@depth/stats"
// import Visible from "./directives/visible"
// import CssAspectRatio from "./directives/css-aspect-ratio"
import Visible from "./directives/visible"
import StopPropagation from "./directives/stop-propagation"
import router, { navigationGui, initRouterMeta } from "./router"
// import { UserEvents } from "./events"
import App from "./App/App.vue"
import { usePreferencesStore } from "~/stores/preferences"
import "virtual:windi.css"
import "./styles/main.css"

const pinia = createPinia()
pinia.use(piniaToSupabase)
// @ts-ignore
pinia.use(PiniaUndo)

const app = createApp(App)
  .use(pinia)
  .use(router)
  .use(SupabasePlugin, {
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_KEY,
  })
  .use(ControllerPlugin)
  .use(CanvasPlugin)
  .use(PhysicsPlugin)

  .directive("stop-propagation", StopPropagation)
  // .use(AudioPlugin)
  // .use(UserEvents)
  .directive("visible", Visible)
// .directive("css-aspect-ratio", CssAspectRatio)
// .directive("stop-propagation", StopPropagation)

// if (process.env.NODE_ENV === "production") {
//   app.config.errorHandler = (err, instance, info) => {
//     console.log("My Error Handler", { err, instance, info })
//   }
// }

initRouterMeta(app)

const { showDebug, isMobile } = storeToRefs(usePreferencesStore())

app
  .use(Toast, {
    timeout: 4569,
    maxToasts: 13,
    position: isMobile ? POSITION.TOP_CENTER : POSITION.BOTTOM_RIGHT,
    showCloseButtonOnHover: true,
  })
  .use(GuiPlugin, {
    addClass: "depth",
    hooked: [navigationGui],
    closeOnTop: false,
    autoPlace: false,
    width: 285,
    closeAtStart: isMobile,
  })
  .use(StatsPlugin, { mosaic: true, visible: showDebug })
  .mount("#hud")
