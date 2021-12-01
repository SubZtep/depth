import { Color } from "three/src/math/Color"
import { Mesh } from "three/src/objects/Mesh"
import { Vector3 } from "three/src/math/Vector3"
import { Object3D } from "three/src/core/Object3D"
import { TorusKnotGeometry } from "three/src/geometries/TorusKnotGeometry"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"
import type { Quaternion } from "three/src/math/Quaternion"
import useSceneHelper from "~/composables/useSceneHelper"
import { loop3D, camera } from "@depth/three.js"
import { object3dTo2d } from "@depth/misc"

function simpleQuaternion(x: number, y: number, z: number, w: number) {
  return { x, y, z, w } as Quaternion
}

function metaSnailFactory({ position, rotation, color }: Pick<MetaSnail, "position" | "rotation" | "color">) {
  const geometry = new TorusKnotGeometry(0.12, 0.08, 24, 5, 4, 1)
  const material = new MeshPhongMaterial({ color: new Color(color), shininess: 150, flatShading: true })
  const mesh = new Mesh(geometry, material)
  mesh.rotateY(Math.PI / 2)
  const pivot = new Object3D()
  pivot.add(mesh)
  pivot.position.set(...position)
  // XXX: its a copy: https://github.com/mrdoob/three.js/blob/dev/src/math/Quaternion.js#L193
  pivot.setRotationFromQuaternion(simpleQuaternion(...rotation))
  Object.assign(pivot, { setColor: (c: number) => void mesh.material.color.set(c) }) // FIXME: custom object maybe?
  return pivot
}

export default defineComponent({
  props: {
    /** Metasnailverse remote snailuser */
    metaSnail: { type: Object as PropType<MetaSnail>, required: true },
  },
  // eslint-disable-next-line vue/no-setup-props-destructure
  setup({ metaSnail }, { slots }) {
    const { addForPage } = useSceneHelper()
    const object3D = metaSnailFactory(metaSnail)
    addForPage(object3D)

    const pos2d = ref(object3dTo2d(object3D, camera))
    const fromPosition = new Vector3()
    const toPosition = new Vector3()

    let lerpTime = Number.NaN
    let lastUpdate = Number.NaN
    let alpha = Number.POSITIVE_INFINITY

    watch(
      () => metaSnail.position,
      newPosition => {
        const now = performance.now()
        if (Number.isNaN(lastUpdate)) lastUpdate = now + import.meta.env.VITE_SUPABASE_THROTTLE

        fromPosition.copy(object3D.position)
        toPosition.set(...newPosition)

        lastUpdate = now
        lerpTime = import.meta.env.VITE_SUPABASE_THROTTLE // || now - lastUpdate
      },
      { immediate: true }
    )

    watch(
      () => metaSnail.rotation,
      rotation => {
        object3D.setRotationFromQuaternion(simpleQuaternion(...rotation))
      }
    )

    watch(
      () => metaSnail.color,
      color => {
        // @ts-ignore
        object3D.setColor(color)
      }
    )

    loop3D(({ deltaTime, cameraControlled }) => {
      if (!Number.isNaN(lerpTime)) {
        // FIXME: better lerp (network latency etc)
        alpha = (performance.now() - lastUpdate - deltaTime) / lerpTime
        if (alpha <= 1) {
          object3D.position.lerpVectors(fromPosition, toPosition, alpha)
        } else {
          lerpTime = Number.NaN
        }
      }

      if (!Number.isNaN(lerpTime) || cameraControlled) {
        set(pos2d, object3dTo2d(object3D, camera))
      }
    })

    return () => slots.default?.({ pos2d })
  },
})
