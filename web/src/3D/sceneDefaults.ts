import { usePreferencesStore } from "~/stores/preferences"
import { DDSLoader } from "@depth/three.js"
import { GridHelper } from "@depth/three.js"
import { Color } from "@depth/three.js"
import { Mesh } from "@depth/three.js"
import { PlaneGeometry } from "@depth/three.js"
import { MeshPhongMaterial } from "@depth/three.js"
import { CubeReflectionMapping, DoubleSide, LinearFilter } from "@depth/three.js"
import { MeshBasicMaterial } from "@depth/three.js"
import { TextureLoader } from "@depth/three.js"
import { AmbientLight } from "@depth/three.js"
import { DirectionalLight } from "@depth/three.js"
import { Object3D } from "@depth/three.js"
import useResources from "~/composables/useResources"
import { MeshLambertMaterial } from "@depth/three.js"

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
    new MeshPhongMaterial({ color: 0x00_10_00, specular: 0x00_00_00, shininess: 69, side: DoubleSide })
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

export async function leafPlane(position?: Vector) {
  const leaf = await loadLeafMaterial()
  const leafPlane = new Mesh(new PlaneGeometry(4, 4), leaf)
  leafPlane.rotateX(-Math.PI / 2)
  if (position) leafPlane.position.set(position.x, position.y, position.z)
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
  const { resources } = useResources()

  const ambientLight = new AmbientLight(
    preferences.ambientLightColor,
    0.2
    // preferences.ambientLightIntensity
  )
  ambientLight.layers.enableAll()
  resources.set("GlobalAmbientLight", ambientLight)

  const directionalLight = new DirectionalLight(0xffffcc, 0.8)
  directionalLight.layers.enableAll()
  directionalLight.position.set(0, 10, 0)
  directionalLight.rotateZ(Math.PI / 4)
  // directionalLight.rotation.set(0, 1.6, -30)
  directionalLight.castShadow = true
  // dirLight.target.position.set(-5, 0, 0)

  directionalLight.shadow.mapSize.width = 512 // default
  directionalLight.shadow.mapSize.height = 512 // default
  directionalLight.shadow.camera.near = 0.5 // default
  directionalLight.shadow.camera.far = 500 // default

  resources.set("GlobalDirectionalLight", directionalLight)

  return [ambientLight, directionalLight]
}

export async function createVsObjects(): Promise<Object3D[]> {
  return [grid(-7.5), grid(7.5), plane(), await leafPlane()]
}
