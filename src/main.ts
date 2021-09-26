import { createApp } from "vue"
import { createPinia } from "pinia"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import Toast from "vue-toastification"
import App from "./components/scene/App.vue"
import Visible from "./directives/visible"
import DBVideo from "./directives/dbvideo"
import AspectRatio from "./directives/aspect-ratio"
import Supabase from "./packages/Supabase"
import ThreeJs from "./packages/ThreeJS"
import Router, { navigation } from "./packages/router"
import Stats from "./packages/Stats"
import Gui from "./packages/datGUI"
import { preferencesGui } from "./preferences"
import routes from "./routes"
import "./icons"

import "virtual:windi.css"
import "vue-toastification/dist/index.css"
import "./vendors.css"
import "./style.css"

createApp(App)
  .component("fa", FontAwesomeIcon)
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
  .use(Router, { routes })
  .use(ThreeJs, { toastEvents: true })
  .use(Stats, { mosaic: true })
  .use(Gui, {
    routes,
    addons: [
      navigation(routes),
      preferencesGui
    ]
  })
  .directive("visible", Visible)
  .directive("dbvideo", DBVideo)
  .directive("aspect-ratio", AspectRatio)
  .mount("#app")
