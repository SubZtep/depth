import { computed, inject, reactive, ref, watch } from "vue"
import { createEventHook, get, useDevicesList } from "@vueuse/core"
import { normalizeDeviceLabel, randomTitle } from "../misc/utils"

let pileGroupFolder: dat.GUI | undefined = undefined
const guiEvent = createEventHook<GUIEvent>()

export const playable = ref<string[]>([])
export const webcams = reactive(new Map<string, string>())

const { videoInputs } = useDevicesList({ requestPermissions: true })
const medias = computed<Record<string, string>>(() =>
  get(videoInputs).reduce((obj, d) => Object.assign(obj, { [normalizeDeviceLabel(d.label)]: d.deviceId }), {})
)

function inputGroupBase(id: string, f: dat.GUI) {
  return {
    id,
    f,
    showEl: true,
    showObj: true,
    width: 2,
    zMulti: 500,
    position: {
      x: -1,
      y: 0,
      z: 0,
    },
  }
}

function inputGroupBaseGui(opts: InputGroup, f: dat.GUI) {
  const df = f.addFolder("Preview Player")
  df.add(opts, "showEl").name("HTML Video Preview")
  df.add(opts, "showObj").name("Scene Video Player")
  df.add(opts, "width", 1, 10, 0.1).name("player width")
  df.open()

  const pf = f.addFolder("Pose")
  pf.add(opts, "zMulti", 1, 1000, 1).name("z axis multiplier")
  pf.open()
}

export function useDatGui() {
  const gui = inject<dat.GUI>("gui")
  if (gui === undefined) {
    throw new Error("dat.GUI plugin is not installed")
  }

  const igf = gui.addFolder("Input Groups")

  const addInput = <T extends InputGroup>(
    extraOpts: Record<"src", string> | Record<"deviceId", Record<string, string>>
  ) => {
    const id = randomTitle()
    const f = igf.addFolder(id)

    // @ts-ignore
    const opts = reactive<T>({
      ...inputGroupBase(id, f),
      ...Object.entries(extraOpts).reduce(
        (obj, [k, v]) => Object.assign(obj, { [k]: typeof v === "string" ? v : Object.values(v)[0] }),
        {}
      ),
    })


    inputGroupBaseGui(opts, f)


    Object.entries(extraOpts).forEach(([k, v]) => {
      f.add(opts, k, typeof v !== "string" ? v : undefined)
    })

    const btns = {
      del: () => {
        guiEvent.trigger({ del: opts })
        igf.removeFolder(f)
      },
    }
    f.add(btns, "del").name("Remove Input")

    guiEvent.trigger({ add: opts })
    return opts
  }

  const addVideoInput = () => addInput<VideoInputGroup>({ src: "happy.webm" })
  const addMediaInput = () => addInput<MediaInputGroup>({ deviceId: get(medias) })

  const addPile = () => {
    if (pileGroupFolder === undefined) {
      throw new Error("add pile group first")
    }

    // const opts = reactive<Pile>({
    //   showEl: false,
    //   showObj: true,
    //   width: 2,
    //   zMulti: 500,
    //   input: {
    //     webcam: false,
    //     deviceId: "",
    //     videoSrc: "",
    //   },
    //   position: {
    //     x: -1,
    //     y: 0,
    //     z: 0,
    //   },
    // })

    // const f = pileGroupFolder.addFolder(`⚔ ${randomTitle()}`)

    // const btns = {
    //   delPile: () => {
    //     guiEvent.trigger({ delPile: opts })
    //     pileGroupFolder!.removeFolder(f)
    //   },
    // }

    // const df = f.addFolder("🪞display")
    // df.add(opts, "showEl").name("☢html video tag visible")
    // df.add(opts, "showObj").name("☣scene video visible")
    // df.add(opts, "width", 1, 10, 0.1).name("🍺player width")
    // df.add(opts, "zMulti", 1, 1000, 1).name("🍺z axis multiplier")
    // df.open()

    // const inf = f.addFolder("🪞input")
    // let deviceCtrl: GUIController | undefined = undefined
    // let videoCtrl: GUIController | undefined = undefined

    // const switchInput = (toWebcam: boolean) => {
    //   if (toWebcam) {
    //     videoCtrl?.remove()
    //     const entries = Array.from(webcams.entries()).map(v => v.reverse())
    //     if (opts.input.deviceId === "" && entries.length > 0) {
    //       opts.input.deviceId = entries[0][1]
    //     }
    //     deviceCtrl = inf.add(opts.input, "deviceId", Object.fromEntries(entries)).name("📡device")
    //     gui.updateDisplay()
    //   } else {
    //     deviceCtrl?.remove()
    //     if (opts.input.videoSrc === "" && get(playable).length > 0) {
    //       opts.input.videoSrc = get(playable)[0]
    //     }
    //     videoCtrl = inf.add(opts.input, "videoSrc", get(playable)).name("✯video")
    //   }
    // }

    // inf.add(opts.input, "webcam").name("🤳webcam").onChange(switchInput)
    // switchInput(opts.input.webcam)
    // inf.open()

    // const pf = f.addFolder("⛕position")
    // pf.add(opts.position, "x", -10, 10, 0.1).name("♀ x")
    // pf.add(opts.position, "y", -10, 10, 0.1).name("♂ y")
    // pf.add(opts.position, "z", -10, 10, 0.1).name("☭ z")

    // f.add(btns, "delPile").name("💀delete pile")
    // f.open()
    // return opts
  }

  // pileGroupFolder.add(guibtn, "addPile").name("😳new ╳ pile")
  igf.add({ addVideoInput }, "addVideoInput").name("New Video File Input")
  // const mf = igf.add({ addMediaInput }, "addMediaInput")
  igf.open()

  let addMediaInputBtn: dat.GUIController | undefined = undefined

  watch(medias, newMedias => {
    if (Object.keys(newMedias).length > 0 && addMediaInputBtn === undefined) {
      addMediaInputBtn = igf.add({ addMediaInput }, "addMediaInput").name("New Camera Input")
    } else if (Object.keys(newMedias).length === 0 && addMediaInputBtn !== undefined) {
      igf.remove(addMediaInputBtn)
    }
  })

  return {
    guiEvent,
    addPile,
    addVideoInput,
  }
}
