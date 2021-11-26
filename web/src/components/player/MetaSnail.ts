import useSceneHelper from "~/composables/useSceneHelper"
import { loop3D } from "@depth/three.js"
import { Mesh } from "three/src/objects/Mesh"
import { Color } from "three/src/math/Color"
import { Vector3 } from "three/src/math/Vector3"
import { Object3D } from "three/src/core/Object3D"
import { TorusKnotGeometry } from "three/src/geometries/TorusKnotGeometry"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"

function metaSnailFactory(color: number) {
  const geometry = new TorusKnotGeometry(0.12, 0.08, 24, 5, 4, 1)
  const material = new MeshPhongMaterial({ color: new Color(color), shininess: 150, flatShading: true })
  const mesh = new Mesh(geometry, material)
  mesh.position.setY(0.25)
  mesh.rotateY(Math.PI / 2)
  const pivot = new Object3D()
  pivot.add(mesh)
  return pivot
}

export default defineComponent({
  props: {
    metaSnail: { type: Object as PropType<MetaSnail>, required: true },
    /** Throttle time in miliseconds */
    throttled: { type: Number, required: true },
  },
  // eslint-disable-next-line vue/no-setup-props-destructure
  setup({ metaSnail, throttled }, { slots }) {
    const { addForPage } = useSceneHelper()
    const object3D = metaSnailFactory(metaSnail.color)
    addForPage(object3D)

    const fromPosition = new Vector3()
    const toPosition = new Vector3()

    let lerpTime = Number.NaN
    let lastUpdate = Number.NaN
    let alpha = Number.POSITIVE_INFINITY

    watch(
      () => metaSnail.position,
      newPosition => {
        if (Number.isNaN(lastUpdate)) {
          object3D.position.set(...newPosition)
        } else {
          fromPosition.copy(object3D.position)
          toPosition.set(...newPosition)
        }
        lastUpdate = performance.now()
        lerpTime = throttled || performance.now() - lastUpdate
      },
      { immediate: true }
    )

    watch(
      () => metaSnail.rotation,
      ([x, y, z, w]) => {
        object3D.quaternion.set(x, y, z, w)
      },
      { immediate: true }
    )

    loop3D(({ deltaTime }) => {
      if (Number.isNaN(lerpTime)) return

      // FIXME: better lerp (network latency etc)
      alpha = (performance.now() - lastUpdate - deltaTime) / lerpTime
      if (alpha <= 1) {
        object3D.position.lerpVectors(fromPosition, toPosition, alpha)
      } else {
        lerpTime = Number.NaN
      }
    })

    return () => slots.default?.({ name: metaSnail.name, uuid: metaSnail.uuid })
  },
})
