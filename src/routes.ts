import PosePerFrame from "./components/pages/PosePerFrame.vue"
import VideoToImages from "./components/pages/VideoToImages.vue"
import PoseGroup from "./components/pages/PoseGroup.vue"
import RecordVideo from "./components/pages/RecordVideo.vue"
import SceneSetup from "./components/pages/SceneSetup.vue"

export default [
  {
    path: "/group",
    label: "To group💀ped",
    component: PoseGroup,
    position: [2, 1, -4],
    lookAt: [2, 2, 0],
  },
  {
    path: "/images",
    label: "video to images 🔥",
    component: VideoToImages,
    position: [-20, 2, 10],
    lookAt: [30, 2, -20],
  },
  {
    path: "/frames",
    label: "Save pose estimation of a video",
    component: PosePerFrame,
    position: [10, 2, -20],
    lookAt: [-30, 2, -20],
  },
  {
    path: "/record",
    label: "To record",
    component: RecordVideo,
    position: [10, 2, 20],
    lookAt: [0, 2, 20],
  },
  {
    path: "/scene",
    label: "Scene setup",
    component: SceneSetup,
    position: [0, 2, -100],
    lookAt: [0, 0, 0],
  },
] as Route[]
