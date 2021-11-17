import type { Ref } from "vue"
import { addGuiFolder } from "@depth/dat.gui"
import { loop3D } from "@depth/three.js/dist/useRenderLoop"
import { Object3D } from "three/src/core/Object3D"
import { Vector3 } from "three/src/math/Vector3"

export default defineComponent({
  props: {
    character: { type: Object as PropType<Ref<Object3D>>, require: true },
    moveForward: { type: Boolean, require: true },
    moveBackward: { type: Boolean, require: true },
    moveLeft: { type: Boolean, require: true },
    moveRight: { type: Boolean, require: true },
    rotateLeft: { type: Boolean, require: true },
    rotateRight: { type: Boolean, require: true },
  },
  setup(properties, { slots }) {
    const state = reactive({
      speed: 100,
    })

    addGuiFolder(gui => {
      gui.name = "🐌 Character Control"
      gui.add(state, "speed", 0, 5000)
    })

    loop3D(({ clock }) => {
      const delta = clock.getDelta()

      const character = get(properties.character)

      if (properties.moveForward) {
        character.translateZ(-state.speed * delta)
      }
      if (properties.moveBackward) {
        character.translateZ(state.speed * delta)
      }
      if (properties.moveLeft) {
        character.translateX(-state.speed * delta)
      }
      if (properties.moveRight) {
        character.translateX(state.speed * delta)
      }
      if (properties.rotateLeft) {
        character.rotateOnWorldAxis(new Vector3(0, 1, 0), (Math.PI / 4) * -state.speed * delta)
      }
      if (properties.rotateRight) {
        character.rotateOnWorldAxis(new Vector3(0, 1, 0), (Math.PI / 4) * state.speed * delta)
      }
    })

    return () => slots.default && slots.default()
  },
})
