import useSceneHelper from "~/composables/useSceneHelper"
import { Object3D, TorusKnotGeometry, MeshPhongMaterial, Color, Mesh } from "@depth/three.js"

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
  setup(properties, { slots }) {
    const { addForPage } = useSceneHelper()
    const metaSnail: Ref<MetaSnail> = toRef(properties, "metaSnail")
    const object3D = metaSnailFactory(metaSnail.value)
    addForPage(object3D)

    // return () => slots.default !== undefined && slots.default({ snail })
    return () => slots.default !== undefined && slots.default({ uuid: metaSnail.value.uuid })
  },
})
