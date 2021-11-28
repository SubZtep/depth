import { LatheGeometry } from "three/src/geometries/LatheGeometry"
import { Vector2 } from "three/src/math/Vector2"
import { Mesh } from "three/src/objects/Mesh"
import { Color } from "three/src/math/Color"
import useSceneHelper from "~/composables/useSceneHelper"
import GradientMaterial from "~/3D/materials/GradientMaterial"

export default function () {
  const points: Vector2[] = [
    new Vector2(1, 0),
    new Vector2(1, 1),
    new Vector2(2, 1),
    new Vector2(2, 2),
    new Vector2(3, 2),
    new Vector2(3, 3),
  ]
  const geometry = new LatheGeometry(points, 4)
  geometry.rotateX(-Math.PI / 2)
  geometry.rotateZ(Math.PI / 4)
  const material = new GradientMaterial(new Color("red"), new Color("purple"))
  const lathe = new Mesh(geometry, material)
  lathe.position.set(0, 0, -10)

  useSceneHelper().addForPage(lathe)

  onBeforeUnmount(() => {
    geometry.dispose()
    material.dispose()
  })

  return lathe
}
