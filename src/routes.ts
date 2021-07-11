import EstimateFrames from "./components/pages/EstimateFrames.vue"
import PoseGroup from "./components/pages/PoseGroup.vue"
import RecordVideo from "./components/pages/RecordVideo.vue"

export default [
  {
    path: "/group",
    component: PoseGroup,
    position: [2, 1, -4],
    lookAt: [2, 2, 0],
  },
  {
    path: "/frames",
    component: EstimateFrames,
    position: [10, 2, -20],
    lookAt: [-30, 2, -20],
  },
  {
    path: "/record",
    component: RecordVideo,
    position: [10, 2, 20],
    lookAt: [0, 2, 20],
  },
] as Route[]
