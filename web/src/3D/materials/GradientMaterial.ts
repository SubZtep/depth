import * as THREE from "three"

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

export default class GradientMaterial extends THREE.ShaderMaterial {
  constructor(color1: THREE.Color, color2: THREE.Color) {
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
      side: THREE.DoubleSide,
      glslVersion: THREE.GLSL3,
      // wireframe: true,
    })
  }
}
