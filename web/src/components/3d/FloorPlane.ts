import { exec3D } from "@depth/canvas"
import { createGround } from "@depth/physics"
import { FrontSide } from "three/src/constants"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
import { Mesh } from "three/src/objects/Mesh"
import { h } from "vue"

export default defineComponent({
  props: {
    size: { type: Number, default: 10 },
  },
  setup({ size }, { slots }) {
    const geometry = new PlaneGeometry()
    geometry.scale(size, size, 1)
    const material = new MeshLambertMaterial({ color: 0x000300, side: FrontSide, transparent: true, opacity: 0.6 })
    const plane = new Mesh(geometry, material)

    plane.matrixAutoUpdate = false
    plane.rotateX(-Math.PI / 2)
    plane.updateMatrix()
    plane.receiveShadow = true

    exec3D(({ scene }) => {
      scene.add(plane)
    })

    createGround(size / 2, size / 2)

    return () => h("div", {}, slots.default?.())
  },
})
