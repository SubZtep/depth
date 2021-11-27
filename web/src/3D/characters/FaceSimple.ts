import { exec3D, camera } from "@depth/three.js"
import type { Ref } from "vue"
import useObjectPool from "~/composables/useObjectPool"
import { useCssVar, whenever } from "@vueuse/core"
import { Group } from "three/src/objects/Group"
import { BoxGeometry } from "three/src/geometries/BoxGeometry"
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial"
import { Mesh } from "three/src/objects/Mesh"
import { object3dTo2d } from "@depth/misc"

export default defineComponent({
  props: {
    landmarks: { type: Object as PropType<LandmarkList>, required: false },
    cssVarsTarget: { type: Object as PropType<HTMLElement>, required: false },
  },

  setup(properties) {
    const root = new Group()
    exec3D(({ scene }) => scene.add(root))

    const geometry = new BoxGeometry(0.08, 0.08, 0.08)
    const material = new MeshBasicMaterial({ color: 0xcccc22 })
    const pool = useObjectPool({ modelType: "face", creator: () => new Mesh(geometry, material), size: 468 })

    const csss: Ref<string>[] = []
    const stop = whenever(
      () => properties.cssVarsTarget,
      target => {
        for (let index = 0; index < 468; index++) {
          csss[index] = useCssVar(`--el-pos-${index}`, target)
        }
        stop()
      },
      { immediate: true }
    )

    watch(
      () => properties.landmarks,
      (landmarks?: LandmarkList) => {
        if (!landmarks || landmarks.length === 0) return

        let index: string
        let landmark: Landmark
        for ([index, landmark] of Object.entries(landmarks[0])) {
          const object3d = pool.getByIndex(+index)
          object3d.position.set(landmark.x * 10 - 5, landmark.y * -10 + 11, landmark.z * -10)

          if (properties.cssVarsTarget) {
            const [x, y] = object3dTo2d(object3d, camera)
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
    // eslint-disable-next-line unicorn/no-null
    return null
  },
})
