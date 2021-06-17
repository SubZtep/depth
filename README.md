# depth-perception
Eye detection with MoveNet via webcam

### backend setup

https://github.com/tensorflow/tfjs/tree/master/tfjs-backend-wasm
https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_tfjs

```ts
type KeypointName =
  | "nose"
  | "left_eye_inner"
  | "left_eye"
  | "left_eye_outer"
  | "right_eye_inner"
  | "right_eye"
  | "right_eye_outer"
  | "left_ear"
  | "right_ear"
  | "mouth_left"
  | "mouth_right"
  | "left_shoulder"
  | "right_shoulder"
  | "left_elbow"
  | "right_elbow"
  | "left_wrist"
  | "right_wrist"
  | "left_pinky"
  | "right_pinky"
  | "left_index"
  | "right_index"
  | "left_thumb"
  | "right_thumb"
  | "left_hip"
  | "right_hip"
  | "left_knee"
  | "right_knee"
  | "left_ankle"
  | "right_ankle"
  | "left_heel"
  | "right_heel"
  | "left_foot_index"
  | "right_foot_index"
```

## Based On

- https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/demos/live_video

## TODOish

- [ ] [three-shaking three for camera control](https://github.com/yomotsu/camera-controls#important)
