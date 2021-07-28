import { createApp } from "vue"
import Toast from "vue-toastification"
import App from "./components/scene/App.vue"
import Visible from "./directives/visible"
import DBVideo from "./directives/dbvideo"
import Supabase from "./packages/Supabase/plugin"
import ThreeJs from "./packages/ThreeJS/plugin"
import Router from "./packages/router/plugin"
import Stats from "./packages/Stats/plugin"
import Gui from "./packages/datGUI/plugin"
import routes from "./routes"

import "vue-global-api"

import "vue-toastification/dist/index.css"
import "./vendors.css"
import "./style.css"

createApp(App)
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
  .use(Gui, { routes })
  .directive("visible", Visible)
  .directive("dbvideo", DBVideo)
  .mount("#app")
