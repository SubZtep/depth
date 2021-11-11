import { exec3D, loop3D, camera } from "@depth/three.js"
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera"
import { CameraHelper } from "three/src/helpers/CameraHelper"
import useObjectFactory from "~/composables/useObjectFactory"
import useSingleton from "~/composables/useSingleton"
import { Vector4 } from "three/src/math/Vector4"
import useSceneHelper from "~/composables/useSceneHelper"

export default defineComponent({
  props: {
    width: { type: Number, default: 320 },
    height: { type: Number, default: 240 },
  },

  setup(props) {
    const instance = getCurrentInstance()
    if (instance === null) {
      throw new Error("Use ViewportView inside a component")
    }

    const { addForPage } = useSceneHelper()

    const single = useSingleton()
    const cam = new PerspectiveCamera(90)
    cam.position.set(0, 15, 0)
    cam.lookAt(0, 0, 0)
    cam.layers.enableAll()

    const camHelper = new CameraHelper(camera)
    camHelper.layers.enableAll()
    camHelper.layers.set(1)

    const pivot = single.get("pivot")
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
        if (vp.width < props.width || vp.height < props.height) {
          return
        }

        camHelper.update()
        pivotHelper.position.copy(pivot.position)
        pivotHelper.rotation.copy(pivot.rotation)

        renderer.setScissor(vp.width - props.width, vp.height - props.height, props.width, props.height)
        renderer.setViewport(vp.width - props.width, vp.height - props.height, props.width, props.height)
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
    return null
  },
})
