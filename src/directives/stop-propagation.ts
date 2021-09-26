import type { Directive } from "vue"

/** Don't propagate events behind the element (aka no camera control on hud) */
export default (el => {
  useEventListener(el, "pointermove", e => {
    e.stopPropagation()
  })
  useEventListener(el, "wheel", e => {
    e.stopPropagation()
  })
}) as Directive
