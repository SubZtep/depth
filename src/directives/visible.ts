import { Directive } from "@vue/runtime-core";

export default ((el, binding) => {
  el.style.visibility = binding.value ? "visible" : "hidden"
}) as Directive
