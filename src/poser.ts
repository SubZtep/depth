import type { PoseDetectorInput } from "@tensorflow-models/pose-detection"
import "@mediapipe/pose"
import * as poseDetection from "@tensorflow-models/pose-detection"

const detector = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, { runtime: "mediapipe" })

export async function estimateImage(image: PoseDetectorInput) {
  return await detector.estimatePoses(image)
}
