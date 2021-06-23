import * as THREE from "three"
import type { Ref } from "vue"
import { onMounted, onBeforeUnmount, watchEffect, toRefs, ref, unref } from "vue"
import { useEventListener, get, set } from "@vueuse/core"
import { div } from "../misc/utils"

// FIXME: requestVideoFrameCallback might not working(?)
// https://github.com/mrdoob/three.js/blob/master/src/textures/VideoTexture.js

//TODO: noVideoMaterial no mandatory also make reusable
//TODO: noVideoMaterial reusable (singleton)
const loader = new THREE.TextureLoader()

export function useScenePlayer(
  videoRef: Ref<HTMLVideoElement | undefined>,
  parent: THREE.Object3D,
  opts: PileOpts,
  ratio: Ref<number>
) {
  const { width, showObj } = toRefs(opts)

  let noVideoMaterial: THREE.MeshBasicMaterial | undefined = undefined
  let videoTexture: THREE.VideoTexture | undefined = undefined
  let videoMaterial: THREE.MeshBasicMaterial | undefined = undefined
  let player: VideoPlayerMesh | undefined = undefined

  const playerGeometry = new THREE.PlaneBufferGeometry()
  const height = div(width, ratio)

  const playing = ref(false)
  useEventListener(videoRef, "play", () => set(playing, true))
  useEventListener(videoRef, "emptied", () => set(playing, false))

  onMounted(() => {
    videoTexture = new THREE.VideoTexture(unref(videoRef)!)
    videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide })

    loader.load("no-video.png", map => {
      noVideoMaterial = new THREE.MeshBasicMaterial({ map, transparent: true, side: THREE.DoubleSide })
      player = new THREE.Mesh(playerGeometry, noVideoMaterial)
      parent.add(player)

      watchEffect(() => {
        player!.visible = get(showObj)
        player!.scale.set(get(width), get(height), 1)
        player!.position.set(get(width) / 2, get(height) / 2, 0)
        player!.material = get(playing) ? videoMaterial! : noVideoMaterial!
      })
    })
  })

  onBeforeUnmount(() => {
    player && parent.remove(player)
    videoTexture?.dispose()
    videoMaterial?.dispose()
    playerGeometry.dispose()
  })

  return {
    player,
  }
}
