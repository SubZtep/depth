import type { Keypoint, Pose } from "@tensorflow-models/pose-detection"
import type { MonitorBindingApi, TabApi } from "tweakpane"
import { Ref, watchEffect } from "vue"
import { invoke, until, get, tryOnMounted } from "@vueuse/core"
import { Pane } from "tweakpane"

export function useTweakGui(params: GuiParams, poses: Ref<Pose[]>) {
  const pane = new Pane({ title: "ⒹⒺⓅⓉⒽ" })

  // const posesPoses = {}
  // const posesScores = {}

  // watchEffect(() => {
  //   const ps = get(poses)
  //   if (ps.length > 0) {
  //     ps[0].keypoints.map(keypoint => {
  //       posesPoses[keypoint.name!] = { x: keypoint.x, y: keypoint.y, z: keypoint.z }
  //       posesScores[keypoint.name!] = keypoint.score
  //     })
  //   }
  // })

  tryOnMounted(() => {
    const fWebcam = pane.addFolder({ title: "webcam" })
    fWebcam.addInput(params, "webcam", { label: "live" })
    fWebcam.addInput(params, "preview")

    const fLoop = pane.addFolder({ title: "loop" })
    fLoop.addInput(params, "isActive", { label: "running" })
    fLoop.addMonitor(params, "timePerFrame", { view: "graph", min: 0, max: 60 })

    // const fLook = pane.addFolder({ title: "look" })
    // fLook.addInput(params, "skybox", { min: 1, max: 15, step: 1 })

    const fBody = pane.addFolder({ title: "body" })

    const btnLoadPoser = fBody.addButton({ title: "load poser" })
    const btnStartPoser = fBody.addButton({ title: "start poser", disabled: true })
    // const btab = fBody.addTab({ hidden: true, pages: [{ title: "position" }, { title: "score" }] })
    // const rawPoses = fBody.addMonitor(poses.value[0], "keypoints", { multiline: 5 })
    let rawPoses: MonitorBindingApi<Keypoint[]> = null

    btnLoadPoser.on("click", () => {
      btnLoadPoser.disabled = true
      params.loadPoser = true

      invoke(async () => {
        await until(() => params.loadPoser).not.toBeTruthy()
        btnStartPoser.disabled = false
        btnLoadPoser.dispose()
      })
    })

    btnStartPoser.on("click", () => {
      btnStartPoser.disabled = true
      params.startPoser = true

      invoke(async () => {
        await until(() => params.startPoser).not.toBeTruthy()
        btnStartPoser.disabled = false

        if (rawPoses) return

        invoke(async () => {
          await until(poses).toMatch(v => v.length > 0 && v[0].keypoints.length > 0)
        })
        rawPoses = fBody.addMonitor(poses.value[0], "keypoints", { multiline: 5 })

        // if (btab.hidden) {
        //   invoke(async () => {
        //     await until(poses).toMatch(v => v.length > 0 && v[0].keypoints.length > 0)
        //   })

        //   // Object.keys(posesPoses).forEach(key => {
        //   //   btab.pages[0].addMonitor(posesPoses, key, { bufferSize: 10 })
        //   //   btab.pages[1].addMonitor(posesScores, key, { bufferSize: 10 })
        //   // })

        //   btab.hidden = false
        // }
      })
    })
  })

  return { pane }
}
