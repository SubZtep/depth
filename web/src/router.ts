import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"
import type { GUIExtended } from "@depth/dat.gui"
import { kebabToTitle } from "@depth/misc"
import { exec3D } from "@depth/three.js"

const camHeight = 1.6
const routes: RouteRecordRaw[] = [
  {
    path: "/video-pose",
    name: "video-pose",
    component: () => import("./pages/VideoPose.vue"),
    meta: {
      position: [0, camHeight, 0],
      lookAt: [0, camHeight, -10],
      order: 4,
    },
  },
  {
    path: "/db-admin",
    name: "db-admin",
    component: () => import("./pages/DbAdmin.vue"),
    meta: {
      position: [0, camHeight, 0],
      lookAt: [0, camHeight, 10],
      order: 5,
    },
  },
  {
    path: "/face",
    name: "face",
    component: () => import("./pages/Face.vue"),
    meta: {
      position: [0, camHeight, 8],
      lookAt: [0, 2, 0],
      order: 6,
    },
  },
  {
    path: "/preferences",
    name: "preferences",
    component: () => import("./pages/Preferences.vue"),
    meta: {
      position: [-3, camHeight, -3],
      lookAt: [0, camHeight, 0],
      order: 100,
    },
  },
  {
    path: "/testes",
    name: "testes",
    component: () => import("./pages/Testes.vue"),
    meta: {
      position: [-30, camHeight, -30],
      lookAt: [-300, 2, -30],
    },
  },
  {
    path: "/globe",
    name: "globe-test",
    component: () => import("./pages/GlobeTest.vue"),
    meta: {
      position: [0, camHeight, 0],
      lookAt: [0, camHeight, 69],
      order: 3,
    },
  },
  {
    path: "/face-rotate",
    name: "face-rotate",
    component: () => import("./pages/FaceRotate.vue"),
    meta: {
      position: [0, 1, -20],
      lookAt: [0, 0, 0],
      order: 20,
    },
  },
  {
    path: "/depth",
    name: "depth",
    component: () => import("./pages/Depth.vue"),
    meta: {
      position: [0, camHeight, -20],
      lookAt: [0, 0, 0],
      order: 21,
    },
  },
  {
    path: "/controller",
    name: "controller-test",
    component: () => import("./pages/ControllerTest.vue"),
    meta: {
      position: [0, camHeight, 5],
      lookAt: [0, 0, 0],
      order: 22,
    },
  },
  {
    path: "/environment",
    name: "environment",
    component: () => import("./pages/EnvironmentPage.vue"),
    meta: {
      position: [0, camHeight, 5],
      lookAt: [0, 0, 0],
      order: 23,
    },
  },
  {
    path: "",
    name: "home",
    component: () => import("./pages/Home.vue"),
    meta: {
      position: [0, camHeight, 0],
      lookAt: [0, 2, 0],
      order: 1,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router

function getRouteNames() {
  // TODO: handle route changes (or not?)
  return router
    .getRoutes()
    .filter(({ meta }) => meta.order !== undefined)
    .sort((a, b) => a.meta.order! - b.meta.order!)
    .map(({ name }) => name as string)
    .filter(Boolean)
}

const routeNames = getRouteNames()
let folders: NodeListOf<Element>

router.beforeEach(({ name, meta: { position, lookAt } }) => {
  // set gui active class
  if (!folders) folders = document.querySelectorAll(".dg.depth .folder:first-of-type .function")
  const index = (typeof name === "string" && routeNames.indexOf(name)) ?? -1
  for (const [index_] of folders.entries()) folders[index_].classList[index_ === index ? "add" : "remove"]("active")

  // move camera to the desired position
  position &&
    lookAt &&
    exec3D(async ({ cameraControls }) => await cameraControls.setLookAt(...position, ...lookAt, true))
})

export function navigationGui(gui: GUIExtended) {
  const folder = gui.addFolder("⚓ Navigation")
  const btns = Object.fromEntries(routeNames.map(name => [name, () => void router.push({ name })]))
  for (const name of routeNames) folder.add(btns, name).name(kebabToTitle(name))

  // add github link
  btns["ghpage"] = () => void window.open("https://github.com/SubZtep/depth")
  folder.add(btns, "ghpage").name("⮚ Open GitHub Page")
}
