import { Loop } from "@depth/core"
import { loopState } from "./state"
import "./styles/main.css"
import "@depth/wc"

new Loop({
  autoStart: true,
  statem: loopState,
  cb: (delta) => void console.log("TICIK", delta),
})

const template = document.querySelector<HTMLTemplateElement>("#tpl")
const container = document.querySelector<HTMLElement>("#app")
container && template && container.replaceWith(template.content.cloneNode(true))
