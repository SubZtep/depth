/* eslint-disable tsdoc/syntax */
/**
 * Main object for fulfil the singleton pattern.\
 * It’s main advantage is to prevent object duplication during hot module replacement.
 */
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

const singleton = Singleton.getInstance().map
Object.freeze(singleton)

/**
 * Ensure that the provided object can only be instantiated once.
 * @param key Identifier in singleton map
 * @param object Object to be stored in singleton map
 * @returns Stored object
 */
function single<T = any>(key: string, object: T): T {
  if (!singleton.has(key)) {
    singleton.set(key, object)
  }
  return singleton.get(key)
}

export default function useSingleton() {
  return {
    singleton,
    single,
  }
}
