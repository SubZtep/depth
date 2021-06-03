import type { Keypoint } from "@tensorflow-models/pose-detection"
import type { Ref, ComputedRef } from "vue"
import { onMounted } from "vue"
import { invoke, pausableWatch, until } from "@vueuse/core"
import type { KeypointName } from "./usePoser"
import * as THREE from "three"
import { Vector3 } from "three"

interface SkeletonOptions {
  body: ComputedRef<Map<KeypointName, Keypoint>>
  scene: THREE.Scene
  invokeRafSync: Set<() => void>
  camera: Ref<THREE.Camera | undefined>
}

function xyzToVector3({ x, y, z }: Keypoint) {
  return new Vector3(x, y, z)
}

function xyzToDestruct({ x, y, z }: Keypoint): [number, number, number] {
  return [x, y, z || 0]
}

export function useSkeleton(options: SkeletonOptions) {
  const joints = new Map<KeypointName, THREE.Object3D>()

  const material = new THREE.MeshBasicMaterial({ color: 0x8a0303 })
  const geometry = new THREE.SphereGeometry()

  const { pause: pauseBody, resume: resumeBody } = pausableWatch(
    options.body,
    v => {
      for (const [name, kp] of v.entries()) {
        joints.get(name)?.position.set(...xyzToDestruct(kp))
      }
    },
    {
      immediate: false,
    }
  )
  pauseBody()

  onMounted(async () => {
    await invoke(async () => {
      await until(options.body).toMatch(v => v.size > 0)

      let pos: THREE.Vector3 = new Vector3()

      options.body.value.forEach((value, key) => {
        console.log(key, xyzToDestruct(value))
        // pos = xyzToVector3(value)
        pos.set(...xyzToDestruct(value))

        const sphere = new THREE.Mesh(geometry, material)
        sphere.name = key
        sphere.position.set(...xyzToDestruct(value))

        joints.set(key, sphere)
        options.scene.add(sphere)
      })

      options.camera.value?.lookAt(pos)
      resumeBody()
    })
  })

  return {}
}
