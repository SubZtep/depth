import { BoxGeometry, MeshBasicMaterial, Mesh } from "@depth/three.js"
import useObjectPool from "~/composables/useObjectPool"

export default defineComponent({
  props: {
    landmarks: { type: Object as PropType<LandmarkList>, required: false },
  },
  setup(props) {
    const geometry = new BoxGeometry(0.08, 0.08, 0.08)
    const material = new MeshBasicMaterial({ color: 0xcccc22 })
    const pool = useObjectPool({ modelType: "hand", creator: () => new Mesh(geometry, material), size: 21 })

    let multi = 2
    let index: string
    let landmark: Landmark
    let object3d: Mesh

    watch(
      () => props.landmarks,
      landmarks => {
        if (!landmarks || landmarks.length === 0) return

        for ([index, landmark] of Object.entries(landmarks)) {
          object3d = pool.getByIndex(+index)
          object3d.position.set(landmark.x * multi, landmark.y * -multi + 5, landmark.z * -multi)
        }
      }
    )

    onBeforeUnmount(() => {
      geometry.dispose()
      material.dispose()
    })

    return () => {
      // no slot
    }
  },
})
