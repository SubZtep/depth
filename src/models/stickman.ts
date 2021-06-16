import { get } from "@vueuse/core"
import type { Pose } from "@tensorflow-models/pose-detection"
import { SupportedModels } from "@tensorflow-models/pose-detection"
import * as kpc from "@tensorflow-models/pose-detection/dist/constants"
import { watch } from "vue"
import * as THREE from "three"
import chroma from "chroma-js"
import { sphereFactory, videoMeshFactory } from "./factories"
import { useGlobalState } from "../store"

const blazeExtraKeypoints = kpc.BLAZEPOSE_KEYPOINTS.filter(v => !kpc.COCO_KEYPOINTS.includes(v))

const f = chroma.scale(["black", "white"])
function getMatColor(score?: number) {
  return score !== undefined ? new THREE.Color().fromArray(f(score).rgb()) : new THREE.Color(0x8a0303)
}

export class Stickman {
  joints = new Map<string, KeypointMesh>()
  scene: THREE.Scene
  scale = 1
  ratio = 1
  id: string
  group: THREE.Group
  videoPlayer?: VideoPlayerMesh

  constructor(id: string, scene: THREE.Scene) {
    this.id = id
    this.scene = scene
    this.group = this.initGroup()


    const it = this.initJoints()
    let res: IteratorResult<KeypointMesh> = it.next()
    while (!res.done) {
      const { value } = res
      this.group.add(value)
      this.joints.set(value.name, value)
      res = it.next()
    }

    // console.log(useGlobalState().videos.find(({ id }) => id === this.id))
    // watch(
    //   () => useGlobalState().videos.find(({ id }) => id === this.id),
    //   () => {
    //     console.log("BIIIII")
    //   }
    // )
  }

  initGroup() {
    const group = new THREE.Group()
    group.name = `keypoints_${this.id}`
    this.scene.add(group)
    return group
  }

  *initJoints() {
    for (const name of kpc.BLAZEPOSE_KEYPOINTS) {
      const joint = sphereFactory()
      joint.name = name
      yield joint
    }
  }

  setKeypoints(model: TFModel) {
    blazeExtraKeypoints.forEach(name => {
      this.joints.get(name)!.visible = model === SupportedModels.BlazePose
    })

  }

  setVideo(videoEl: HTMLVideoElement) {
    if (this.videoPlayer) {
      this.videoPlayer.material.map!.needsUpdate = true
    } else {
      console.log("SCWE", useGlobalState().videos.find(({ id }) => id === this.id)!.visibleObj)
      this.videoPlayer = videoMeshFactory(videoEl)
      this.group.add(this.videoPlayer)
      this.videoPlayer.visible = useGlobalState().videos.find(({ id }) => id === this.id)!.visibleObj
    }

    // let vp = this.scene.getObjectByName(videoEl.id) as VideoPlayerMesh
    // if (vp) {
    //   vp.material.map!.needsUpdate = true
    // } else {
    //   this.scene.add(vp)
    // }

    const { videoWidth, videoHeight } = videoEl
    this.ratio = videoWidth / videoHeight

    const width = 4
    const height = width / this.ratio
    this.scale = width / videoWidth

    this.videoPlayer.scale.setX(width)
    this.videoPlayer.scale.setY(height)
    this.videoPlayer.position.setY(height / 2)
  }

  update(pose: Pose) {
    if (!pose) {
      console.warn("no pose for update joints", pose)
      // this.joints.forEach(j => void j.position.set(0, 0, 0))
      return
    }

    const flipX = false
    const flipY = true
    const transparent = true

    const width = 4
    const height = width / this.ratio
    const halfWidth = width / 2

    // const group = this.getGroup()

    // group.children
    pose.keypoints
      // .filter(keypoint => (keypoint.score || 0) > 0.9 && keypoint.name?.includes("eye"))
      .forEach(keypoint => {
        let x = keypoint.x * this.scale
        let y = keypoint.y * this.scale
        const z = keypoint.z ?? -0.1

        if (flipX) x = width - x
        if (flipY) y = height - y

        const joint = this.joints.get(keypoint.name!)
        // const joint = this.group.children.find(obj => obj.name === keypoint.name) as KeypointMesh | undefined

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
