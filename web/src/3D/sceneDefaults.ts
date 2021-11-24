import { usePreferencesStore } from "~/stores/preferences"
import {
  Mesh,
  Color,
  GridHelper,
  PlaneGeometry,
  MeshPhongMaterial,
  DoubleSide,
  MeshBasicMaterial,
  TextureLoader,
  AmbientLight,
  DirectionalLight,
  Object3D,
} from "@depth/three.js"
import useResources from "~/composables/useResources"
import { leafPlane } from "~/3D/goodybag/leaf-plane"

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
