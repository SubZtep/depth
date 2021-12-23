import { Mesh } from "three/src/objects/Mesh"
import { BoxHelper } from "three/src/helpers/BoxHelper"
import { ColliderDesc, ActiveEvents } from "@dimforge/rapier3d-compat"
import { BoxGeometry } from "three/src/geometries/BoxGeometry"
import { onScopeDispose, PropType, toRefs, watch, defineComponent } from "vue"
import { useScene } from "@depth/canvas"
import { getWorld } from "../world"

function createBoxHelper(dimensions: [number, number, number], position: [number, number, number]): BoxHelper {
  const box = new BoxGeometry(...dimensions)
  const boxMesh = new Mesh(box)
  boxMesh.position.set(...position)
  return new BoxHelper(boxMesh, 0xffff00)
}

export default defineComponent({
  props: {
    dimensions: { type: Object as PropType<[number, number, number]>, required: true },
    position: { type: Object as PropType<[number, number, number]>, required: true },
    helper: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const { dimensions, position, helper } = toRefs(props)

    const world = getWorld()
    const colliderDesc = ColliderDesc.cuboid(dimensions.value[0] / 2, dimensions.value[1] / 2, dimensions.value[2] / 2)
      .setTranslation(...position.value)
      .setActiveEvents(ActiveEvents.INTERSECTION_EVENTS)
      .setSensor(true)

    const collider = world.createCollider(colliderDesc)
    const boxHelper = createBoxHelper(dimensions.value, position.value)
    const scene = useScene()

    watch(helper, show => void scene[show ? "add" : "remove"].call(scene, boxHelper), { immediate: true })

    onScopeDispose(() => {
      world.removeCollider(collider, false)
      scene.remove(boxHelper)
      boxHelper.geometry.dispose()
    })

    return () => slots.default?.()
  },
})
