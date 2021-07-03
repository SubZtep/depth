import { Vector3 } from "three"
import type { Ref } from "vue"
import type { Keypoint } from "@tensorflow-models/pose-detection"
import { get } from "@vueuse/core"
import {
  BLAZEPOSE_KEYPOINTS,
  BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS,
} from "@tensorflow-models/pose-detection/dist/constants.js"
import { lineFactory, keypointFactory, whiteMaterial, redMaterial } from "./factories"

export class Stickman {
  joints = new Map<string, KeypointMesh>()
  lines = new Map<string, THREE.Line>()
  parent: THREE.Object3D

  videoWidth: Ref<number>
  videoHeight: Ref<number>
  scale: Ref<number>
  zMulti: Ref<number>

  constructor(parent: THREE.Object3D, videoWidth: Ref<number>, videoHeight: Ref<number>, scale: Ref<number>, zMulti: Ref<number>) {
    this.videoWidth = videoWidth
    this.videoHeight = videoHeight
    this.scale = scale
    this.parent = parent
    this.zMulti = zMulti
    this.initJoints()
    this.initLines()
  }

  initJoints() {
    for (const name of BLAZEPOSE_KEYPOINTS) {
      const joint = keypointFactory()
      joint.name = name
      this.joints.set(name, joint)
    }
    this.parent.add(...Array.from(this.joints.values()))
  }

  static lineKey(i: number, j: number) {
    return `${i}-${j}`
  }

  initLines() {
    for (const [i, j] of BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS) {
      const line = lineFactory()
      this.lines.set(Stickman.lineKey(i, j), line)
    }
    this.parent.add(...Array.from(this.lines.values()))
  }

  isOnVideo(x: number, y: number) {
    return x >= 0 && x < get(this.videoWidth) && y >= 0 && y < get(this.videoHeight)
  }

  scaleKeypoint(keypoint: Keypoint, flipX = false, flipY = true): THREE.Vector3Tuple {
    if (keypoint.z === undefined) {
      throw new Error("no z-axis")
    }
    const mayFlippedX = flipX ? get(this.videoWidth) - keypoint.x : keypoint.x
    const mayFlippedY = flipY ? get(this.videoHeight) - keypoint.y : keypoint.y

    const x = mayFlippedX * get(this.scale)
    const y = mayFlippedY * get(this.scale)
    const z = keypoint.z * get(this.scale) * get(this.zMulti)
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
        new Vector3(...this.scaleKeypoint(keypoints[i])),
        new Vector3(...this.scaleKeypoint(keypoints[j])),
      ]
      const line = this.lines.get(Stickman.lineKey(i, j))!
      line.geometry.setFromPoints(points)
    }
  }

  dispose() {
    this.lines.forEach(line => line.geometry.dispose())
  }
}
