// import { Pile } from './../models/pile';
import * as dat from "dat.gui"
import type { Plugin } from "vue"
import { useDevicesList, createEventHook, useCssVar, useFullscreen, set } from "@vueuse/core"
// import { useSingleton } from "../composables/useSingleton"
import { normalizeDeviceLabel } from "../misc/utils"
// import { useGlobalState } from "../store"

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

function addOptions(gui: dat.GUI) {
  const hook = createEventHook<GUIEventold.Options>()
  const guiScale = useCssVar("--gui-scale")
  const { toggle } = useFullscreen()
  set(guiScale, "1.5")
  const opts = {
    guiScale: 1.5,
    skybox: 14,
    toggle,
  }

  const f = gui.addFolder("⚙various options")

  f.add(opts, "guiScale", 0.5, 3.5, 0.1)
    .onFinishChange(scale => set(guiScale, String(scale)))
    .name("🦠this gui scale")

  f.add(opts, "skybox", 1, 15, 1)
    .onFinishChange(skybox => hook.trigger({ skybox }))
    .name("🌃sky time")

  f.add(opts, "toggle").name("✯ fullscreen")

  return hook
}

function addCameraControl(gui: dat.GUI) {
  const hook = createEventHook<GUIEventold.Camera>()
  const btns = {
    rotate: () => hook.trigger({ cmd: "rotate" }),
    shake: () => hook.trigger({ cmd: "shake" }),
  }

  const f = gui.addFolder("🎥ingame camera control")
  f.add(btns, "rotate").name("✯ rotate")
  f.add(btns, "shake").name("✯ shake")

  return hook
}

// function addPiles(gui: dat.GUI, state: PileState[], piles: FrozenPiles) {
//   const hook = createEventHook<GUIEventold.Pile>()

//   let addPileFolder: (v: PileState) => void
//   let delPileFolder: (folder: dat.GUI) => void

//   const btns = {
//     addPile: () => {
//       const pile = new Pile()
//       piles.set(pile.id, pile)
//       hook.trigger({ event: "add", pile })

//       const pileState = pile.toState()
//       state.push(pileState)
//       addPileFolder(pileState)
//     },
//     delPile: (pf: dat.GUI, pileState: PileState) => {
//       const pile = piles.get(pileState.id)
//       hook.trigger({ event: "delete", pile })

//       delPileFolder(pf)
//       state.splice(state.indexOf(pileState), 1)
//       piles.delete(pile.id)
//     },
//   }

//   const addPileGui = (parent: dat.GUI) => (pileState: PileState) => {
//     const pf = parent.addFolder(`⚔ #${pileState.id}`)

//     const posf = pf.addFolder("⛕position")
//     posf.add(pileState.position, "x", -10, 10, 0.1).name("♀ x")
//     posf.add(pileState.position, "y", -10, 10, 0.1).name("♂ y")
//     posf.add(pileState.position, "z", -10, 10, 0.1).name("☭ z")

//     const pile = piles.get(pileState.id) as Pile
//     const tvf = pf.addFolder("🛀video input")
//     tvf
//       .add(pileState.videoPlayer, "visibleEl")
//       .name("☢html video tag visible")
//       .onChange(v => {
//         pileState.videoPlayer.visibleEl = v
//         // pile.videoPlayer.visible = v
//         // console.log("XCCCCZXZC", v)
//       })
//     tvf
//       .add(pileState.videoPlayer, "visibleObj")
//       .name("☣scene video visible")
//       .onChange(v => {
//         // pile.videoPlayer.visibleEl = v
//         pileState.videoPlayer.visibleEl = v
//       })
//     tvf
//       .add(pileState.videoPlayer, "width", 1, 10, 0.1)
//       .name("🍺player width")
//       .onChange(v => {
//         pile.videoPlayer.scale.x = v
//       })

//     pf.add({ delPile: btns.delPile.bind(undefined, pf, pileState) }, "delPile").name("💀delete pile")
//     pf.open()
//   }

//   const f = gui.addFolder("👻piles of posers")
//   f.add(btns, "addPile").name("😳new ╳ pile")
//   f.open()

//   addPileFolder = addPileGui(f)
//   delPileFolder = (pf: dat.GUI) => f.removeFolder(pf)

//   state.forEach(addPileFolder) // TODO: test is with preloaded piles

//   return hook
// }

export default {
  install(app) {
    const gui = new dat.GUI()
    app.provide("gui", gui)

    // const state = useGlobalState()
    // const { piles } = useSingleton()

    // addWebcam(gui, state.camera)
    app.provide("cameraHook", addCameraControl(gui))
    app.provide("optionsHook", addOptions(gui))
    // app.provide("pileHook", addPiles(gui, state.piles, piles))
  },
} as Plugin
