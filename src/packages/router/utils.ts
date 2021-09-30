import type { Route } from "~/types/settings"
import { capitalize } from "~/misc/utils"

export function navigationGui(routes: Route[]) {
  return (gui: dat.GUI) => {
    const btns = {}
    const f = gui.addFolder("⚓ Navigation")
    routes.forEach(route => {
      const parts = route.path.split("-").map(part => capitalize(part))
      const name = route.path.substring(1)
      btns[name] = () => {
        window.location.hash = route.path
      }
      f.add(btns, name).name(route.label ?? parts.join(""))
    })
  }
}

export function normalizeRoutes(routes: Route[]) {
  return routes.map((route: Route) => {
    const parts = route.path.split("-").map(part => capitalize(part))
    const normalizedRoutes: any = {
      label: route.label ?? parts.join(" "),
      path: route.path,
      component: defineAsyncComponent(() => import(`../../components/pages/${route.component ?? parts.join("")}.vue`)),
    }
    if (route.position) {
      normalizedRoutes.position = route.position
    }
    if (route.lookAt) {
      normalizedRoutes.lookAt = route.lookAt
    }
    return normalizedRoutes
  })
}
