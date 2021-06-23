import { GUIController } from "dat.gui"
import { inject, reactive, ref } from "vue"
import { createEventHook, get } from "@vueuse/core"
import { randomTitle } from "../misc/utils"

let pileGroupFolder: dat.GUI | undefined = undefined
const guiEvent = createEventHook<GUIEvent>()

export const playable = ref<string[]>([])
export const webcams = reactive(new Map<string, string>())

export function useDatGui() {
  const gui = inject<dat.GUI>("gui")
  if (gui === undefined) {
    throw new Error("dat.GUI plugin is not installed")
  }

  const addPileGroup = (onAddPileClick: Fn) => {
    const guibtn = {
      addPile() {
        onAddPileClick()
      },
    }
    pileGroupFolder = gui.addFolder("👻piles of posers")
    pileGroupFolder.add(guibtn, "addPile").name("😳new ╳ pile")
    pileGroupFolder.open()
  }

  const addPile = () => {
    if (pileGroupFolder === undefined) {
      throw new Error("add pile group first")
    }

    const opts = reactive<PileOpts>({
      showEl: false,
      showObj: true,
      width: 2,
      zMulti: 500,
      input: {
        webcam: false,
        deviceId: "",
        videoSrc: "",
      },
      position: {
        x: -1,
        y: 0,
        z: 0,
      },
    })

    const f = pileGroupFolder.addFolder(`⚔ ${randomTitle()}`)

    const btns = {
      delPile: () => {
        guiEvent.trigger({ delPile: opts })
        pileGroupFolder!.removeFolder(f)
      },
    }

    const df = f.addFolder("🪞display")
    df.add(opts, "showEl").name("☢html video tag visible")
    df.add(opts, "showObj").name("☣scene video visible")
    df.add(opts, "width", 1, 10, 0.1).name("🍺player width")
    df.add(opts, "zMulti", 1, 1000, 1).name("🍺z axis multiplier")
    df.open()

    const inf = f.addFolder("🪞input")
    let deviceCtrl: GUIController | undefined = undefined
    let videoCtrl: GUIController | undefined = undefined

    const switchInput = (toWebcam: boolean) => {
      if (toWebcam) {
        videoCtrl?.remove()
        const entries = Array.from(webcams.entries()).map(v => v.reverse())
        if (opts.input.deviceId === "" && entries.length > 0) {
          opts.input.deviceId = entries[0][1]
        }
        deviceCtrl = inf.add(opts.input, "deviceId", Object.fromEntries(entries)).name("📡device")
        gui.updateDisplay()
      } else {
        deviceCtrl?.remove()
        if (opts.input.videoSrc === "" && get(playable).length > 0) {
          opts.input.videoSrc = get(playable)[0]
        }
        videoCtrl = inf.add(opts.input, "videoSrc", get(playable)).name("✯video")
      }
    }

    inf.add(opts.input, "webcam").name("🤳webcam").onChange(switchInput)
    switchInput(opts.input.webcam)
    inf.open()

    const pf = f.addFolder("⛕position")
    pf.add(opts.position, "x", -10, 10, 0.1).name("♀ x")
    pf.add(opts.position, "y", -10, 10, 0.1).name("♂ y")
    pf.add(opts.position, "z", -10, 10, 0.1).name("☭ z")

    f.add(btns, "delPile").name("💀delete pile")
    f.open()
    return opts
  }

  return {
    guiEvent,
    addPileGroup,
    addPile,
  }
}
