import "./style.css"
// import { estimateImage } from "./poser"
import { TroisJSVuePlugin } from 'troisjs';

import { createApp } from "vue"
import App from "~/components/App.vue"

createApp(App).use(TroisJSVuePlugin).mount("#app")
