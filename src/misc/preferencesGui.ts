import { usePreferencesStore } from "~/stores/preferences"
import { useAssets } from "~/packages/ThreeJS/useAssets"
import { singleFns, singleFnPrs } from "~/packages/ThreeJS/useRenderLoop"
import { setupBoundaries } from "~/packages/ThreeJS/useCameraControls"

export default function preferencesGui(gui: dat.GUI) {
  const preferences = usePreferencesStore()

  const guiScaleCss = useCssVar("--gui-scale")
  const { loadSkybox } = useAssets()
  const { enter, exit } = useFullscreen()

  const f = gui.addFolder("⚙ Global Preferences")
  f.add(preferences, "guiScale", 0.5, 3, 0.1)
    .name("GUI scale")
    .onFinishChange(scale => set(guiScaleCss, String(scale)))
  f.add(preferences, "skybox", 1, 15, 1)
    .name("Skybox")
    .onChange(nr =>
      singleFnPrs.add(async ({ scene }) => {
        scene.background = await loadSkybox(nr)
      })
    )
  f.add(preferences, "horizontalLock")
    .name("Rotation lock")
    .onChange(lock => {
      singleFns.add(({ cameraControls }) => {
        setupBoundaries(cameraControls, lock)
      })
    })
  f.add(preferences, "fullscreen")
    .name("Fullscreen")
    .onChange(fs => {
      // TODO: impement reactive gui checkbox
      fs ? enter() : exit()
    })
}
