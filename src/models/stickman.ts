import type { Keypoint, Pose } from "@tensorflow-models/pose-detection"
import { SupportedModels, util } from "@tensorflow-models/pose-detection"
import * as kpc from "@tensorflow-models/pose-detection/dist/constants"
import * as THREE from "three"
import chroma from "chroma-js"
import { lineFactory, sphereFactory, videoMeshFactory } from "./factories"
import { useGlobalState } from "../store"
import { difference, average } from "../misc/utils"

const f = chroma.scale(["black", "white"])
function getMatColor(score?: number) {
  return score !== undefined ? new THREE.Color().fromArray(f(score).rgb()) : new THREE.Color(0x8a0303)
}

export class Stickman {
  joints = new Map<string, KeypointMesh>()
  lines = new Map<string, THREE.Line>()
  // scene: THREE.Scene
  scale = 1
  ratio = 1
  id: string
  rootGroup: THREE.Group
  videoPlayer?: VideoPlayerMesh

  // constructor(id: string, scene: THREE.Scene) {
  constructor(id: string) {
    this.id = id
    // this.scene = scene
    this.rootGroup = this.initGroup()

    const it = this.initJoints()
    let res: IteratorResult<KeypointMesh> = it.next()
    while (!res.done) {
      const { value } = res
      this.rootGroup.add(value)
      this.joints.set(value.name, value)
      res = it.next()
    }
  }

  initGroup() {
    const group = new THREE.Group()
    group.name = `keypoints_${this.id}`
    // this.scene.add(group)
    return group
  }

  *initJoints() {
    for (const name of kpc.BLAZEPOSE_KEYPOINTS) {
      const joint = sphereFactory()
      joint.name = name
      yield joint
    }
  }

  // assortJoints() {
  //   // TODO: move somewhere

  //   this.lines.forEach(line => {
  //     // TODO: test this and/or reuse
  //     this.scene.remove(line)
  //     line.geometry.dispose()
  //     ;(line.material as THREE.LineBasicMaterial).dispose()
  //     line.remove()
  //   })
  //   this.lines.clear()
  // }

  // setVideo(videoEl: HTMLVideoElement) {
  //   if (this.videoPlayer) {
  //     this.videoPlayer.material.map!.needsUpdate = true
  //   } else {
  //     this.videoPlayer = videoMeshFactory(videoEl)
  //     this.rootGroup.add(this.videoPlayer)
  //     this.videoPlayer.visible = useGlobalState().videos.find(({ id }) => id === this.id)!.visibleObj
  //   }

  //   const { videoWidth, videoHeight } = videoEl
  //   this.ratio = videoWidth / videoHeight

  //   const width = 4
  //   const height = width / this.ratio
  //   this.scale = width / videoWidth

  //   this.videoPlayer.scale.setX(width)
  //   this.videoPlayer.scale.setY(height)
  //   this.videoPlayer.position.setY(height / 2)
  // }

  // update(pose: Pose) {
  //   if (!pose) {
  //     console.warn("no pose for update joints", pose)
  //     // this.joints.forEach(j => void j.position.set(0, 0, 0))
  //     return
  //   }

  //   const flipX = false
  //   const flipY = true
  //   const transparent = true

  //   const width = 4
  //   const height = width / this.ratio
  //   const halfWidth = width / 2

  //   const scaleKeypoint = (keypoint: Keypoint): number[] => {
  //     let x = keypoint.x * this.scale
  //     let y = keypoint.y * this.scale
  //     const z = keypoint.z ?? -0.1

  //     if (flipX) x = width - x
  //     if (flipY) y = height - y

  //     return [x - halfWidth, y, z]
  //   }

  //   pose.keypoints.forEach(keypoint => {
  //     const joint = this.joints.get(keypoint.name!)
  //     if (joint === undefined) {
  //       throw new Error(`${keypoint.name} joint is missing`)
  //     }

  //     joint.position.fromArray(scaleKeypoint(keypoint))

  //     const material = joint.material
  //     if (transparent) {
  //       if (!material.transparent) material.transparent = true
  //       material.opacity = keypoint.score || 0
  //     } else {
  //       if (material.transparent) material.transparent = false
  //       material.color = getMatColor(keypoint.score)
  //     }
  //   })

  //   kpc.BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS.forEach(([i, j]) => {
  //     const kp1 = pose.keypoints[i]
  //     const kp2 = pose.keypoints[j]

  //     const points = [new THREE.Vector3(...scaleKeypoint(kp1)), new THREE.Vector3(...scaleKeypoint(kp2))]

  //     let line: THREE.Line
  //     const key = `${i}-${j}`
  //     if (this.lines.has(key)) {
  //       line = this.lines.get(key)!
  //     } else {
  //       line = lineFactory()
  //       this.scene.add(line)
  //       this.lines.set(key, line)
  //     }

  //     ;(line.material as THREE.LineBasicMaterial).color = getMatColor(average(kp1.score || 0, kp2.score || 0))
  //     line.geometry.setFromPoints(points)
  //   })
  // }
}
