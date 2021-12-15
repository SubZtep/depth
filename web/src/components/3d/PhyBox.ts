import { exec3D, useScene } from "@depth/canvas"
import { createBoxCollider, getWorld } from "@depth/physics"
import { BoxGeometry } from "three"
import { FrontSide } from "three/src/constants"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
import { Mesh } from "three/src/objects/Mesh"
import { onScopeDispose } from "vue"

export default defineComponent({
  props: {
    size: { type: Number, default: 1 },
    position: { type: Array as PropType<PositionTuple>, required: true },
  },
  setup({ size, position }, { slots }) {
    const scene = useScene()
    const geometry = new BoxGeometry()
    // geometry.scale(size, size, 1)
    const material = new MeshLambertMaterial({ color: 0x000300, side: FrontSide, transparent: true, opacity: 0.6 })
    const boxMesh = new Mesh(geometry, material)
    boxMesh.position.set(...position as PositionTuple)

    // box.matrixAutoUpdate = false
    // box.rotateX(-Math.PI / 2)
    // box.updateMatrix()
    boxMesh.receiveShadow = true

    scene.add(boxMesh)
    const boxCollider = createBoxCollider(size / 2, size / 2, size / 2)
    // const boxBody = createBoxBody()

    // body.applyForce({ x: 0, y: 1500, z: 0 }, true)

    onScopeDispose(() => {
      scene.remove(boxMesh)
      getWorld().removeCollider(boxCollider, true)
    })

    return () => slots.default?.()
  },
})
