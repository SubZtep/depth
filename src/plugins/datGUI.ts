import type { Plugin } from "vue"
import * as dat from "dat.gui"
import { useDevicesList } from "@vueuse/core"
import { useGlobalState } from "../store"
import { SupportedModels } from "@tensorflow-models/pose-detection"

const playable = ["", "mask.webm", "happy.webm"]
const models: TFModel[] = [SupportedModels.MoveNet, SupportedModels.BlazePose]

export default {
  install() {
    const { camera, videos } = useGlobalState()

    const gui = new dat.GUI()

    let addVideoFolder: (v: VideoState) => void
    let delVideoFolder: (folder: dat.GUI) => void

    const videoFactory = (): VideoState => ({
      id: `v${videos.length + 1}`,
      src: "",
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
      console.log(v)
      const vidF = parent.addFolder(`Video #${v.id}`)
      vidF.add(v, "src", playable)
      vidF.add(v, "visibleEl").name("video html tag")
      vidF.add(v, "visibleObj").name("video 3d object")
      vidF.add(v, "model", models)
      vidF.add({ delVideo: buttons.delVideo.bind(this, vidF, v) }, "delVideo").name("delete video")
      vidF.add(v, "addX", -10, 10, 0.1)
      vidF.add(v, "addY", -10, 10, 0.1)
      vidF.add(v, "addZ", -10, 10, 0.1)
      vidF.open()
    }

    const cameraFolder = gui.addFolder("web camera")
    cameraFolder.add(camera, "on")
    const deviceCtrl = cameraFolder.add(camera, "deviceId")
    // cameraFolder.open()

    const vidsF = gui.addFolder("video inputs")
    vidsF.add(buttons, "addVideo").name("add video")
    vidsF.open()

    addVideoFolder = addVideoGui(vidsF)
    delVideoFolder = (folder: dat.GUI) => vidsF.removeFolder(folder)
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
