import { Pile } from "../models/pile"

class Singleton {
  private static instance: Singleton

  constructor() {
    if (Singleton.instance) {
      throw new Error("use Singleton.getInstance()")
    }
    this.piles = new Map<string, Pile>()
  }

  static getInstance(): Singleton {
    Singleton.instance = Singleton.instance || new Singleton()
    return Singleton.instance
  }

  piles: Map<string, Pile>
}

const piles = Singleton.getInstance().piles
Object.freeze(piles)

export function useSingleton() {
  return {
    piles: piles as FrozenPiles,
  }
}
