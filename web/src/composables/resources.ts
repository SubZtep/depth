import type { Object3D } from "three/src/core/Object3D"

export default class Resources extends Map {
  objs: Map<string, Object3D>

  constructor() {
    super()
    this.objs = new Map()
  }

  get<T extends Object3D>(key: string): T {
    if (!this.has(key)) {
      throw new Error(`Resource ${key} not found`)
    }
    return super.get(key)
  }
}
