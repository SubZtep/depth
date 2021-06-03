import "./style.css"
import { TroisJSVuePlugin } from 'troisjs';

import { createApp } from "vue"
import App from "~/components/App.vue"

createApp(App).use(TroisJSVuePlugin).mount("#app")
