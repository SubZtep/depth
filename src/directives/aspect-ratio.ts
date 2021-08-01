import type { Directive, DirectiveBinding } from "vue"

/**
 * when dimensions video tag trigger change with the aspect ratio
 */

 export default ((el: HTMLVideoElement, binding: DirectiveBinding<(ratio: string) => void>) => {
   const listenerOptions = { passive: true, capture: false }
   el.addEventListener("loadedmetadata", ({ target }) => {
     if (target) {
       // @ts-ignore
       binding.value.call(null, String(target.videoWidth / target.videoHeight))
     }
    }, listenerOptions)

   el.addEventListener("suspend", () => {
     binding.value.call(null, "1")
    }, listenerOptions)
 }) as Directive
