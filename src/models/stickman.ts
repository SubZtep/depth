import type { Keypoint } from "@tensorflow-models/pose-detection"
import { BLAZEPOSE_KEYPOINTS, BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS } from "@tensorflow-models/pose-detection/dist/constants"
import * as THREE from "three"
import chroma from "chroma-js"
import { lineFactory, keypointFactory, whiteMaterial, redMaterial } from "./factories"

const f = chroma.scale(["black", "white"])
function getMatColor(score?: number) {
  return score !== undefined ? new THREE.Color().fromArray(f(score).rgb()) : new THREE.Color(0x8a0303)
}

export class Stickman {
  joints = new Map<string, KeypointMesh>()
  lines = new Map<string, THREE.Line>()
  // scene: THREE.Scene
  // ratio = 1
  id: string
  parent: THREE.Object3D
  videoPlayer?: VideoPlayerMesh
  
  videoWidth = 0
  videoHeight = 0
  scale = 0

  // constructor(id: string, scene: THREE.Scene) {
  constructor(id: string, parent: THREE.Object3D) {
    this.id = id
    // this.scene = scene
    this.parent = parent

    this.initJoints()
    this.initLines()
    // const it = this.initJoints()
    // let res: IteratorResult<KeypointMesh> = it.next()
    // while (!res.done) {
    //   const { value } = res
    //   this.parent.add(value)
    //   this.joints.set(value.name, value)
    //   res = it.next()
    // }
  }

  initJoints() {
    for (const name of BLAZEPOSE_KEYPOINTS) {
      const joint = keypointFactory()
      joint.name = name
      this.joints.set(name, joint)
      this.parent.add(joint)
    }
    // this.parent.add(this.joints.entries())
  }

  static lineKey(i: number, j: number) {
    return `${i}-${j}`
  }

  initLines() {
    for (const [i, j] of BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS) {
      const line = lineFactory()
      this.lines.set(Stickman.lineKey(i, j), line)
      this.parent.add(line)
    }
  }

  isOnVideo(x: number, y: number) {
    return x >= 0 && x < this.videoWidth && y >= 0 && y < this.videoHeight
  }

  scaleKeypoint(keypoint: Keypoint, zMulti = 500, flipX = false, flipY = true): THREE.Vector3Tuple {
    if (keypoint.z === undefined) {
      throw new Error("no z-axis")
    }
    const mayFlippedX = flipX ? this.videoWidth - keypoint.x : keypoint.x
    const mayFlippedY = flipY ? this.videoHeight - keypoint.y : keypoint.y

    const x = mayFlippedX * this.scale
    const y = mayFlippedY * this.scale
    const z = keypoint.z * this.scale * zMulti
    return [x, y, z]
  }

  updateJoints(keypoints: Keypoint[]) {
    keypoints.forEach(kp => {
      const joint = this.joints.get(kp.name!)!
      joint.material = this.isOnVideo(kp.x, kp.y) ? whiteMaterial : redMaterial
      joint.position.fromArray(this.scaleKeypoint(kp))
    })
  }

  updateLines(keypoints: Keypoint[]) {
    for (const [i, j] of BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS) {
      const points = [
        new THREE.Vector3(...this.scaleKeypoint(keypoints[i])),
        new THREE.Vector3(...this.scaleKeypoint(keypoints[j])),
      ]
      const line = this.lines.get(Stickman.lineKey(i, j))!
      line.geometry.setFromPoints(points)
    }
  }
}
