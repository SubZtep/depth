import "./style.css"
import "./example/index"

interface Keypoint {
  x: number
  y: number
  score: number
  name:
    | "nose"
    | "left_eye"
    | "right_eye"
    | "left_ear"
    | "right_ear"
    | "left_shoulder"
    | "right_shoulder"
    | "left_elbow"
    | "right_elbow"
    | "left_wrist"
    | "right_wrist"
    | "left_hip"
    | "right_hip"
    | "left_knee"
    | "right_knee"
    | "left_ankle"
}

interface Pose {
  score: number
  keypoints: Keypoint[]
}

globalThis.update = function ({ keypoints }: Pose, width: number, height: number) {
  console.log("UPDATE", keypoints)
}
