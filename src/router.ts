import type { RouteRecordRaw } from "vue-router"
import * as VueRouter from "vue-router"
import Home from "~/components/pages/Home.vue"
import VideoPose from "~/components/pages/VideoPose.vue"
import DbAdmin from "~/components/pages/DbAdmin.vue"
import SceneSetup from "~/components/pages/SceneSetup.vue"
import EmptyTemplate from "~/components/pages/EmptyTemplate.vue"
import { singleFns } from "~/packages/ThreeJS/useRenderLoop"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: Home,
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
    path: "/empty",
    name: "empty",
    component: EmptyTemplate,
    meta: {
      position: [-30, 1.6, -30],
      lookAt: [-300, 2, -30],
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
    singleFns.add(({ cameraControls }) => {
      cameraControls.setLookAt(...position, ...lookAt, true)
    })
  }
})

export default router
