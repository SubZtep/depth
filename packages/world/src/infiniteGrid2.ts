// Based on: Fyrestar https://mevedia.com (https://github.com/Fyrestar/THREE.InfiniteGridHelper)
import { DoubleSide, GLSL3 } from "three/src/constants"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { ShaderMaterial } from "three/src/materials/ShaderMaterial"
import { Color } from "three/src/math/Color"
import { Mesh } from "three/src/objects/Mesh"

const vertexShader = `
// Shared set between most vertex shaders
layout(set = 0, binding = 0) uniform ViewUniforms {
    mat4 view;
    mat4 proj;
    vec3 pos;
} view;

// Grid position are in xy clipped space
vec3 gridPlane[6] = vec3[](
    vec3(1, 1, 0), vec3(-1, -1, 0), vec3(-1, 1, 0),
    vec3(-1, -1, 0), vec3(1, 1, 0), vec3(1, -1, 0)
);
// normal vertice projection
void main() {
    gl_Position = view.proj * view.view * vec4(gridPlane[gl_VertexIndex].xyz, 1.0);
}
`

const fragmentShader = `
layout(location = 0) out vec4 outColor;

void main() {
    outColor = vec4(1.0, 0.0, 0.0, 1.0);
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
