import type { FaceMeshResults } from "@depth/mediapipe"
import { exec3D } from "@depth/three.js"
import { Group, Mesh, BoxGeometry, MeshBasicMaterial } from "three"
import useObjectPool from "~/composables/useObjectPool"

export default defineComponent({
  props: {
    landmarks: { type: Object as PropType<FaceMeshResults["multiFaceLandmarks"]>, required: false },
  },

  setup(props) {
    const root = new Group()

    exec3D(({ scene }) => scene.add(root))

    const geometry = new BoxGeometry(0.1, 0.1, 0.1)
    const material = new MeshBasicMaterial({ color: 0xffff00 })
    const pool = useObjectPool("face", () => new Mesh(geometry, material), 468)

    watch(
      () => props.landmarks,
      (landmarks: FaceMeshResults["multiFaceLandmarks"]) => {
        if (!landmarks || landmarks.length === 0) return
        for (const [index, landmark] of Object.entries(landmarks[0])) {
          const obj3d = pool.getByIndex(+index)
          // console.log([index, landmark, obj3d])
          obj3d.position.set(landmark.x * -10, (landmark.y * -10) + 15, landmark.z * 10)
        }
      }
    )

    onBeforeUnmount(() => {
      exec3D(({ scene }) => scene.remove(root))
    })
  },

  render() {
    return () => null
  },
})
