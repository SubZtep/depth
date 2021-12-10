import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader"
import { CubeReflectionMapping, DoubleSide, LinearFilter } from "three/src/constants"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { Mesh } from "three/src/objects/Mesh"
import { useScene } from "@depth/canvas"
import { onScopeDispose } from "vue"

async function loadLeafMaterial(): Promise<MeshBasicMaterial> {
  return new Promise((resolve, reject) => {
    const loader = new DDSLoader()
    loader.load(
      "textures/hepatica_dxt3_mip.dds",
      texture => {
        texture.anisotropy = 2
        texture.magFilter = LinearFilter
        texture.minFilter = LinearFilter
        texture.mapping = CubeReflectionMapping
        const material = new MeshLambertMaterial({
          map: texture,
          color: 0x696969,
          alphaTest: 0.5,
          side: DoubleSide,
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
  const leafPlane = new Mesh(new PlaneGeometry(4, 4), leaf)
  leafPlane.rotateX(-Math.PI / 2)
  leafPlane.receiveShadow = true
  leafPlane.name = "leafPlane"
  return leafPlane
}

export default defineComponent({
  props: {
    position: { type: Array as PropType<PositionTuple>, default: () => [0, 0, 0] },
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
