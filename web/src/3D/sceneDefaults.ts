import useSingleton from "~/composables/useSingleton"
import { usePreferencesStore } from "~/stores/preferences"
import { InfiniteGridHelper } from "~/3D/infiniteGrid"
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader"
import { GridHelper } from "three/src/helpers/GridHelper"
import { Color } from "three/src/math/Color"
import { Mesh } from "three/src/objects/Mesh"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"
import { CubeReflectionMapping, DoubleSide, LinearFilter } from "three/src/constants"
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import { AmbientLight } from "three/src/lights/AmbientLight"
import { DirectionalLight } from "three/src/lights/DirectionalLight"
import { Object3D } from "three/src/core/Object3D"

export function grid(x = -7.5) {
  const grid = new GridHelper(5, 5, Color.NAMES.blue, Color.NAMES.blue)
  grid.rotateX(-Math.PI / 2)
  grid.position.x = x
  grid.position.y = 2.5
  grid.position.z = -30
  // grid.receiveShadow = true
  return grid
}

export function plane() {
  const plane = new Mesh(
    new PlaneGeometry(6, 2),
    new MeshPhongMaterial({ color: 0x001000, specular: 0x000000, shininess: 69, side: DoubleSide })
  )
  plane.position.setX(-2)
  plane.position.setY(-0.1)
  plane.position.setZ(-20.1)
  plane.rotateX(-Math.PI / 2)
  plane.receiveShadow = true
  return plane
}

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
        const material = new MeshBasicMaterial({
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

export async function leafPlane() {
  const leaf = await loadLeafMaterial()
  const leafPlane = new Mesh(new PlaneGeometry(4, 4), leaf)
  leafPlane.rotateX(-Math.PI / 2)
  leafPlane.position.set(-1, -0.05, -20.7)
  leafPlane.receiveShadow = true
  leafPlane.name = "leafPlane"
  return leafPlane
}

export async function loadNoVideoMaterial(): Promise<MeshBasicMaterial> {
  return new Promise((resolve, reject) => {
    const loader = new TextureLoader()
    loader.load(
      "textures/no-video.png",
      map => {
        const noVideoMaterial = new MeshBasicMaterial({ map, transparent: true, side: DoubleSide })
        resolve(noVideoMaterial)
      },
      undefined,
      reject
    )
  })
}

export async function createDefaultObjects(): Promise<Object3D[]> {
  const preferences = usePreferencesStore()
  // const { push } = useObjectPool()

  const ambLight = new AmbientLight(preferences.ambientLightColor, preferences.ambientLightIntensity)
  ambLight.layers.enableAll()
  // push("GlobalAmbientLight", ambLight)

  const dirLight = new DirectionalLight(0xffffff, 1)
  dirLight.layers.enableAll()
  dirLight.position.set(0, 10, 10)
  // dirLight.rotation.set(0, 1.6, -30)
  // dirLight.castShadow = true
  // dirLight.target.position.set(-5, 0, 0)
  // push("GlobalDirectionalLight", dirLight)

  const grid = InfiniteGridHelper({
    size1: 2,
    size2: 10,
    distance: 2000,
  })
  grid.layers.enableAll()

  useSingleton().set("grid", grid)

  return [ambLight, dirLight, grid]
}

export async function createVsObjects(): Promise<Object3D[]> {
  return [grid(-7.5), grid(7.5), plane(), await leafPlane()]
}
