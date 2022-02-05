import type { PropType } from "vue"
import * as THREE from "three"
import { useScene } from "@depth/canvas"

export default defineComponent({
  props: {
    url: { type: String, required: true },
    dimensions: { type: Array as unknown as PropType<[number, number, number | undefined]>, required: true },
    // width: { type: Number, default: 64 },
    // height: { type: Number, default: 64 },
    position: { type: Array as unknown as PropType<[number, number, number]>, default: () => [0, 0, 0] },
  },
  emit: ["loaded"],
  // setup({ url, [(width, height, depth)]: dimensions, position }, { emit }) {
  setup({ url, dimensions, position }, { emit }) {
    const [width = 64, height = 64, depth = 0] = dimensions

    const scene = useScene()
    let mesh: THREE.Mesh

    new THREE.TextureLoader().load(url, texture => {
      // texture.wrapS = RepeatWrapping
      // texture.wrapT = RepeatWrapping
      // texture.offset.x = 90 / (2 * Math.PI)

      const woodMaterial = new THREE.MeshLambertMaterial({
        // alphaTest: 0.5,
        map: texture,
        // side: THREE.DoubleSide,
        side: THREE.FrontSide,
        color: 0xffffff,
        // // color: 0xff0000,
        // emissive: 0x8a0303,
      })
      // const woodMaterial = new THREE.MeshPhongMaterial({
      //   // alphaTest: 0.5,
      //   map: texture,
      //   side: THREE.DoubleSide,
      //   // side: THREE.FrontSide,
      //   color: 0xff0000,
      //   // color: 0xff0000,
      //   emissive: 0x8a0303,
      // })
      // const woodMaterial = new MeshLambertMaterial({
      //   transparent: true,
      //   map: texture,
      //   side: FrontSide,
      //   color: 0x444444,
      //   emissive: 0x000000,
      // })

      const geometry =
        depth > 0 ? new THREE.BoxGeometry(width, height, depth) : new THREE.PlaneGeometry(width, height, 8)

      // Add Ground
      mesh = new THREE.Mesh(geometry, woodMaterial)
      // mesh.receiveShadow = true

      //rotate
      // mesh.rotation.x = -Math.PI / 2
      // mesh.rotation.z = Math.PI

      mesh.position.set(...position)

      mesh.lookAt(0, 5, 0)

      scene.add(mesh)

      emit("loaded", mesh as THREE.Mesh)
    })

    onScopeDispose(() => {
      scene.remove(mesh)
    })

    return () => {}
  },
})
