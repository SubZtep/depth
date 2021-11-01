import { FaceMesh, VERSION } from "@mediapipe/face_mesh"
import type { Options, FaceMeshConfig, Results, ResultsListener } from "@mediapipe/face_mesh"
import { MaybeRef, unrefElement, whenever, useRafFn } from "@vueuse/core"
import { watch } from "vue"
import type { Ref } from "vue"
import { sleep } from "@depth/misc"

export type FaceMeshResultsListener = ResultsListener
export type FaceMeshResults = Results

interface FaceMeshOptions {
  /** Video element */
  video: MaybeRef<HTMLVideoElement | undefined>

  /** Callback function with the latest detected pose */
  handler: ResultsListener

  /** Is canera feed active? */
  streaming: Ref<boolean>
}

const solutionOptions: Options = {
  selfieMode: true,
  enableFaceGeometry: false,
  maxNumFaces: 1,
  refineLandmarks: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
}

const config: FaceMeshConfig = {
  locateFile: file => {
    return  `/face_mesh/${file}`
    // return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${VERSION}/${file}`
  },
}

export async function useFaceMesh({ video, handler, streaming }: FaceMeshOptions) {
  const faceMesh = new FaceMesh(config)
  faceMesh.setOptions(solutionOptions)
  faceMesh.onResults(handler)
  await faceMesh.initialize()

  const { pause, resume } = useRafFn(async () => {
    await faceMesh.send({ image: unrefElement(video) as HTMLVideoElement })
  }, { immediate: false })

  watch(streaming, async isStreaming => {
    if (isStreaming) {
      await sleep(100)
      resume()
    } else {
      pause()
    }
  })
}
