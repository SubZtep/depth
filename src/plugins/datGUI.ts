import type { Plugin } from "vue"
import * as dat from "dat.gui"
import { useDevicesList } from "@vueuse/core"
import { useGlobalState } from "../store"
import { SupportedModels } from "@tensorflow-models/pose-detection"

const playable = ["", "mask.webm", "happy.webm"]
const models: TFModels[] = [SupportedModels.MoveNet, SupportedModels.BlazePose]

export default {
  install() {
    const { camera, videos } = useGlobalState()

    const gui = new dat.GUI()

    let addVideoFolder: (v: VideoState) => void
    let delVideoFolder: (folder: dat.GUI) => void

    const videoFactory = (): VideoState => ({
      id: `v${videos.length + 1}`,
      src: "",
      visible: false,
      model: models[0], 
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
      const videoFolder = parent.addFolder(`Video #${v.id}`)
      videoFolder.add(v, "src", playable)
      videoFolder.add(v, "visible")
      videoFolder.add(v, "model", models)
      videoFolder.add({ delVideo: buttons.delVideo.bind(this, videoFolder, v) }, "delVideo").name("delete video")
      videoFolder.open()
    }

    const cameraFolder = gui.addFolder("web camera")
    cameraFolder.add(camera, "on")
    const deviceCtrl = cameraFolder.add(camera, "deviceId")
    // cameraFolder.open()

    const videosFolder = gui.addFolder("video inputs")
    videosFolder.add(buttons, "addVideo").name("add video")
    videosFolder.open()

    addVideoFolder = addVideoGui(videosFolder)
    delVideoFolder = (folder: dat.GUI) => videosFolder.removeFolder(folder)
    videos.forEach(addVideoFolder)

    useDevicesList({
      requestPermissions: true,
      onUpdated: (devices: MediaDeviceInfo[]) => {
        const videoEntries = devices.filter(v => v.kind === "videoinput").map(v => [v.label, v.deviceId])
        deviceCtrl.options(Object.fromEntries(videoEntries))
        camera.deviceId = videoEntries.length > 0 ? videoEntries[0][1] : ""
        gui.updateDisplay()
      },
    })
  },
} as Plugin
