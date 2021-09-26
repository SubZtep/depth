export function navigation(routes: Route[]) {
  return (gui: dat.GUI) => {
    const btns = {}
    const f = gui.addFolder("⚓ Navigation")
    routes.forEach(({ path, label }) => {
      const name = path.substring(1)
      btns[name] = () => {
        window.location.hash = path
      }
      f.add(btns, name).name(label)
    })
  }
}
