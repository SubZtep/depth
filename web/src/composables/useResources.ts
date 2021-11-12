import useSingleton from "~/composables/useSingleton"
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

  return resources
}
