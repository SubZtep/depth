import * as THREE from "three"
import type { Ref } from "vue"
import { onMounted, onBeforeUnmount, watch, toRaw } from "vue"
import { unrefElement, useEventListener } from "@vueuse/core"
import { rescaler } from "../misc/utils"

// FIXME: requestVideoFrameCallback might not working(?)
// https://github.com/mrdoob/three.js/blob/master/src/textures/VideoTexture.js

let noVideoMaterial: THREE.MeshBasicMaterial
new THREE.TextureLoader().load("no-video.png", map => {
  noVideoMaterial = new THREE.MeshBasicMaterial({ map, transparent: true, side: THREE.DoubleSide })
})

export function useScenePlayer(videoRef: Ref<HTMLVideoElement | undefined>, parent: THREE.Object3D, guiOpts: PileOpts) {
  let mesh: THREE.Mesh
  let geometry: THREE.PlaneBufferGeometry
  let videoTexture: THREE.VideoTexture
  let videoMaterial: THREE.MeshBasicMaterial
  let rescale: RescaleFn | undefined = undefined

  useEventListener<{ target: HTMLVideoElement }>(videoRef, "canplay", ({ target }) => {
    const { videoWidth, videoHeight } = target
    rescale = rescaler(videoWidth, videoHeight)
    const opts = toRaw(guiOpts)
    const { height } = rescale(opts.width)
    mesh.scale.set(opts.width, height, 1)
    mesh.position.set(opts.width / 2, height / 2, 0)
  })

  useEventListener(videoRef, "playing", () => {
    mesh.material = videoMaterial
  })

  useEventListener(videoRef, "emptied", () => {
    mesh.material = noVideoMaterial
  })

  const handleGuiUpdate = (guiOpts: PileOpts) => {
    let forceUpdate = false
    if (rescale === undefined) {
      rescale = rescaler(1, 1)
      forceUpdate = true
    }

    const opts = toRaw(guiOpts)

    if (forceUpdate || opts.width !== mesh.scale.x) {
      const { height } = rescale(opts.width)
      mesh.scale.set(opts.width, height, 1)
      mesh.position.set(opts.width / 2, height / 2, 0)
    }

    if (forceUpdate || opts.showObj !== mesh.visible) {
      mesh.visible = opts.showObj
    }
  }

  watch(guiOpts, handleGuiUpdate)

  onMounted(() => {
    const video = unrefElement(videoRef)
    geometry = new THREE.PlaneBufferGeometry()
    videoTexture = new THREE.VideoTexture(video)
    videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide })
    mesh = new THREE.Mesh(geometry, noVideoMaterial) as VideoPlayerMesh
    parent.add(mesh)

    handleGuiUpdate(guiOpts)
  })

  onBeforeUnmount(() => {
    parent.remove(mesh)
    videoTexture.dispose()
    videoMaterial.dispose()
    geometry.dispose()
  })
}
