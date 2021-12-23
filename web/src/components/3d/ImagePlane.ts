import type { PropType } from "vue"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import { FrontSide } from "three/src/constants"
import { Mesh } from "three/src/objects/Mesh"
import { useScene } from "@depth/canvas"

export default defineComponent({
  props: {
    url: { type: String, required: true },
    width: { type: Number, default: 64 },
    height: { type: Number, default: 64 },
    position: { type: Array as unknown as PropType<[number, number, number]>, default: () => [0, 0, 0] },
  },
  setup({ url, width, height, position }) {
    const scene = useScene()
    let mesh: Mesh

    new TextureLoader().load(url, texture => {
      // texture.wrapS = RepeatWrapping
      // texture.wrapT = RepeatWrapping
      // texture.offset.x = 90 / (2 * Math.PI)

      const woodMaterial = new MeshPhongMaterial({
        alphaTest: 0.5,
        map: texture,
        side: FrontSide,
        color: 0xff0000,
        emissive: 0x8a0303,
      })
      // const woodMaterial = new MeshLambertMaterial({
      //   transparent: true,
      //   map: texture,
      //   side: FrontSide,
      //   color: 0x444444,
      //   emissive: 0x000000,
      // })

      // Add Ground
      mesh = new Mesh(new PlaneGeometry(width, height, 8), woodMaterial)
      mesh.receiveShadow = true

      //rotate
      mesh.rotation.x = -Math.PI / 2
      mesh.rotation.z = Math.PI
      mesh.position.set(...position)

      scene.add(mesh)
    })

    onScopeDispose(() => {
      scene.remove(mesh)
    })

    return () => {}
  },
})
