import * as THREE from "three"
import { ColliderDesc, ActiveEvents } from "@dimforge/rapier3d-compat"
import { onScopeDispose, PropType, toRefs, watch, defineComponent } from "vue"
import { useScene } from "@depth/canvas"
import { getWorld } from "../world"

function createBoxHelper(dimensions: [number, number, number], position: [number, number, number]): THREE.BoxHelper {
  const box = new THREE.BoxGeometry(...dimensions)
  const boxMesh = new THREE.Mesh(box)
  boxMesh.position.set(...position)
  return new THREE.BoxHelper(boxMesh, 0xffff00)
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
      .setActiveEvents(ActiveEvents.COLLISION_EVENTS)
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
