// import { Pile } from "../models/pile"
// import type { Object3D } from "three"

class Singleton {
  private static instance: Singleton

  constructor() {
    if (Singleton.instance) {
      throw new Error("use Singleton.getInstance()")
    }
    this.map = new Map<string, any>()
  }

  static getInstance(): Singleton {
    Singleton.instance = Singleton.instance || new Singleton()
    return Singleton.instance
  }

  map: Map<string, any>
}

// const piles = Singleton.getInstance().piles
// Object.freeze(piles)
const single = Singleton.getInstance().map
Object.freeze(single)

export default function useSingleton() {
  return single
  // return {
  //   // piles: piles as FrozenPiles,
  // }
}
