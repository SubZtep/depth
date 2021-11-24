import {
  DDSLoader,
  CubeReflectionMapping,
  DoubleSide,
  LinearFilter,
  PlaneGeometry,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Mesh,
} from "@depth/three.js"

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
