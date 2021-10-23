// import type { PropType } from "vue"
import type { LandmarkList } from "../../../public/pose/index.d"
// import { singleFns } from "@depth/three.js"
import { watch, onBeforeUnmount, onMounted, defineComponent } from "vue"
import { Vector3, Group } from "three"
import { lineFactory, keypointFactory, boneMaterial } from "../factories"
import { BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS, BLAZEPOSE_KEYPOINTS } from "../../misc/constants"

export default defineComponent({
  props: {
    keypoints: { type: Object as PropType<LandmarkList>, required: false },
    position: { type: Array as unknown as PropType<THREE.Vector3Tuple>, default: () => [0, 0, 0] },
    scale: { type: Number, default: 1 },
    zMulti: { type: Number, default: 0.5 },
    color: { type: Number, default: 0xffffff },
    flipVertical: { type: Boolean, default: true },
  },

  setup(props) {
    const root = new Group()
    // singleFns.add(({ scene }) => scene.add(root))

    const stickmanGroup = new Group()
    stickmanGroup.position.fromArray(props.position)

    const lineKey = (i: number, j: number) => `${i}-${j}`
    const joints = new Map<number, KeypointMesh>()
    const lines = new Map<string, THREE.Line>()

    stickmanGroup.add(
      ...BLAZEPOSE_KEYPOINTS.map((v, i) => {
        const joint = keypointFactory({ name: v, color: props.color })
        joints.set(i, joint)
        return joint
      }),
      ...BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS.map(([i, j]) => {
        const key = lineKey(i, j)
        const line = lineFactory(key)
        lines.set(key, line)
        return line
      })
    )

    const mayFlipVertical = (y: number) => {
      return props.flipVertical ? props.scale - y : y
    }

    const updateJoints = (points: LandmarkList) => {
      points.forEach((point, index) => {
        joints
          .get(index)!
          .position.set(
            point.x * props.scale,
            mayFlipVertical(point.y * props.scale),
            point.z * props.scale * props.zMulti
          )
      })
    }

    const lineEnds = [new Vector3(), new Vector3()]
    const updateLines = (points: LandmarkList) => {
      BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS.forEach(([i, j]) => {
        lineEnds[0].set(
          points[i].x * props.scale,
          mayFlipVertical(points[i].y * props.scale),
          points[i].z * props.scale * props.zMulti
        )
        lineEnds[1].set(
          points[j].x * props.scale,
          mayFlipVertical(points[j].y * props.scale),
          points[j].z * props.scale * props.zMulti
        )

        const line = lines.get(lineKey(i, j))!
        line.geometry.setFromPoints(lineEnds)
        line.material = boneMaterial
      })
    }

    onMounted(() => {
      root.add(stickmanGroup)

      watch(
        [() => props.keypoints, () => props.scale, () => props.zMulti],
        () => {
          if (props.keypoints !== undefined) {
            updateJoints(props.keypoints)
            updateLines(props.keypoints)
          } else {
            console.warn("Stickman is hidden booo")
          }
        },
        { immediate: true }
      )
    })

    onBeforeUnmount(() => {
      lines.forEach(line => line.geometry.dispose())
      // singleFns.add(({ scene }) => scene.remove(root))
    })
  },

  render() {
    return () => null
  },
})
