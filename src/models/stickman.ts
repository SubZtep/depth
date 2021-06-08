import * as THREE from "three"
import { objectPool } from "../misc/object-pool"

const { pop } = objectPool()
let _scene: THREE.Scene

const joints = new Map<Joint, THREE.Mesh>()

const toPos: ToPosFn = ([name, _pos]) => {
  if (!joints.has(name)) {
    const obj = pop()
    obj.name = name
    _scene.add(obj)
    joints.set(name, obj)
  }
  // parts.get(name)!.position.fromArray(pos!)
  joints.get(name)!.position.fromArray([0, 20, 50])
}

export function jointsToScene() {
  const freshJoints: THREE.Mesh[] = []
  joints.forEach(v => void freshJoints.push(v))
  return freshJoints
}

export function stickman(body: JointPoints) {
  Object.entries(body).forEach(param => toPos(param as [Joint, THREE.Vector3Tuple]))

  // const sceneToSkeleton = (scene: THREE.Scene) => {
  //   _scene = scene
  // }

  return {
    // parts: joints,
    // sceneToSkeleton,
  }
}
