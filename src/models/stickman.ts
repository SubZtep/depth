import type { Pose } from "@tensorflow-models/pose-detection"
import * as THREE from "three"
import chroma from "chroma-js"
import { pop } from "../misc/object-pool"
import { videoMesh } from "./player"

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


export class Stickman {
  joints = new Map<Joint, JointMesh>()
  scene: THREE.Scene
  scale = 1
  ratio = 1
  getMatColor: any

  constructor(scene: THREE.Scene, lightColor = "green") {
    this.scene = scene
    if (this.joints.size > 0) return
    jointNames.forEach(name => {
      const obj = pop()
      scene.add(obj)
      this.joints.set(name, obj)
    })

    const f = chroma.scale(["black", lightColor])
    const getMatColor = (f: chroma.Scale<chroma.Color>) => (score?: number) => {
      return score !== undefined ? new THREE.Color().fromArray(f(score).rgb()) : new THREE.Color(0x8a0303)
    }
    this.getMatColor = getMatColor(f)
  }

  setVideo(videoEl: HTMLVideoElement) {
    let vp = this.scene.getObjectByName(videoEl.id) as VideoPlayerMesh
    if (vp) {
      vp.material.map!.needsUpdate = true
    } else {
      vp = videoMesh(videoEl)
      this.scene.add(vp)
    }

    const { videoWidth, videoHeight } = videoEl
    this.ratio = videoWidth / videoHeight

    const width = 4
    const height = width / this.ratio
    this.scale = width / videoWidth

    vp.scale.setX(width)
    vp.scale.setY(height)
    vp.position.setY(height / 2)
  }

  update(pose: Pose) {
    if (!pose) {
      console.warn("no pose for update joints", pose)
      this.joints.forEach(j => void j.position.set(0, 0, 0))
      return
    }

    const flipX = false
    const flipY = true
    const transparent = true

    const width = 4
    const height = width / this.ratio
    const halfWidth = width / 2

    pose.keypoints
      // .filter(keypoint => (keypoint.score || 0) > 0.9 && keypoint.name?.includes("eye"))
      .forEach(keypoint => {
        let x = keypoint.x * this.scale
        let y = keypoint.y * this.scale
        const z = keypoint.z

        if (flipX) x = width - x
        if (flipY) y = height - y

        const joint = this.joints.get(keypoint.name as Joint)!
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
          material.color = this.getMatColor(keypoint.score)
        }
      })
  }
}
