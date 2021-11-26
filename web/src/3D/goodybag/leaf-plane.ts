import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader"
import { CubeReflectionMapping, DoubleSide, LinearFilter } from "three/src/constants"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
import { Mesh } from "three/src/objects/Mesh"

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

// eslint-disable-next-line unicorn/no-object-as-default-parameter
export async function leafPlane(position: Vector = { x: -1, y: -0.05, z: -20.7 }) {
  const leaf = await loadLeafMaterial()
  const leafPlane = new Mesh(new PlaneGeometry(4, 4), leaf)
  leafPlane.rotateX(-Math.PI / 2)
  leafPlane.position.set(position.x, position.y, position.z)
  leafPlane.receiveShadow = true
  leafPlane.name = "leafPlane"
  return leafPlane
}
