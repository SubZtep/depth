import { createEventHook, useToggle, set } from "@vueuse/core"
import type { EventHook } from "@vueuse/core"
import { ref } from "vue"
import { setupBoundaries } from "./useCameraControls"
import { exec3D } from "."

// import type { ThreeJSEvent } from "./useThreeJS"
// const eventHook = createEventHook<ThreeJSEvent>()

// type ThreeJSEventCmd = "pauseLoop" | "resumeLoop" | "renderAllFrames" | "renderFramesWithCameraMove"
// type ThreeJSEventCmd = "pauseLoop" | "resumeLoop" | "renderAllFrames" | "renderFramesWithCameraMove"

// type Command3D = "Pause" | "Resume" | "RenderFrames" | "CameraBoundaries"

// interface Command3D {
//   cmd: "Pause" | "Resume" | "RenderFrames" | "CameraBoundaries"
// }

// type Cmd = "Pause" | "Resume" | "RenderFrames" | "CameraBoundaries"
export type RenderFramesParam = "All" | "CameraMove"
export type CameraBoundariesParam = "Full" | "Simple" | "Off"

// export interface Command3D<T extends Cmd> {
//   cmd: T
//   param: T extends "Pause"
//     ? void
//     : T extends "Resume"
//     ? void
//     : T extends "RenderFrames"
//     ? RenderFramesParam
//     : T extends "CameraBoundaries"
//     ? CameraBoundariesParam
//     : never
// }

interface Command3DPause {
  cmd: "Pause"
}

interface Command3DResume {
  cmd: "Resume"
}

interface Command3DRenderFrames {
  cmd: "RenderFrames"
  param: RenderFramesParam
}

interface Command3DCameraBoundaries {
  cmd: "CameraBoundaries"
  param: CameraBoundariesParam
}

export type Command3D = Command3DPause | Command3DResume | Command3DRenderFrames | Command3DCameraBoundaries

export const eventHook = createEventHook<Command3D>()
// const eventHook = createEventHook<EventHook<Command3D>>()
// export default eventHook

export function eventHookHandler() {
  const [isRunning, toggleRun] = useToggle(false)
  const renderFrames = ref<RenderFramesParam>("All")
  const sceneEl = document.querySelector("#scene") as HTMLElement

  const onEvent = (ev: Command3D) => {
    switch(ev.cmd) {
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

// eventHook.on(({ cmd: "Pause" }) => {
//   //
// })

// type Command3D = {
//   cmd: "Pause" | "Resume"
// } | {
//   cmd: "RenderFrames"
//   render: "all" | "CameraMove"
// } | {
//   cmd: "CameraBoundaries"

// }

// export type ThreeJSEvent = ThreeJSEventCmd | { cmd: ThreeJSEventCmd }

// export function normalizeEventHookParam(param: ThreeJSEvent) {
//   return typeof param === "string" ? { cmd: param } : param
// }
