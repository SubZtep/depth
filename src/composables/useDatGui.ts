import { computed, ComputedRef, inject, reactive, ref, watch } from "vue"
import { createEventHook, get, useDevicesList } from "@vueuse/core"
import { normalizeDeviceLabel, randomTitle } from "../misc/utils"

export const playable = ref<string[]>([])
export const webcams = reactive(new Map<string, string>())

const guiEvent = createEventHook<GUIEvent.MutateInputGroup>()
let medias: ComputedRef<Record<string, string>> = computed(() => ({}))

function inputGroupBase(id: string, f: dat.GUI) {
  return {
    id,
    open: () => f.open(),
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

function inputGroupBaseGui<T = VideoInputGroup | MediaInputGroup>(opts: T, f: dat.GUI) {
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
  const addInput = (extraOpts: Record<"src", string> | Record<"deviceId", Record<string, string>>) => {
    const id = randomTitle()
    const f = igf.addFolder(id)
    const group = reactive({
      ...inputGroupBase(id, f),
      ...Object.entries(extraOpts).reduce(
        (obj, [k, v]) => Object.assign(obj, { [k]: typeof v === "string" ? v : Object.values(v)[0] }),
        {}
      ),
    }) as InputGroup

    inputGroupBaseGui(group, f)
    Object.entries(extraOpts).forEach(([k, v]) => {
      f.add(group, k, typeof v !== "string" ? v : undefined)
    })

    const btns = {
      del: () => {
        guiEvent.trigger({ cmd: "delete", group })
        igf.removeFolder(f)
      },
    }
    f.add(btns, "del").name("Remove Input")
    guiEvent.trigger({ cmd: "add", group })
    return group
  }

  const addVideoInput = () => addInput({ src: "happy.webm" })
  const addMediaInput = () => {
    const { videoInputs } = useDevicesList({ requestPermissions: true })
    medias = computed(() =>
      get(videoInputs).reduce((obj, d) => Object.assign(obj, { [normalizeDeviceLabel(d.label)]: d.deviceId }), {})
    )
    addInput({ deviceId: get(medias) })
  }

  igf.add({ addVideoInput }, "addVideoInput").name("New Video File Input")
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
  }
}
