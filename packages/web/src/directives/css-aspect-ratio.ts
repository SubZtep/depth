import type { Directive, DirectiveBinding } from "vue"

/** Set the given css variable to the video element's aspect ratio */
export default ((el: HTMLVideoElement, binding: DirectiveBinding<string>) => {
  const listenerOptions = { passive: true, capture: false }
  const css = useCssVar(binding.value)

  el.addEventListener("loadedmetadata", () => set(css, String(el.videoWidth / el.videoHeight)), listenerOptions)

  el.addEventListener("emptied", () => set(css, "1"), listenerOptions)
}) as Directive
