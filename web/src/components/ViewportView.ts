import * as THREE from "three"
import { exec3D, loop3D } from "@depth/three.js"

export default defineComponent({
  props: {
    width: { type: Number, default: 320 },
    height: { type: Number, default: 240 },
  },

  setup(props) {
    const camera = new THREE.PerspectiveCamera(50, 1, 1, 10000)

    const vp = new THREE.Vector4()

    exec3D(({ renderer }) => {
      renderer.setScissorTest(true)

      // TODO: handle resize
      renderer.getViewport(vp)
    })

    loop3D(
      ({ renderer, scene }) => {
        if (vp.width < props.width || vp.height < props.height) {
          return
        }

        renderer.setScissor(vp.width - props.width, vp.height - props.height, props.width, props.height)
        renderer.setViewport(vp.width - props.width, vp.height - props.height, props.width, props.height)
        renderer.render(scene, camera)

        renderer.setViewport(vp)
        renderer.setScissor(vp)
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
