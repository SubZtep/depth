import type { RouteRecordNormalized } from "vue-router"
import { kebabToTitle } from "~/misc/string"
import router from "~/router"

export default function navigationGui(routes: RouteRecordNormalized[]) {
  return (gui: dat.GUI) => {
    const btns = {}
    const f = gui.addFolder("⚓ Navigation")
    routes.forEach(route => {
      const { name } = route as { name: string }
      btns[name] = () => void router.push({ name })
      f.add(btns, name).name(kebabToTitle(name))
    })
  }
}
