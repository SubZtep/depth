import type { PropType } from "vue"
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
    let mesh: THREE.Mesh

    new THREE.TextureLoader().load(url, texture => {
      // texture.wrapS = RepeatWrapping
      // texture.wrapT = RepeatWrapping
      // texture.offset.x = 90 / (2 * Math.PI)

      const woodMaterial = new THREE.MeshPhongMaterial({
        alphaTest: 0.5,
        map: texture,
        side: THREE.FrontSide,
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
      mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height, 8), woodMaterial)
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
