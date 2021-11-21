import { useSingleton } from "@depth/misc"
import Resources from "~/3D/resources"

export const resources = new Resources()
useSingleton().set("resources", resources)

export default function useResources() {
  let resources: Resources

  const single = useSingleton()
  if (single.has("resources")) {
    resources = single.get("resources")
  } else {
    resources = new Resources()
    single.set("resources", resources)
  }

  const loader = async <T extends Object3D>(key: string, objectLoader: () => Promise<T>): Promise<T> => {
    if (!resources.has(key)) {
      resources.set(key, await objectLoader())
    }
    return resources.get(key) as T
  }

  return {
    resources,
    loader,
  }
}
