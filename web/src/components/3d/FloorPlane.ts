import { exec3D, useScene } from "@depth/canvas"
import { createGround, getWorld } from "@depth/physics"
import { FrontSide } from "three/src/constants"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
import { Mesh } from "three/src/objects/Mesh"
import { onScopeDispose } from "vue"

export default defineComponent({
  props: {
    size: { type: Number, default: 10 },
  },
  setup({ size }, { slots }) {
    const scene = useScene()
    const geometry = new PlaneGeometry()
    geometry.scale(size, size, 1)
    const material = new MeshLambertMaterial({ color: 0x000300, side: FrontSide, transparent: true, opacity: 0.6 })
    const plane = new Mesh(geometry, material)

    plane.matrixAutoUpdate = false
    plane.rotateX(-Math.PI / 2)
    plane.updateMatrix()
    plane.receiveShadow = true

    scene.add(plane)
    const groundCollider = createGround(size / 2, size / 2)

    onScopeDispose(() => {
      scene.remove(plane)
      getWorld().removeCollider(groundCollider, true)
    })

    return () => slots.default?.()
  },
})
