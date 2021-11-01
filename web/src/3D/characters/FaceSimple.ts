import type { FaceMeshResults } from "@depth/mediapipe"
import { exec3D, camera } from "@depth/three.js"
import { Group, Vector3, Box3, Mesh, BoxGeometry, MeshBasicMaterial } from "three"
import type { Ref } from "vue"
import useObjectPool from "~/composables/useObjectPool"

export default defineComponent({
  props: {
    landmarks: { type: Object as PropType<FaceMeshResults["multiFaceLandmarks"]>, required: false },
    cssVarsTarget: { type: Object as PropType<HTMLElement>, required: false },
  },

  setup(props) {
    const root = new Group()
    root.rotateOnAxis(new Vector3(1, 0, 0), Math.PI / 3)

    exec3D(({ scene, cameraControls }) => {
      scene.add(root)
      cameraControls.fitToBox(new Box3(new Vector3(-10, 5, 0), new Vector3(10, 0, 0)), true)
    })

    const geometry = new BoxGeometry(0.1, 0.1, 0.1)
    const material = new MeshBasicMaterial({ color: 0xffff00 })
    const pool = useObjectPool("face", () => new Mesh(geometry, material), 468)

    let csss: Ref<string>[] = []
    if (props.cssVarsTarget) {
      for (let i = 0; i < 468; i++) {
        csss[i] = useCssVar(`--el-pos-${i}`, props.cssVarsTarget)
      }
    }

    const tempV = new Vector3()
    let x: number, y: number
    watch(
      () => props.landmarks,
      (landmarks: FaceMeshResults["multiFaceLandmarks"]) => {
        if (!landmarks || landmarks.length === 0) return

        for (const [index, landmark] of Object.entries(landmarks[0])) {
          const obj3d = pool.getByIndex(+index)
          obj3d.position.set(landmark.x * 10 - 5, landmark.y * -10 + 15, landmark.z * -10)

          if (props.cssVarsTarget) {
            obj3d.updateWorldMatrix(true, false)
            obj3d.getWorldPosition(tempV)
            tempV.project(camera)
            x = (tempV.x * 0.5 + 0.5) * window.innerWidth
            y = (tempV.y * -0.5 + 0.5) * window.innerHeight
            csss[index].value = `translate(${x}px,${y}px)`
          }
        }
      }
    )

    onBeforeUnmount(() => {
      exec3D(({ scene }) => scene.remove(root))
    })
  },

  render() {
    return null
  },
})
