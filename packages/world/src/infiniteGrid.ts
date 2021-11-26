// Based on: Fyrestar https://mevedia.com (https://github.com/Fyrestar/THREE.InfiniteGridHelper)
import { DoubleSide, GLSL3 } from "three/src/constants"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { ShaderMaterial } from "three/src/materials/ShaderMaterial"
import { Color } from "three/src/math/Color"
import { Mesh } from "three/src/objects/Mesh"

const vertexShader = `
uniform float uDistance;
out vec3 worldPosition;

void main() {
  vec3 pos = position.xzy * uDistance;
  pos.xz += cameraPosition.xz;
  worldPosition = pos;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

const fragmentShader = `
uniform float uSize;
uniform vec3 uColor;
uniform float uDistance;
in vec3 worldPosition;
out vec4 myOutputColor;

float getGrid(float size) {
  vec2 r = worldPosition.xz / size;
  vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
  float line = min(grid.x, grid.y);
  return 1.0 - min(line, 1.0);
}

void main() {
  float d = 1.0 - min(distance(cameraPosition.xz, worldPosition.xz) / uDistance, 1.0);
  float g = getGrid(uSize);

  myOutputColor = vec4(uColor.rgb, g * pow(d, 3.0));
}
`

export interface InfiniteGridParameters {
  size: number
  color: Color
  distance: number
}

export function infiniteGrid(parameters: InfiniteGridParameters) {
  const geometry = new PlaneGeometry(2, 2, 1, 1)
  const material = new ShaderMaterial({
    glslVersion: GLSL3,
    side: DoubleSide,
    transparent: true,
    // lights: true,
    uniforms: {
      uSize: { value: parameters.size },
      uColor: { value: parameters.color },
      uDistance: { value: parameters.distance },
    },
    // TODO: receive shadow
    vertexShader,
    fragmentShader,
  })

  const mesh = new Mesh(geometry, material)
  mesh.layers.enableAll()
  // mesh.layers.disable(1)
  mesh.layers.set(0)

  mesh.frustumCulled = false

  return mesh
}
