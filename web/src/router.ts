import type { RouteRecordRaw } from "vue-router"
import * as VueRouter from "vue-router"
import { exec3D } from "@depth/three.js"

const routes: RouteRecordRaw[] = [
  {
    path: "/quote-walker",
    name: "quote-walker",
    component: () => import("./pages/QuoteWalker.vue"),
    meta: {
      position: [0, 1.6, 0],
      lookAt: [6, 9, 6],
    },
  },
  {
    path: "/video-pose",
    name: "video-pose",
    component: () => import("./pages/VideoPose.vue"),
    meta: {
      position: [0, 1.6, 0],
      lookAt: [0, 1.6, -10],
    },
  },
  {
    path: "/db-admin",
    name: "db-admin",
    component: () => import("./pages/DbAdmin.vue"),
    meta: {
      position: [0, 1.6, 0],
      lookAt: [0, 1.6, 10],
    },
  },
  {
    path: "/scene-setup",
    name: "scene-setup",
    component: () => import("./pages/SceneSetup.vue"),
    meta: {
      position: [-2, 1.6, -10],
      lookAt: [0, 0, 0],
    },
  },
  {
    path: "/testes",
    name: "testes",
    component: () => import("./pages/Testes.vue"),
    meta: {
      position: [-30, 1.6, -30],
      lookAt: [-300, 2, -30],
    },
  },
  {
    path: "",
    name: "globe-test",
    component: () => import("./pages/GlobeTest.vue"),
    meta: {
      position: [0, 1.6, 0],
      lookAt: [0, 1.6, 69],
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
    exec3D(({ cameraControls }) => {
      cameraControls.setLookAt(...position, ...lookAt, true)
    })
  }
})

export default router
