import { useEventListener } from "@vueuse/core"
import type { Directive } from "vue"

/** Don't propagate events behind the element (aka no camera control on hud) */
export default (element => {
  useEventListener(element, "pointermove", event => {
    event.stopPropagation()
  })
  useEventListener(element, "wheel", event => {
    event.stopPropagation()
  })
}) as Directive
