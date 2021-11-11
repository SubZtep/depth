// Based on: Fyrestar https://mevedia.com (https://github.com/Fyrestar/THREE.InfiniteGridHelper)
import { DoubleSide, GLSL3 } from "three/src/constants"
import { PlaneBufferGeometry } from "three/src/geometries/PlaneGeometry"
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
  uniform float uSize1;
  uniform float uSize2;
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
    float g1 = getGrid(uSize1);
    float g2 = getGrid(uSize2);

    myOutputColor = vec4(uColor.rgb, mix(g2, g1, g1) * pow(d, 3.0));
  }
  `

export function InfiniteGridHelper(params: Record<string, any> = {}) {
  const { size1 = 1, size2 = 10, color = new Color("darkgreen"), distance = 8000 } = params

  const geometry = new PlaneBufferGeometry(2, 2, 1, 1)
  const material = new ShaderMaterial({
    side: DoubleSide,
    uniforms: {
      uSize1: { value: size1 },
      uSize2: { value: size2 },
      uColor: { value: color },
      uDistance: { value: distance },
    },
    transparent: true,
    vertexShader,
    fragmentShader,
    glslVersion: GLSL3,
  })

  const mesh = new Mesh(geometry, material)
  mesh.frustumCulled = false
  return mesh
}
