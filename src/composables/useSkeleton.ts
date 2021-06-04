import { ComputedRef, ToRefs, watch } from "vue"
import { onMounted } from "vue"
import * as THREE from "three"


// function bodyWalker(cb: (key: KeypointName, bp: BodyPoint) => void, body: ComputedRef<BodyPoints>) {
//   let key: KeypointName
//   for (key of Object.keys(body) as KeypointName[]) {
//     cb(key, body[key]!)
//   }
// }

function bodyWalker(body: ComputedRef<JointPoints>) {
  return (cb: (key: Joint, bp: unknown) => void) => {
    let key: Joint
    for (key of Object.keys(body) as Joint[]) {
      cb(key, body[key]!)
    }
  }
}

function sphereFactory(name: Joint, position: THREE.Vector3Tuple) {
  const geometry = new THREE.SphereGeometry()
  const material = new THREE.MeshBasicMaterial({ color: 0x8a0303 })
  const sphere = new THREE.Mesh(geometry, material)
  sphere.name = name
  sphere.position.fromArray(position)
  return sphere
}

export function useSkeleton(body: JointPoints, _updater: InvokeUpdater) {
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

  watch(
    () => ({ ...body }),
    () => {
      console.log("BODY UPDATE", body)
    }
  )

  onMounted(async () => {
    // await invoke(async () => {
    //   await until(() => ({ ...options.body })).toMatch(bp => Object.keys(bp).length > 0)
    // })
    // console.log("VEEGRE", options.body.value)

    // bodyWalker(options.body)((key, bp) => {
    //   console.log("INDAWALKER", key)
    //   const sphere = sphereFactory(key, bp.position)
    //   joints.set(key, sphere)
    //   options.scene.add(sphere)
    // })

    // resumeBodyWatch()
  })

  return {}
}
