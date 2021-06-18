import type { Plugin } from "vue"
import * as dat from "dat.gui"
import { useDevicesList, createEventHook, useCssVar } from "@vueuse/core"
import { useSingleton } from "../composables/useSingleton"
import { normalizeDeviceLabel } from "../misc/utils"
import { useGlobalState } from "../store"
import { Pile } from "../models/pile"

function addWebcam(gui: dat.GUI, camera: CameraState) {
  const f = gui.addFolder("🪞web camera settings")
  f.add(camera, "on").name("🤳on")
  const deviceCtrl = f.add(camera, "deviceId").name("✯device")

  useDevicesList({
    requestPermissions: true,
    onUpdated: devices => {
      const vids = devices.filter(v => v.kind === "videoinput").map(v => [normalizeDeviceLabel(v.label), v.deviceId])
      deviceCtrl.options(Object.fromEntries(vids)).name("📡device")
      camera.deviceId = vids.length > 0 ? vids[0][1] : ""
      gui.updateDisplay()
    },
  })
}

function addOptions(gui: dat.GUI, options: OptionsState) {
  const guiScale = useCssVar("--gui-scale")
  guiScale.value = String(options.guiScale)
  const f = gui.addFolder("⚙various options")
  f.add(options, "guiScale", 0.5, 3.5, 0.1)
    .onFinishChange(v => (guiScale.value = String(v)))
    .name("🦠this gui scale")
  f.add(options, "skybox", 1, 15, 1).name("🌃sky time")
}

function addCameraControl(gui: dat.GUI) {
  const cameraHook = createEventHook<CameraEvent>()
  const btns = {
    rotate: () => cameraHook.trigger({ command: "rotate" }),
    shake: () => cameraHook.trigger({ command: "shake" }),
  }
  const f = gui.addFolder("🎥ingame camera control")
  f.add(btns, "rotate").name("✯ rotate")
  f.add(btns, "shake").name("✯ shake")
  return cameraHook
}

function addPiles(gui: dat.GUI, state: PileState[], piles: FrozenPiles) {
  const pileEvent = createEventHook<PileEvent>()

  let addPileFolder: (v: PileState) => void
  let delPileFolder: (folder: dat.GUI) => void

  const btns = {
    addPile: () => {
      const pile = new Pile()
      piles.set(pile.id, pile)
      pileEvent.trigger({ event: "add", pile })

      const pileState = pile.toState()
      state.push(pileState)
      addPileFolder(pileState)
    },
    delPile: (pf: dat.GUI, pileState: PileState) => {
      const pile = piles.get(pileState.id)
      pileEvent.trigger({ event: "delete", pile })

      delPileFolder(pf)
      state.splice(state.indexOf(pileState), 1)
      piles.delete(pile.id)
    },
  }

  const addPileGui = (parent: dat.GUI) => (pileState: PileState) => {
    const pf = parent.addFolder(`⚔ #${pileState.id}`)

    const posf = pf.addFolder("⛕position")
    posf.add(pileState.position, "x", -10, 10, 0.1).name("♀ x")
    posf.add(pileState.position, "y", -10, 10, 0.1).name("♂ y")
    posf.add(pileState.position, "z", -10, 10, 0.1).name("☭ z")

    const pile = piles.get(pileState.id) as Pile
    const tvf = pf.addFolder("🛀video input")
    tvf
      .add(pileState.videoPlayer, "visibleEl")
      .name("☢html video tag visible")
      .onChange(v => {
        pileState.videoPlayer.visibleEl = v
        // pile.videoPlayer.visible = v
        // console.log("XCCCCZXZC", v)
      })
    tvf
      .add(pileState.videoPlayer, "visibleObj")
      .name("☣scene video visible")
      .onChange(v => {
        // pile.videoPlayer.visibleEl = v
        pileState.videoPlayer.visibleEl = v
      })
    tvf
      .add(pileState.videoPlayer, "width", 1, 10, 0.1)
      .name("🍺player width")
      .onChange(v => {
        pile.videoPlayer.scale.x = v
      })

    pf.add({ delPile: btns.delPile.bind(undefined, pf, pileState) }, "delPile").name("💀delete pile")
    pf.open()
  }

  const f = gui.addFolder("👻piles of posers")
  f.add(btns, "addPile").name("😳new ╳ pile")
  f.open()

  addPileFolder = addPileGui(f)
  delPileFolder = (pf: dat.GUI) => f.removeFolder(pf)

  state.forEach(addPileFolder) // TODO: test is with preloaded piles

  return pileEvent
}

export default {
  install(app) {
    const gui = new dat.GUI()
    const state = useGlobalState()
    const { piles } = useSingleton()

    const cameraHook = addCameraControl(gui)
    app.provide("cameraHook", cameraHook)

    addWebcam(gui, state.camera)
    addOptions(gui, state.options)

    const pileHook = addPiles(gui, state.piles, piles)
    app.provide("pileHook", pileHook)
  },
} as Plugin
