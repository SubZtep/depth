type Fn = import("@vueuse/core").Fn
type EventHook<T = any> = import("@vueuse/shared").EventHook

type CameraControls = import("camera-controls").default

const vuerc = import("@vue/runtime-core")
type Ref<T = any> = vuerc.Ref
type PropType<T> = vuerc.PropType

const tfpd = import("@tensorflow-models/pose-detection/dist/types.d")
type Pose = tfpd.Pose
type Keypoint = tfpd.Keypoint
type PoseDetector = tfpd.PoseDetector

// type Scene = import("three").Scene
