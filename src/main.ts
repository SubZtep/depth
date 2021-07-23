import { createApp } from "vue"
import Toast from "vue-toastification"
import App from "./components/scene/App.vue"
import Visible from "./directives/visible"
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
    timeout: 3000,
    position: "bottom-right",
    showCloseButtonOnHover: true,
  })
  .use(Supabase, {
    url: import.meta.env.VITE_SUPABASE_URL as string,
    key: import.meta.env.VITE_SUPABASE_KEY as string,
  })
  .use(Router, { routes })
  .use(ThreeJs)
  .use(Stats, { mosaic: true })
  .use(Gui, { routes })
  .directive("visible", Visible)
  .mount("#app")
