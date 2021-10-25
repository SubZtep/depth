export const BLAZEPOSE_KEYPOINTS = [
  "nose",
  "left_eye_inner",
  "left_eye",
  "left_eye_outer",
  "right_eye_inner",
  "right_eye",
  "right_eye_outer",
  "left_ear",
  "right_ear",
  "mouth_left",
  "mouth_right",
  "left_shoulder",
  "right_shoulder",
  "left_elbow",
  "right_elbow",
  "left_wrist",
  "right_wrist",
  "left_pinky",
  "right_pinky",
  "left_index",
  "right_index",
  "left_thumb",
  "right_thumb",
  "left_hip",
  "right_hip",
  "left_knee",
  "right_knee",
  "left_ankle",
  "right_ankle",
  "left_heel",
  "right_heel",
  "left_foot_index",
  "right_foot_index",
]

export const BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS: [number, number][] = [
  [0, 1],
  [0, 4],
  [1, 2],
  [2, 3],
  [3, 7],
  [4, 5],
  [5, 6],
  [6, 8],
  [9, 10],
  [11, 12],
  [11, 13],
  [11, 23],
  [12, 14],
  [14, 16],
  [12, 24],
  [13, 15],
  [15, 17],
  [16, 18],
  [16, 20],
  [15, 17],
  [15, 19],
  [15, 21],
  [16, 22],
  [17, 19],
  [18, 20],
  [23, 25],
  [23, 24],
  [24, 26],
  [25, 27],
  [26, 28],
  [27, 29],
  [28, 30],
  [27, 31],
  [28, 32],
  [29, 31],
  [30, 32],
]

export const HEAD_AREA: [number, number] = [
  BLAZEPOSE_KEYPOINTS.indexOf("nose"),
  BLAZEPOSE_KEYPOINTS.indexOf("mouth_right"),
]

export const BLAZEPOSE_HEAD_KEYPOINTS = BLAZEPOSE_KEYPOINTS.slice(HEAD_AREA[0], HEAD_AREA[1] + 1)
// export const BLAZEPOSE_HEAD_CONNECTED_KEYPOINTS_PAIRS = BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS.filter(isInRange(...HEAD_AREA))
export const BLAZEPOSE_HEAD_CONNECTED_KEYPOINTS_PAIRS = BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS

export const FRAME_MS_60_FPS = 1000 / 60 // 16.6 // (1 / 60) * 1000
export const FRAME_MS_30_FPS = 1000 / 30 // 33.3

export const VIDEO_URL = /^\S+\.webm|mkv|mp4|avi|ogv$/