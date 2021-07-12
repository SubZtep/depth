import PosePerFrame from "./components/pages/PosePerFrame.vue"
import VideoToImages from "./components/pages/VideoToImages.vue"
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
    path: "/images",
    component: VideoToImages,
    position: [-20, 2, 10],
    lookAt: [30, 2, -20],
  },
  {
    path: "/frames",
    component: PosePerFrame,
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
