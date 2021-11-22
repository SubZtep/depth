import metaSnailFactory from "~/3D/meshes/meta-snail"
import useSceneHelper from "~/composables/useSceneHelper"

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
