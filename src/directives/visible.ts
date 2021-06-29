import { Directive } from "@vue/runtime-core";

export default {
  mounted(el) {
    console.log("POSITION MOUNTED", el)
  }
} as Directive
