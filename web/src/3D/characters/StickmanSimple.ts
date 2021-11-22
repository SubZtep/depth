import type { LandmarkList } from "@depth/mediapipe"
import { exec3D } from "@depth/three.js"
import { watch, onBeforeUnmount, onMounted, defineComponent } from "vue"
import { Vector3 } from "@depth/three.js"
import { Group } from "@depth/three.js"
import { lineFactory, keypointFactory, boneMaterial } from "../factories"
import { BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS, BLAZEPOSE_KEYPOINTS } from "../../misc/constants"

const lineKey = (index: number, index_: number) => `${index}-${index_}`

export default defineComponent({
  props: {
    keypoints: { type: Object as PropType<LandmarkList>, required: false },
    position: { type: Array as unknown as PropType<THREE.Vector3Tuple>, default: () => [0, 0, 0] },
    scale: { type: Number, default: 1 },
    zMulti: { type: Number, default: 0.5 },
    color: { type: Number, default: 0xff_ff_ff },
    flipVertical: { type: Boolean, default: true },
  },

  setup(properties) {
    const root = new Group()
    exec3D(({ scene }) => scene.add(root))

    const stickmanGroup = new Group()
    stickmanGroup.position.fromArray(properties.position)

    const joints = new Map<number, KeypointMesh>()
    const lines = new Map<string, THREE.Line>()

    stickmanGroup.add(
      ...BLAZEPOSE_KEYPOINTS.map((v, index) => {
        const joint = keypointFactory({ name: v, color: properties.color })
        joints.set(index, joint)
        return joint
      }),
      ...BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS.map(([index, index_]) => {
        const key = lineKey(index, index_)
        const line = lineFactory(key)
        lines.set(key, line)
        return line
      })
    )

    const mayFlipVertical = (y: number) => {
      return properties.flipVertical ? properties.scale - y : y
    }

    const updateJoints = (points: LandmarkList) => {
      for (const [index, point] of points.entries()) {
        joints
          .get(index)!
          .position.set(
            point.x * properties.scale,
            mayFlipVertical(point.y * properties.scale),
            point.z * properties.scale * properties.zMulti
          )
      }
    }

    const lineEnds = [new Vector3(), new Vector3()]
    const updateLines = (points: LandmarkList) => {
      for (const [index, index_] of BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS) {
        lineEnds[0].set(
          points[index].x * properties.scale,
          mayFlipVertical(points[index].y * properties.scale),
          points[index].z * properties.scale * properties.zMulti
        )
        lineEnds[1].set(
          points[index_].x * properties.scale,
          mayFlipVertical(points[index_].y * properties.scale),
          points[index_].z * properties.scale * properties.zMulti
        )

        const line = lines.get(lineKey(index, index_))!
        line.geometry.setFromPoints(lineEnds)
        line.material = boneMaterial
      }
    }

    onMounted(() => {
      root.add(stickmanGroup)

      watch(
        [() => properties.keypoints, () => properties.scale, () => properties.zMulti],
        () => {
          if (properties.keypoints !== undefined) {
            updateJoints(properties.keypoints)
            updateLines(properties.keypoints)
          } else {
            console.warn("Stickman is hidden booo")
          }
        },
        { immediate: true }
      )
    })

    onBeforeUnmount(() => {
      for (const line of lines) line.geometry.dispose()
      exec3D(({ scene }) => scene.remove(root))
    })
  },

  render() {
    // eslint-disable-next-line unicorn/no-null
    return () => null
  },
})
