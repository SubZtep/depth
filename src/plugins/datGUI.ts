import type { Plugin } from "vue"
import * as dat from "dat.gui"
import { useDevicesList } from "@vueuse/core"
import { useGlobalState } from "../store"
import { SupportedModels } from "@tensorflow-models/pose-detection"
import { normalizeDeviceLabel } from "../misc/utils"

const playable = { webcam: "", "bad video": "mask.webm", "better video": "happy.webm" }
const models: TFModel[] = [SupportedModels.MoveNet, SupportedModels.BlazePose]

function addCamera(gui: dat.GUI, camera: CameraState) {
  const camF = gui.addFolder("web camera")
  camF.add(camera, "on")
  const deviceCtrl = camF.add(camera, "deviceId")

  useDevicesList({
    requestPermissions: true,
    onUpdated: (devices: MediaDeviceInfo[]) => {
      const videoEntries = devices
        .filter(v => v.kind === "videoinput")
        .map(v => [normalizeDeviceLabel(v.label), v.deviceId])
      deviceCtrl.options(Object.fromEntries(videoEntries))
      camera.deviceId = videoEntries.length > 0 ? videoEntries[0][1] : ""
      gui.updateDisplay()
    },
  })
}

function addVideos(gui: dat.GUI, videos: VideoState[]) {
  let addVideoFolder: (v: VideoState) => void
  let delVideoFolder: (folder: dat.GUI) => void

  const videoFactory = (): VideoState => ({
    id: `v${videos.length + 1}`,
    src: "",
    estimatePoses: true,
    visibleEl: false,
    visibleObj: true,
    model: models[0],
    addX: 0,
    addY: 0,
    addZ: 0,
  })

  const buttons = {
    addVideo: () => {
      const len = videos.push(videoFactory())
      addVideoFolder(videos[len - 1])
    },
    delVideo: (folder: dat.GUI, video: VideoState) => {
      delVideoFolder(folder)
      videos.splice(videos.indexOf(video), 1)
    },
  }

  const addVideoGui = (parent: dat.GUI) => (v: VideoState) => {
    const vidF = parent.addFolder(`Video #${v.id}`)
    vidF.add(v, "estimatePoses").name("estimate poses")
    vidF.add(v, "visibleEl").name("show html video tag")
    vidF.add(v, "visibleObj").name("playback in 3d scene")
    vidF.add(v, "src", playable).name("input source")
    vidF.add(v, "model", models)
    const vidPosF = vidF.addFolder("position")
    vidPosF.add(v, "addX", -10, 10, 0.1).name("x")
    vidPosF.add(v, "addY", -10, 10, 0.1).name("y")
    vidPosF.add(v, "addZ", -10, 10, 0.1).name("z")
    vidF.add({ delVideo: buttons.delVideo.bind(this, vidF, v) }, "delVideo").name("delete video")
    vidF.open()
  }

  const vidsF = gui.addFolder("video inputs")
  vidsF.add(buttons, "addVideo").name("add video")
  vidsF.open()

  addVideoFolder = addVideoGui(vidsF)
  delVideoFolder = (folder: dat.GUI) => vidsF.removeFolder(folder)
  videos.forEach(addVideoFolder)
}

function addOptions(gui: dat.GUI, options: OptionsState) {
  const optF = gui.addFolder("options")
  optF.add(options, "skybox", 1, 15, 1)
}

export default {
  install() {
    const state = useGlobalState()
    const gui = new dat.GUI()

    addCamera(gui, state.camera)
    addVideos(gui, state.videos)
    addOptions(gui, state.options)
  },
} as Plugin
