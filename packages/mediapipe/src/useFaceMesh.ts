import type { Ref } from "vue"
import type { Options, FaceMeshConfig, ResultsListener } from "@mediapipe/face_mesh"
import type { MaybeRef } from "@vueuse/core"
import { FaceMesh } from "@mediapipe/face_mesh"
import { useBaseMediaPipe } from "./useBaseMediaPipe"

interface FaceMeshOptions {
  /** Video element */
  video?: MaybeRef<HTMLVideoElement>

  /** Callback function with the latest detected pose */
  handler: ResultsListener

  /** Is camera feed active? */
  streaming: Ref<boolean>
}

const options: Options = {
  selfieMode: true,
  enableFaceGeometry: false,
  maxNumFaces: 1,
  refineLandmarks: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
}

const isDev = process.env.NODE_ENV === "development"

const config: FaceMeshConfig = {
  locateFile: file => (isDev ? `/libs/face_mesh/${file}` : `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`),
}

export function useFaceMesh({ video, handler, streaming }: FaceMeshOptions) {
  const faceMesh: FaceMesh = isDev ? new FaceMesh(config) : new globalThis.FaceMesh(config)
  faceMesh.setOptions(options)
  faceMesh.onResults(handler)

  return useBaseMediaPipe({ solution: faceMesh, video, streaming })
}
