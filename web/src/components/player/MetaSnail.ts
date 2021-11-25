import useSceneHelper from "~/composables/useSceneHelper"
import {
  Quaternion,
  Object3D,
  TorusKnotGeometry,
  MeshPhongMaterial,
  Color,
  Mesh,
  Vector3,
  loop3D,
} from "@depth/three.js"

function metaSnailFactory(color: number) {
  const geometry = new TorusKnotGeometry(0.12, 0.08, 24, 5, 4, 1)
  const material = new MeshPhongMaterial({ color: new Color(color), shininess: 150, flatShading: true })
  const mesh = new Mesh(geometry, material)
  mesh.position.setY(-0.25)
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

    const fromRotation = new Quaternion()
    const toRotation = new Quaternion()

    let lerpTime = Number.NaN
    let lastUpdate = Number.NaN
    let alpha = Number.POSITIVE_INFINITY

    watch(
      [() => metaSnail.position, () => metaSnail.rotation],
      ([newPosition, newRotation]) => {
        if (Number.isNaN(lastUpdate)) {
          object3D.position.set(...newPosition)
          object3D.quaternion.set(...newRotation)
        } else {
          fromPosition.copy(object3D.position)
          toPosition.set(...newPosition)
          fromRotation.copy(object3D.quaternion)
          toRotation.set(...newRotation)
        }
        lastUpdate = performance.now()
        lerpTime = throttled || performance.now() - lastUpdate
      },
      { immediate: true }
    )

    loop3D(({ deltaTime }) => {
      if (Number.isNaN(lerpTime)) return

      // FIXME: better lerp (network latency etc)
      alpha = (performance.now() - lastUpdate - deltaTime) / lerpTime
      if (alpha <= 1) {
        object3D.position.lerpVectors(fromPosition, toPosition, alpha)
        object3D.quaternion.slerpQuaternions(fromRotation, toRotation, alpha)
      } else {
        lerpTime = Number.NaN
      }
    })

    return () => slots.default?.({ name: metaSnail.name, uuid: metaSnail.uuid })
  },
})
