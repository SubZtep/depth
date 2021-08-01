import VideoToImages from "./components/pages/VideoToImages.vue"
import VideoPose from "./components/pages/VideoPose.vue"
import PlaybackPose from "./components/pages/PlaybackPose.vue"
import PoseGroup from "./components/pages/PoseGroup.vue"
import RecordVideo from "./components/pages/RecordVideo.vue"
import SceneSetup from "./components/pages/SceneSetup.vue"
import Preferences from "./components/pages/Preferences.vue"
import DepthHead from "./components/pages/DepthHead.vue"

const route: Route[] = [
  {
    path: "/group",
    label: "💀 Poser group-pe-d",
    component: PoseGroup,
    position: [2, 1, -4],
    lookAt: [2, 2, 0],
  },
  {
    path: "/videopose",
    label: "🥶 Video pose",
    component: VideoPose,
    position: [12, 1, -4],
    lookAt: [12, 2, 0],
  },
  {
    path: "/playbackpose",
    label: "🥶 Playback pose",
    component: PlaybackPose,
    position: [12, 1, -4],
    lookAt: [-12, 2, 0],
  },
  {
    path: "/images",
    label: "🔥 Video to images",
    component: VideoToImages,
    position: [-20, 2, 10],
    lookAt: [30, 2, -20],
  },
  {
    path: "/record",
    label: "🎬 Record media",
    component: RecordVideo,
    position: [10, 2, 20],
    lookAt: [0, 2, 20],
  },
  {
    path: "/scene",
    label: "⚒ Scene setup",
    component: SceneSetup,
    position: [0, 2, -100],
    lookAt: [0, 0, 0],
  },
  {
    path: "/preferences",
    label: "⚙ Preferences",
    component: Preferences,
  },
  {
    path: "/depth",
    label: "Depth head",
    component: DepthHead,
    position: [-20, 2, 10],
    lookAt: [30, 2, -20],
  },
]

export default route
