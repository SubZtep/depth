import type { Pose, Keypoint } from "@tensorflow-models/pose-detection"
import type { KeypointName } from "./usePoser"
import { ComputedRef, ref, Ref } from "vue"
import { computed, watchEffect } from "vue"

interface Point {
  x: number
  y: number
}

type BodyPoints = Map<KeypointName, ReturnType<typeof normalizeKeypoint>>

function normalizeKeypoint(point: Keypoint): Keypoint {
  return { x: ~~(point.x / 2), y: 0, z: -3 }
}

function streamDimensionsPercentage(width: number, height: number) {
  return (point: Point): Point => ({
    x: (point.x / width) * 100,
    y: (point.y / height) * 100,
  })
}

export function useBody(pose: Pose, width: Ref<number | undefined>, height: Ref<number | undefined>) {
  let pcalc: Ref<((point: Point) => Point) | undefined> = ref()
  let body: ComputedRef<BodyPoints> = computed(() => {
    return new Map(
      pcalc.value !== undefined
        ? pose.keypoints.map(kp => {
            const norm = normalizeKeypoint({ ...kp, ...pcalc.value!(kp) })
            return [kp.name as KeypointName, norm]
          })
        : []
    )
  })

  watchEffect(() => {
    pcalc.value = width.value && height.value ? streamDimensionsPercentage(width.value, height.value) : undefined
  })

  return { body }
}
