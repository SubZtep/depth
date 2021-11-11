import type { Object3D } from "three/src/core/Object3D"
import { v4 as uuidv4 } from "uuid"


type Component = Object3D

export function SystemRotate(this: Entity) {
  for (const component of this.components) {
    component.rotation.y += 0.01
  }
}

type System = typeof SystemRotate

export class Entity {
  id: string
  components: Set<Component>
  systems: Set<System>

  constructor() {
    this.id = uuidv4()
    this.components = new Set()
    this.systems = new Set()
  }

  addComponent(component: Component) {
    this.components.add(component)
  }

  delComponent(component: Component) {
    this.components.delete(component)
  }

  addSystem(system: System) {
    this.systems.add(system)
  }

  delSystem(system: System) {
    this.systems.delete(system)
  }

  update() {
    this.systems.forEach(system => system.call(this))
  }
}
