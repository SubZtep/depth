import { DoubleSide, GLSL3 } from "three/src/constants"
import { ShaderMaterial } from "three/src/materials/ShaderMaterial"
import { Color } from "three/src/math/Color"

const vertexShader = `
  out vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`

const fragmentShader = `
  uniform vec3 color1;
  uniform vec3 color2;

  in vec2 vUv;
  out vec4 myOutputColor;

  void main() {
    myOutputColor = vec4(mix(color1, color2, vUv.y), 1.0);
  }
`

export default class GradientMaterial extends ShaderMaterial {
  constructor(color1: Color, color2: Color) {
    super({
      uniforms: {
        color1: {
          value: color1,
        },
        color2: {
          value: color2,
        },
      },
      vertexShader,
      fragmentShader,
      side: DoubleSide,
      glslVersion: GLSL3,
      // wireframe: true,
    })
  }
}
