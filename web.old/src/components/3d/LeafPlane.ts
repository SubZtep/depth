import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader"
import { useScene } from "@depth/canvas"
import { onScopeDispose } from "vue"

async function loadLeafMaterial(): Promise<THREE.MeshBasicMaterial> {
  return new Promise((resolve, reject) => {
    const loader = new DDSLoader()
    loader.load(
      "textures/hepatica_dxt3_mip.dds",
      texture => {
        texture.anisotropy = 2
        texture.magFilter = THREE.LinearFilter
        texture.minFilter = THREE.LinearFilter
        texture.mapping = THREE.CubeReflectionMapping
        const material = new THREE.MeshLambertMaterial({
          map: texture,
          color: 0x696969,
          alphaTest: 0.5,
          side: THREE.DoubleSide,
        })
        resolve(material)
      },
      undefined,
      reject
    )
  })
}

async function leafPlane() {
  const leaf = await loadLeafMaterial()
  const leafPlane = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), leaf)
  leafPlane.rotateX(-Math.PI / 2)
  leafPlane.receiveShadow = true
  leafPlane.name = "leafPlane"
  return leafPlane
}

export default defineComponent({
  props: {
    position: { type: Array as unknown as PropType<[number, number, number]>, default: () => [0, 0, 0] },
  },
  async setup({ position }) {
    const scene = useScene()

    onScopeDispose(() => {
      scene.remove(mesh)
    })

    const mesh = await leafPlane()
    mesh.position.set(...(position as PositionTuple))
    scene.add(mesh)

    return () => {}
  },
})
