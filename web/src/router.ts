import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"
import type { GUIExtended } from "@depth/hud"
import { kebabToTitle } from "@depth/misc"
import { exec3D } from "@depth/canvas"
import type { App } from "vue"
import { useEnvironmentStore } from "~/stores/environment"

const camHeight = 1.6
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("./pages/HomePage.vue"),
    meta: {
      position: [0, camHeight, 6],
      lookAt: [0, 0, 0],
      order: 1,
    },
  },
  {
    path: "/editor",
    name: "editor",
    component: () => import("./pages/EditorPage.vue"),
    meta: {
      skybox: 15,
      // cc - 8a = 42
      // 42 + 03 = 45
      grid: 0xcc4503,
      // grid: 0x8a0303,
      // grid: 0xff7803,
      position: [0, 2, -1],
      lookAt: [0, 2, 0],
      order: 1,
    },
  },
  {
    path: "/snail",
    name: "snail",
    component: () => import("./pages/SnailPage.vue"),
    meta: {
      skybox: 15,
      // cc - 8a = 42
      // 42 + 03 = 45
      grid: 0xcc4503,
      // grid: 0x8a0303,
      // grid: 0xff7803,
      position: [0, 2, -1],
      lookAt: [0, 2, 0],
      order: 1,
    },
  },
  {
    path: "/depth",
    name: "depth",
    component: () => import("./pages/DepthPage.vue"),
    meta: {
      position: [0, camHeight, 6],
      lookAt: [0, 0, 0],
      order: 1,
    },
  },
  {
    path: "/blast",
    name: "blast",
    component: () => import("./pages/BlastPage.vue"),
    meta: {
      position: [0, 3, 8],
      lookAt: [0, 2, -15],
      order: 2,
    },
  },
  {
    path: "/player",
    name: "player",
    component: () => import("./pages/PlayerPage.vue"),
    meta: {
      position: [0, camHeight, 6],
      lookAt: [0, 0, 0],
      order: 3,
    },
  },
  {
    path: "/video",
    name: "video",
    component: () => import("./pages/VideoPage.vue"),
    meta: {
      position: [0, camHeight, 6],
      lookAt: [0, 0, 0],
      order: 8,
    },
  },
  {
    path: "/face",
    name: "face",
    component: () => import("./pages/FacePage.vue"),
    meta: {
      position: [0, camHeight, -6],
      lookAt: [0, 1, 0],
      order: 8,
    },
  },
  {
    path: "/meta",
    name: "meta",
    component: () => import("./pages/MetaPage.vue"),
    meta: {
      position: [0, 3, 6],
      lookAt: [0, 1, 0],
      order: 8,
    },
  },
  {
    path: "/pose",
    name: "pose",
    component: () => import("./pages/PosePage.vue"),
    meta: {
      position: [0, camHeight, 4],
      lookAt: [0, 1, 0],
      order: 8,
    },
  },
  {
    path: "/environment",
    name: "environment",
    component: () => import("./pages/EnvironmentPage.vue"),
    meta: {
      position: [0, camHeight, 6],
      lookAt: [0, 0, 0],
      order: 10,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

function getRouteNames() {
  // TODO: handle route changes (is there any dynamic route?)
  return router
    .getRoutes()
    .filter(({ meta }) => meta.order !== undefined)
    .sort((a, b) => a.meta.order! - b.meta.order!)
    .map(({ name }) => name as string)
    .filter(Boolean)
}

const routeNames = getRouteNames()
let folders: NodeListOf<Element>

export function initRouterMeta(app: App) {
  router.beforeEach(({ name, meta }) => {
    // set gui active class
    if (!folders) folders = document.querySelectorAll(".dg.depth .folder:first-of-type .function")
    const index = (typeof name === "string" && routeNames.indexOf(name)) ?? -1
    for (const [index_] of folders.entries()) folders[index_].classList[index_ === index ? "add" : "remove"]("active")

    // move camera to the desired position
    meta.position &&
    meta.lookAt &&
      app.config.globalProperties.$cameraControls?.setLookAt(...meta.position, ...meta.lookAt, true)

    useEnvironmentStore().$patch({
        skybox: meta.skybox ?? 13,
        distance: 20,
        color: meta.grid ?? 0x001300,
        size: 1,
      } as any)
  })
}

export function navigationGui(gui: GUIExtended) {
  const folder = gui.addFolder("⚓ Navigation")
  const btns = Object.fromEntries(routeNames.map(name => [name, () => void router.push({ name })]))
  for (const name of routeNames) folder.add(btns, name).name(kebabToTitle(name))

  // add github link
  btns["ghpage"] = () => void window.open("https://github.com/SubZtep/depth")
  folder.add(btns, "ghpage").name("⮚ Open GitHub Page")
}
