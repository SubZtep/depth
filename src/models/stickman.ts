import type { Pose } from "@tensorflow-models/pose-detection"
import * as THREE from "three"
import chroma from "chroma-js"
import { pop } from "../misc/object-pool"

const joints = new Map<Joint, JointMesh>()

const f = chroma.scale(["black", "white"])

const jointNames: Joint[] = [
  "nose",
  "left_eye_inner",
  "left_eye",
  "left_eye_outer",
  "right_eye_inner",
  "right_eye",
  "right_eye_outer",
  "left_ear",
  "right_ear",
  "mouth_left",
  "mouth_right",
  "left_shoulder",
  "right_shoulder",
  "left_elbow",
  "right_elbow",
  "left_wrist",
  "right_wrist",
  "left_pinky",
  "right_pinky",
  "left_index",
  "right_index",
  "left_thumb",
  "right_thumb",
  "left_hip",
  "right_hip",
  "left_knee",
  "right_knee",
  "left_ankle",
  "right_ankle",
  "left_heel",
  "right_heel",
  "left_foot_index",
  "right_foot_index",
]

export function add33JointsToScene(scene: THREE.Scene) {
  if (joints.size > 0) return
  jointNames.forEach(name => {
    const obj = pop()
    scene.add(obj)
    joints.set(name, obj)
  })
}

function getMatColor(score?: number) {
  return score !== undefined ? new THREE.Color().fromArray(f(score).rgb()) : new THREE.Color(0x8a0303)
}

export function initJointUpdater(width: number, height: number) {
  const halfWidth = width / 2
  return ([pose]: Pose[], { scale, flipX, flipY, transparent }: VideoPlayerDistortion) => {
    if (!pose) {
      console.warn("no pose for update joints", pose)
      joints.forEach(j => void j.position.set(0, 0, 0))
      return
    }

    pose.keypoints
      // .filter(keypoint => (keypoint.score || 0) > 0.9 && keypoint.name?.includes("eye"))
      .forEach(keypoint => {
        let x = keypoint.x * scale
        let y = keypoint.y * scale
        const z = keypoint.z

        if (flipX) x = width - x
        if (flipY) y = height - y

        const joint = joints.get(keypoint.name as Joint)!
        joint.position.setX(x - halfWidth)
        joint.position.setY(y)
        if (z) {
          joint.position.setZ(z)
        }

        const material = joint.material
        if (transparent) {
          if (!material.transparent) material.transparent = true
          material.opacity = keypoint.score || 0
        } else {
          if (material.transparent) material.transparent = false
          material.color = getMatColor(keypoint.score)
        }
      })
  }
}
