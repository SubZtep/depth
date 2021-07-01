import { Directive } from "@vue/runtime-core";

export default {
  mounted(el) {
    console.log("VISIBLE MOUNTED", el)
  }
} as Directive
