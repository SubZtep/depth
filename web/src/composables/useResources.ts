import { useSingleton } from "@depth/misc"
import type { Object3D } from "three/src/core/Object3D"
import Resources from "~/composables/resources"

export const resources = new Resources()

export default function useResources() {
  let resources: Resources

  const { singleton } = useSingleton()
  if (singleton.has("resources")) {
    resources = singleton.get("resources")
  } else {
    resources = new Resources()
    singleton.set("resources", resources)
  }

  /**
   * Ensure that the loaded resource is in the resources map.
   * @param key - Resource ideintifier
   * @param objectLoader - Asynchronous loader function
   * @returns resource object
   */
  const loader = async <T extends Object3D>(key: string, objectLoader: () => Promise<T>): Promise<T> => {
    if (!resources.has(key)) {
      const { done } = useNProgress(0.5)
      resources.set(key, await objectLoader())
      done()
    }
    return resources.get(key) as T
  }

  return {
    resources,
    loader,
  }
}