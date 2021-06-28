import { TextureLoader, MeshBasicMaterial, VideoTexture, PlaneBufferGeometry, Mesh, DoubleSide } from "three"
import { onMounted, onBeforeUnmount, watchEffect, toRefs, ref, unref } from "vue"
import { useEventListener, get, set } from "@vueuse/core"
import { div } from "../misc/utils"

// FIXME: requestVideoFrameCallback might not working(?)
// https://github.com/mrdoob/three.js/blob/master/src/textures/VideoTexture.js

//TODO: noVideoMaterial no mandatory also make reusable
//TODO: noVideoMaterial reusable (singleton)
const loader = new TextureLoader()

export function useScenePlayer(
  videoRef: Ref<HTMLVideoElement>,
  parent: THREE.Object3D,
  opts: InputGroupBase,
  ratio: Ref<number>
) {
  const { width, showObj } = toRefs(opts)

  let noVideoMaterial: THREE.MeshBasicMaterial | undefined = undefined
  let videoTexture: THREE.VideoTexture | undefined = undefined
  let videoMaterial: THREE.MeshBasicMaterial | undefined = undefined
  let player: VideoPlayerMesh | undefined = undefined

  const playerGeometry = new PlaneBufferGeometry()
  const height = div(width, ratio)

  const playing = ref(false)
  useEventListener(videoRef, "play", () => set(playing, true))
  useEventListener(videoRef, "emptied", () => set(playing, false))

  onMounted(() => {
    videoTexture = new VideoTexture(unref(videoRef)!)
    videoMaterial = new MeshBasicMaterial({ map: videoTexture, side: DoubleSide })

    loader.load("no-video.png", map => {
      noVideoMaterial = new MeshBasicMaterial({ map, transparent: true, side: DoubleSide })
      player = new Mesh(playerGeometry, noVideoMaterial)
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
