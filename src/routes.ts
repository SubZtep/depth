import SceneSetup from "~/components/pages/SceneSetup.vue"
import EmptyTemplate from "~/components/pages/EmptyTemplate.vue"
import VideoPose from "~/components/pages/VideoPose.vue"
import IconGallery from "~/components/pages/IconGallery.vue"

const route: Route[] = [
  {
    path: "/video-pose",
    label: "Video Pose",
    component: VideoPose,
    position: [2, 1, -4],
    lookAt: [2, 2, 0],
  },
  {
    path: "/scene-setup",
    label: "Scene Setup",
    component: SceneSetup,
    position: [0, 2, -100],
    lookAt: [0, 0, 0],
  },
  {
    path: "/empty-template",
    label: "Empty Template",
    component: EmptyTemplate,
    position: [-30, 2, -10],
    lookAt: [30, 2, -20],
  },
  {
    path: "/icon-gallery",
    label: "Icon Gallery",
    component: IconGallery,
    position: [-12, 2, 4],
    lookAt: [30, 10, -20],
  },

]

export default route
