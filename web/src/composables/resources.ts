export default class Resources extends Map {
  objs: Map<string, THREE.Object3D>

  constructor() {
    super()
    this.objs = new Map()
  }

  get<T extends THREE.Object3D>(key: string): T {
    if (!this.has(key)) {
      throw new Error(`Resource ${key} not found`)
    }
    return super.get(key)
  }
}
