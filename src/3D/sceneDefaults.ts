import { Mesh, Color, GridHelper, PlaneGeometry, MeshPhongMaterial, MeshBasicMaterial, DoubleSide } from "three"
import { useAssets } from "../packages/ThreeJS/useAssets"

const assets = useAssets()

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
  // scene.add(plane)
  return plane
}

export function leafPlane() {
  const leaf = assets.assets.get("leafMaterial") as MeshBasicMaterial
  const leafPlane = new Mesh(new PlaneGeometry(4, 4), leaf)
  leafPlane.rotateX(-Math.PI / 2)
  leafPlane.position.set(-1, -0.05, -20.7)
  leafPlane.receiveShadow = true
  leafPlane.name = "leafPlane"
  return leafPlane
}
