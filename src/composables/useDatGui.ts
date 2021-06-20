import { createEventHook, get } from "@vueuse/core"
import { GUIController } from "dat.gui"
import { inject, reactive } from "vue"
import { useWebCam } from "./useWebCam"

let pileGroupFolder: dat.GUI | undefined = undefined
const playable = ["mask.webm", "happy.webm"]
const guiEvent = createEventHook<GUIEvent>()

export function useDatGui() {
  const { hasWebcam, videoDeviceId, webcams } = useWebCam()
  const gui = inject<dat.GUI>("gui")
  if (gui === undefined) {
    throw new Error("dat.GUI plugin is not installed")
  }

  const addPileGroup = (cb: Fn, openFolder = true) => {
    const guibtn = {
      addPile() {
        cb()
      },
    }
    pileGroupFolder = gui.addFolder("👻piles of posers")
    pileGroupFolder.add(guibtn, "addPile").name("😳new ╳ pile")
    openFolder && pileGroupFolder.open()
  }

  const addPile = (id: string, openFolder = true) => {
    if (pileGroupFolder === undefined) {
      throw new Error("add pile group first")
    }

    const f = pileGroupFolder.addFolder(`⚔ #${id}`)

    const btns = {
      delPile: () => {
        guiEvent.trigger({ delPile: id })
        pileGroupFolder!.removeFolder(f)
      },
    }

    const opts = reactive<PileOpts>({
      showEl: true,
      showObj: true,
      width: 1,
      input: {
        webcam: get(hasWebcam),
        deviceId: get(videoDeviceId) || "",
        videoSrc: "",
      },
      position: {
        x: 0,
        y: 0,
        z: 0,
      }
    })

    f.add(opts, "showEl").name("☢html video tag visible")
    f.add(opts, "showObj").name("☣scene video visible")
    f.add(opts, "width", 1, 10, 0.1).name("🍺player width")

    const inf = f.addFolder("🪞input")
    let deviceCtrl: GUIController | undefined = undefined
    let videoCtrl: GUIController | undefined = undefined
    const switchInput = (toWebcam: boolean) => {
      if (toWebcam) {
        videoCtrl?.remove()
        deviceCtrl = inf.add(opts.input, "deviceId", get(webcams)).name("📡device")
        gui.updateDisplay()
      } else {
        deviceCtrl?.remove()
        videoCtrl = inf.add(opts.input, "videoSrc", playable).name("✯video")
      }
    }
    if (get(hasWebcam)) {
      inf.add(opts.input, "webcam").name("🤳webcam").onChange(switchInput)
    }
    switchInput(opts.input.webcam)
    inf.open()

    const pf = f.addFolder("⛕position")
    pf.add(opts.position, "x", -10, 10, 0.1).name("♀ x")
    pf.add(opts.position, "y", -10, 10, 0.1).name("♂ y")
    pf.add(opts.position, "z", -10, 10, 0.1).name("☭ z")
    
    f.add(btns, "delPile").name("💀delete pile")
    
    openFolder && pf.open(), f.open()
    return opts
  }

  return {
    guiEvent,
    addPileGroup,
    addPile,
  }
}
