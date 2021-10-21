import type { RouteRecordRaw } from "vue-router"
import * as VueRouter from "vue-router"
// import { singleFns } from "@depth/three.js"

const QuoteWalker = () => import("./pages/QuoteWalker.vue")
const VideoPose = () => import("./pages/VideoPose.vue")
const DbAdmin = () => import("./pages/DbAdmin.vue")
const SceneSetup = () => import("./pages/SceneSetup.vue")
const SoundTest = () => import("./pages/SoundTest.vue")
const GlobeTest = () => import("./pages/GlobeTest.vue")

const routes: RouteRecordRaw[] = [
  {
    path: "/quote-walker",
    name: "quote-walker",
    component: QuoteWalker,
    meta: {
      position: [0, 1.6, 0],
      lookAt: [6, 9, 6],
    },
  },
  {
    path: "/video-pose",
    name: "video-pose",
    component: VideoPose,
    meta: {
      position: [0, 1.6, 0],
      lookAt: [0, 1.6, -10],
    },
  },
  {
    path: "/db-admin",
    name: "db-admin",
    component: DbAdmin,
    meta: {
      position: [0, 1.6, 0],
      lookAt: [0, 1.6, 10],
    },
  },
  {
    path: "/scene-setup",
    name: "scene-setup",
    component: SceneSetup,
    meta: {
      position: [-2, 1.6, -10],
      lookAt: [0, 0, 0],
    },
  },
  {
    path: "/sound-test",
    name: "sound-test",
    component: SoundTest,
    meta: {
      position: [-30, 1.6, -30],
      lookAt: [-300, 2, -30],
    },
  },
  {
    path: "/",
    name: "globe-test",
    component: GlobeTest,
    meta: {
      position: [0, 1.6, 0],
      lookAt: [0, 1.6, -30],
    },
  },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})

router.beforeEach(to => {
  const { position, lookAt } = to.meta
  if (position && lookAt) {
    // singleFns.add(({ cameraControls }) => {
    //   cameraControls.setLookAt(...position, ...lookAt, true)
    // })
  }
})

export default router
