import { BackSide, RepeatWrapping } from "three/src/constants"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"
import { Vector3 } from "three/src/math/Vector3"
import { Mesh } from "three/src/objects/Mesh"
import type { PropType } from "vue"
import { getCurrentInstance, onScopeDispose } from "vue"

export default defineComponent({
  props: {
    url: { type: String, required: true },
    width: { type: Number, default: 64 },
    height: { type: Number, default: 64 },
    position: { type: Array as unknown as PropType<[number, number, number]>, default: () => [0, 0, 0] },
  },
  setup({ url, width, height, position }) {
    const instance = getCurrentInstance()
    if (!instance) throw new Error("Not in Vue scope")
    const { $scene } = instance.appContext.app.config.globalProperties

    new TextureLoader().load(url, texture => {
      // texture.wrapS = RepeatWrapping
      // texture.wrapT = RepeatWrapping
      // texture.offset.x = 90 / (2 * Math.PI)
      const woodMaterial = new MeshPhongMaterial({
        alphaTest: 0.5,
        map: texture,
        side: BackSide,
        color: 0xff0000,
        emissive: 0x8a0303,
      })

      // Add Ground
      const mesh = new Mesh(new PlaneGeometry(width, height, 8), woodMaterial)

      //rotate
      mesh.rotation.x = Math.PI / 2
      mesh.rotation.z = Math.PI
      mesh.position.set(...position)

      $scene.add(mesh)
    })

    return () => null
  },
})
