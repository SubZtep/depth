import { Color } from "three"
import { GridHelper } from "three/src/helpers/GridHelper"

export function floor(size = 10, divisions = 10, color1 = Color.NAMES.yellow, color2 = Color.NAMES.green) {
  const gridHelper = new GridHelper(size, divisions, color1, color2)
  // gridHelper.position.x = 50
  return gridHelper
}
