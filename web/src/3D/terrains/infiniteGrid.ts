// Based on: Fyrestar https://mevedia.com (https://github.com/Fyrestar/THREE.InfiniteGridHelper)
import { DoubleSide, GLSL3 } from "three/src/constants"
import { PlaneBufferGeometry } from "three/src/geometries/PlaneGeometry"
import { ShaderMaterial } from "three/src/materials/ShaderMaterial"
import { Color } from "three/src/math/Color"
import { Mesh } from "three/src/objects/Mesh"
import vertexShader from "~/3D/terrains/grid.vert?raw"
import fragmentShader from "~/3D/terrains/grid.frag?raw"

export function InfiniteGridHelper(params: Record<string, any> = {}) {
  const { size1 = 1, size2 = 10, color = new Color("darkgreen"), distance = 8000 } = params

  const geometry = new PlaneBufferGeometry(2, 2, 1, 1)
  const material = new ShaderMaterial({
    glslVersion: GLSL3,
    side: DoubleSide,
    transparent: true,
    uniforms: {
      uSize1: { value: size1 },
      uSize2: { value: size2 },
      uColor: { value: color },
      uDistance: { value: distance },
    },
    vertexShader,
    fragmentShader,
  })

  const mesh = new Mesh(geometry, material)
  mesh.frustumCulled = false
  return mesh
}
