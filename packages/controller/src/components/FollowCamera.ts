import type { Object3D } from "three/src/core/Object3D"
import type { PropType } from "vue"
import { defineComponent } from "vue"
import { useCameraControls } from "../helpers"

export default defineComponent({
  props: {
    parent: { type: Object as PropType<Object3D>, required: false },
  },
  setup(_props, { slots }) {
    // const props = defineProps<{
    //   parent?: Object3D
    //   follow?: Object3D
    // }>()

    const cc = useCameraControls()
    cc.setPosition(0, 1, 2.5, true)

    return () => slots.default?.()
  },
})
