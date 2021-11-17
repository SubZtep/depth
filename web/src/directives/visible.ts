import type { Directive } from "vue"

export default ((element, binding) => {
  element.style.visibility = binding.value ? "visible" : "hidden"
}) as Directive
