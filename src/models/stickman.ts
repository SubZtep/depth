import type { Pose } from "@tensorflow-models/pose-detection"
import { SupportedModels } from "@tensorflow-models/pose-detection"
import * as kpc from "@tensorflow-models/pose-detection/dist/constants"
import * as THREE from "three"
import chroma from "chroma-js"
import { pop, push } from "../misc/object-pool"
import { videoMesh } from "./player"

const f = chroma.scale(["black", "white"])
function getMatColor(score?: number) {
  return score !== undefined ? new THREE.Color().fromArray(f(score).rgb()) : new THREE.Color(0x8a0303)
}

export class Stickman {
  joints = new Map<string, KeypointMesh>()
  scene: THREE.Scene
  scale = 1
  ratio = 1

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  setKeypoints(model: TFModels) {
    const objs: THREE.Object3D[] = Array.from(this.joints).map(([, mesh]) => mesh)
    objs.forEach(obj => {
      this.scene.remove(obj)
      push(obj as KeypointMesh)
    })
    this.joints.clear()

    const keypointNames: string[] = kpc[`${model === SupportedModels.BlazePose ? "BLAZEPOSE" : "COCO"}_KEYPOINTS`]
    keypointNames.forEach(name => {
      const mesh = pop()
      this.scene.add(mesh)
      this.joints.set(name, mesh)
    })
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
        const z = keypoint.z ?? -0.1

        if (flipX) x = width - x
        if (flipY) y = height - y

        const joint = this.joints.get(keypoint.name!)

        if (joint === undefined) {
          throw new Error(`${keypoint.name} joint is missing`)
        }

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
