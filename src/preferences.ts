import { usePreferencesStore } from "~/stores/preferences"
import { useAssets } from "~/packages/ThreeJS/useAssets"
import { singleFnPrs } from "~/packages/ThreeJS/useRenderLoop"

export function preferencesGui(gui: dat.GUI) {
  const preferences = usePreferencesStore()

  const guiScaleCss = useCssVar("--gui-scale")
  const { loadSkybox } = useAssets()

  const f = gui.addFolder("⚙ Preferences")
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
}
