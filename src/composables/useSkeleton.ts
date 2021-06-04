import type { BodyPoint, BodyPoints, KeypointName } from "./usePoser"
import { invoke, pausableWatch, until, toRefs } from "@vueuse/core"
import type { ComputedRef, Ref, UnwrapRef } from "vue"
import { onMounted } from "vue"
import * as THREE from "three"

interface SkeletonOptions {
  // body: UnwrapRef<BodyPoints>
  body: ComputedRef<BodyPoints>
  scene: THREE.Scene
  camera: Ref<THREE.Camera | undefined>
  invokeRafSync: Set<(delta: number) => void>
}

// function bodyWalker(cb: (key: KeypointName, bp: BodyPoint) => void, body: ComputedRef<BodyPoints>) {
//   let key: KeypointName
//   for (key of Object.keys(body) as KeypointName[]) {
//     cb(key, body[key]!)
//   }
// }

function bodyWalker(body: ComputedRef<BodyPoints>) {
  return (cb: (key: KeypointName, bp: BodyPoint) => void) => {
    let key: KeypointName
    for (key of Object.keys(body) as KeypointName[]) {
      cb(key, body[key]!)
    }
  }
}

function sphereFactory(name: string, position: THREE.Vector3Tuple) {
  const material = new THREE.MeshBasicMaterial({ color: 0x8a0303 })
  const geometry = new THREE.SphereGeometry()
  const sphere = new THREE.Mesh(geometry, material)
  sphere.name = name
  sphere.position.fromArray(position)
  return sphere
}

export function useSkeleton(options: SkeletonOptions) {
  const joints = new Map<KeypointName, THREE.Object3D>()

  const { pause: pauseBodyWatch, resume: resumeBodyWatch } = pausableWatch(
    () => ({ ...options.body }),
    () => {
      bodyWalker(options.body)((key, bp) => {
        joints.get(key)!.position.fromArray(bp.position)
      })
    },
    { immediate: false }
  )
  pauseBodyWatch()

  onMounted(async () => {
    await invoke(async () => {
      await until(() => ({ ...options.body })).toMatch(bp => Object.keys(bp).length > 0)
    })
    console.log("VEEGRE", options.body.value)

    bodyWalker(options.body)((key, bp) => {
      console.log("INDAWALKER", key)
      const sphere = sphereFactory(key, bp.position)
      joints.set(key, sphere)
      options.scene.add(sphere)
    })

    resumeBodyWatch()
  })

  return {}
}
