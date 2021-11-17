import { useCssVar, set } from "@vueuse/core"
import type { Directive, DirectiveBinding } from "vue"

/** Set the given css variable to the video element's aspect ratio */
export default ((element: HTMLVideoElement, binding: DirectiveBinding<string>) => {
  const listenerOptions = { passive: true, capture: false }
  const css = useCssVar(binding.value)

  element.addEventListener(
    "loadedmetadata",
    () => set(css, String(element.videoWidth / element.videoHeight)),
    listenerOptions
  )

  element.addEventListener("emptied", () => set(css, "1"), listenerOptions)
}) as Directive
