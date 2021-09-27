const route: Route[] = [
  {
    path: "/video-pose",
    label: "Video Pose",
    component: defineAsyncComponent(() => import("~/components/pages/VideoPose.vue")),
    position: [2, 1, -4],
    lookAt: [2, 2, 0],
  },
  {
    path: "/scene-setup",
    label: "Scene Setup",
    component: defineAsyncComponent(() => import("~/components/pages/SceneSetup.vue")),
    position: [0, 2, -100],
    lookAt: [0, 0, 0],
  },
  {
    path: "/empty-template",
    label: "Empty Template",
    component: defineAsyncComponent(() => import("~/components/pages/EmptyTemplate.vue")),
    position: [-30, 2, -10],
    lookAt: [30, 2, -20],
  },
  {
    path: "/icon-gallery",
    label: "Icon Gallery",
    component: defineAsyncComponent(() => import("~/components/pages/IconGallery.vue")),
    position: [-12, 2, 4],
    lookAt: [30, 10, -20],
  },
]

export default route
