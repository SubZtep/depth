import { ref } from "vue"
import { createEventHook, useToggle, set } from "@vueuse/core"
import type { EventHook } from "@vueuse/core"
import { setupBoundaries } from "./useCameraControls"
import { exec3D } from "./useRenderLoop"

export type RenderFramesParam = "All" | "CameraMove"
export type CameraBoundariesParam = "Full" | "Simple" | "Off"

interface C3DPause {
  cmd: "Pause"
}

interface C3DResume {
  cmd: "Resume"
}

interface C3DRenderFrames {
  cmd: "RenderFrames"
  param: RenderFramesParam
}

interface C3DCameraBoundaries {
  cmd: "CameraBoundaries"
  param: CameraBoundariesParam
}

export type Command3D = C3DPause | C3DResume | C3DRenderFrames | C3DCameraBoundaries

export const eventHook: EventHook<Command3D> = createEventHook()

export function eventHookHandler() {
  const [isRunning, toggleRun] = useToggle(false)
  const renderFrames = ref<RenderFramesParam>("All")
  const sceneEl = document.querySelector("#scene") as HTMLElement

  const onEvent = (ev: Command3D) => {
    switch (ev.cmd) {
      case "Pause":
        toggleRun(false)
        sceneEl.classList.add("paused")
        break
      case "Resume":
        sceneEl.classList.remove("paused")
        toggleRun(true)
        break
      case "RenderFrames":
        set(renderFrames, ev.param)
        break
      case "CameraBoundaries":
        exec3D(({ cameraControls }) => {
          setupBoundaries(cameraControls, ev.param)
        })
        break
    }
  }

  return {
    onEvent,
    isRunning,
    renderFrames,
  }
}
