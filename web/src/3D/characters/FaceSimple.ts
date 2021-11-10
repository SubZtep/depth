import type { FaceMeshResults } from "@depth/mediapipe"
import { exec3D, camera } from "@depth/three.js"
import type { Ref } from "vue"
import useObjectPool from "~/composables/useObjectPool"
import { whenever } from "@vueuse/core"
import useObjectFactory from "~/composables/useObjectFactory"
import { Group } from "three/src/objects/Group"
import { BoxGeometry } from "three/src/geometries/BoxGeometry"
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial"
import { Mesh } from "three/src/objects/Mesh"
import { Vector3 } from "three/src/math/Vector3"

export default defineComponent({
  props: {
    landmarks: { type: Object as PropType<FaceMeshResults["multiFaceLandmarks"]>, required: false },
    cssVarsTarget: { type: Object as PropType<HTMLElement>, required: false },
  },

  setup(props) {
    const factory = useObjectFactory()


    const root = new Group()
    exec3D(({ scene }) =>
      scene.add(
        root,
      )
    )

    const geometry = new BoxGeometry(0.08, 0.08, 0.08)
    const material = new MeshBasicMaterial({ color: 0xcccc22 })
    const pool = useObjectPool({ modelType: "face", creator: () => new Mesh(geometry, material), size: 468 })

    let csss: Ref<string>[] = []
    const stop = whenever(
      () => props.cssVarsTarget,
      target => {
        for (let i = 0; i < 468; i++) {
          csss[i] = useCssVar(`--el-pos-${i}`, target)
        }
        stop()
      },
      { immediate: true }
    )

    const tempPos = new Vector3()
    let x: number, y: number
    watch(
      () => props.landmarks,
      (landmarks: FaceMeshResults["multiFaceLandmarks"]) => {
        if (!landmarks || landmarks.length === 0) return

        for (const [index, landmark] of Object.entries(landmarks[0])) {
          const obj3d = pool.getByIndex(+index)
          obj3d.position.set(landmark.x * 10 - 5, landmark.y * -10 + 11, landmark.z * -10)

          if (props.cssVarsTarget) {
            obj3d.updateWorldMatrix(true, false)
            obj3d.getWorldPosition(tempPos)
            tempPos.project(camera)
            // canvas is full without scrollbars, so windows size is just as good
            x = (tempPos.x * 0.5 + 0.5) * window.innerWidth
            y = (tempPos.y * -0.5 + 0.5) * window.innerHeight
            csss[index].value = `translate(${x}px,${y}px)`
          }
        }
      }
    )

    onBeforeUnmount(() => {
      exec3D(({ scene }) => scene.remove(root))
      geometry.dispose()
      material.dispose()
    })
  },

  render() {
    return null
  },
})
