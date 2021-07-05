import type { Directive } from "vue"

export default ((el, binding) => {
  el.style.visibility = binding.value ? "visible" : "hidden"
}) as Directive
