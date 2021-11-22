import { exec3D, loop3D, camera, PerspectiveCamera, CameraHelper, Vector4 } from "@depth/three.js"
import { useSingleton } from "@depth/misc"
import useObjectFactory from "~/composables/useObjectFactory"
import useSceneHelper from "~/composables/useSceneHelper"
import { addGuiFolder } from "@depth/dat.gui"

export default defineComponent({
  setup() {
    const instance = getCurrentInstance()
    if (instance === null) {
      throw new Error("Use ViewportView inside a component")
    }

    const { singleton } = useSingleton()
    const cam = new PerspectiveCamera(90)

    const state = reactive({
      width: 320,
      height: 240,
      elevation: 15,
      view: "y",
    })

    addGuiFolder(folder => {
      folder.name = "🎥 Viewport View"
      folder.add(state, "width", 1, 1024, 1)
      folder.add(state, "height", 1, 768, 1)
      folder.add(state, "elevation", 1, 100, 1).onChange(value => {
        cam.position.y = value
      })
      folder.add(state, "view", ["x", "y", "z"]).onChange(value => {
        cam.position.set(0, 0, 0)
        cam.position[value] = state.elevation * (value === "y" ? 1 : -1)
      })
    })

    const { addForPage } = useSceneHelper()

    cam.position.set(0, state.elevation, 0)
    cam.lookAt(0, 0, 0)
    cam.layers.enableAll()
    // cam.layers.set(1)

    const camHelper = new CameraHelper(camera)
    camHelper.layers.enableAll()
    camHelper.layers.set(1)

    const pivot = singleton.get("pivot")
    const pivotHelper = useObjectFactory().cone()
    pivotHelper.geometry.rotateX(Math.PI / 2)
    pivotHelper.layers.enableAll()

    addForPage(camHelper, pivotHelper, cam)
    const vp = new Vector4()
    exec3D(({ renderer }) => {
      renderer.setScissorTest(true)
      renderer.getViewport(vp)
    })

    loop3D(
      ({ renderer, scene }) => {
        if (vp.width < state.width || vp.height < state.height) {
          return
        }

        camHelper.update()
        pivotHelper.position.copy(pivot.position)
        pivotHelper.rotation.copy(pivot.rotation)

        renderer.setScissor(vp.width - state.width, vp.height - state.height, state.width, state.height)
        renderer.setViewport(vp.width - state.width, vp.height - state.height, state.width, state.height)
        renderer.render(scene, cam)

        renderer.setViewport(vp)
        renderer.setScissor(vp)
        // useRenderLoop will render the (early) rest
      },
      { inject: "rendered" }
    )

    onBeforeUnmount(() => {
      exec3D(({ renderer }) => {
        renderer.setScissorTest(false)
      })
    })
  },

  render() {
    // eslint-disable-next-line unicorn/no-null
    return null
  },
})
