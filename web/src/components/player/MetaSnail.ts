import useSceneHelper from "~/composables/useSceneHelper"
import { Quaternion, Object3D, TorusKnotGeometry, MeshPhongMaterial, Color, Mesh } from "@depth/three.js"

function metaSnailFactory(color: number) {
  const geometry = new TorusKnotGeometry(0.12, 0.08, 24, 5, 4, 1)
  const material = new MeshPhongMaterial({ color: new Color(color), shininess: 150, flatShading: true })
  const mesh = new Mesh(geometry, material)
  mesh.position.setY(0.25)
  const pivot = new Object3D()
  pivot.add(mesh)
  return pivot
}

export default defineComponent({
  props: {
    metaSnail: { type: Object as PropType<MetaSnail>, required: true },
  },
  // eslint-disable-next-line vue/no-setup-props-destructure
  setup({ metaSnail }, { slots }) {
    const { addForPage } = useSceneHelper()
    const object3D = metaSnailFactory(metaSnail.color)
    addForPage(object3D)
    const quaternion = new Quaternion()

    watch(
      () => metaSnail.position,
      ({ x, y, z }) => {
        object3D.position.set(x, y, z)
      },
      { immediate: true }
    )

    watch(
      () => metaSnail.rotation,
      ({ x, y, z, w }) => {
        quaternion.set(x, y, z, w)
        object3D.setRotationFromQuaternion(quaternion)
      },
      { immediate: true }
    )

    return () => slots.default?.({ name: metaSnail.name, uuid: metaSnail.uuid })
  },
})
