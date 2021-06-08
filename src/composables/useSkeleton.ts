import { ComputedRef, watch } from "vue"
// import { onMounted, toRaw } from "vue"
import { useObjectPool } from "./useObjectPool"
import * as THREE from "three"

// function bodyWalker(cb: (key: KeypointName, bp: BodyPoint) => void, body: ComputedRef<BodyPoints>) {
//   let key: KeypointName
//   for (key of Object.keys(body) as KeypointName[]) {
//     cb(key, body[key]!)
//   }
// }

// function bodyWalker(body: ComputedRef<JointPoints>) {
//   return (cb: (key: Joint, bp: unknown) => void) => {
//     let key: Joint
//     for (key of Object.keys(body) as Joint[]) {
//       cb(key, body[key]!)
//     }
//   }
// }

// function sphereFactory(name: Joint, position: THREE.Vector3Tuple) {
//   const geometry = new THREE.SphereGeometry()
//   const material = new THREE.MeshBasicMaterial({ color: 0x8a0303 })
//   const sphere = new THREE.Mesh(geometry, material)
//   sphere.name = name
//   sphere.position.fromArray(position)
//   return sphere
// }

export function useSkeleton(body: JointPoints, _updater?: InvokeUpdater) {
  const { pop } = useObjectPool()

  let _scene: THREE.Scene

  // export function useSkeleton(body: reactive<JointPoints>, _updater: InvokeUpdater) {
  // export function useSkeleton(body: ComputedRef<JointPoints>, updater: InvokeUpdater) {
  //   const joints = new Map<Joint, THREE.Object3D>()

  //   const { pause: pauseBodyWatch, resume: resumeBodyWatch } = pausableWatch(
  //     () => ({ ...options.body }),
  //     () => {
  //       bodyWalker(options.body)((key, bp) => {
  //         joints.get(key)!.position.fromArray(bp.position)
  //       })
  //     },
  //     { immediate: false }
  //   )
  //   pauseBodyWatch()

  const parts = new Map<Joint, THREE.Mesh>()

  const toPos: ToPosFn = ([name, _pos]) => {
    if (!parts.has(name)) {
      const obj = pop()
      obj.name = name
      _scene.add(obj)
      parts.set(name, obj)
    }
    // parts.get(name)!.position.fromArray(pos!)
    parts.get(name)!.position.fromArray([0, 20, 50])
    // console.log(parts.get(name))
  }

  watch(
    () => ({ ...body }),
    joints => {
      // const boundingBox = THREE.Box3()
      Object.entries(joints).forEach(param => toPos(param as [Joint, THREE.Vector3Tuple]))
    }
  )

  const sceneToSkeleton = (scene: THREE.Scene) => {
    _scene = scene
  }

  return {
    parts,
    sceneToSkeleton,
  }
}
