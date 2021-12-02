import { Mesh } from "three/src/objects/Mesh"
import { Color } from "three/src/math/Color"
import { GridHelper } from "three/src/helpers/GridHelper"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import { AmbientLight } from "three/src/lights/AmbientLight"
import { DirectionalLight } from "three/src/lights/DirectionalLight"
import { Object3D } from "three/src/core/Object3D"
import { usePreferencesStore } from "~/stores/preferences"
import useResources from "~/composables/useResources"
import { leafPlane } from "~/3D/goodybag/leaf-plane"
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial"
import { DoubleSide } from "three/src/constants"

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

export async function createVsObjects(): Promise<Object3D[]> {
  return [grid(-7.5), grid(7.5), plane(), await leafPlane()]
}
