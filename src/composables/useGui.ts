import dat from "dat.gui"

import { computed, ComputedRef, inject, reactive, ref } from "vue"
import { createEventHook, get, useDevicesList } from "@vueuse/core"
import { normalizeDeviceLabel, randomTitle } from "../misc/utils"

export function useGui(option?: dat.GUIParams) {
  // const gui = inject<dat.GUI>("gui")
  if (option === undefined) {
    throw new Error("implement no name gui")
  }

  const gui = new dat.GUI(option)

  return {
    gui
  }
}
