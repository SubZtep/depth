import { getCurrentInstance, isReactive, onScopeDispose, watchEffect } from "vue"
import { useScene } from "@depth/canvas"

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
  // float g = getGrid(uSize);
  float g = uSize;

  myOutputColor = vec4(uColor.rgb, g * pow(d, 3.0));
}
`

export default defineComponent({
  props: {
    size: { type: Number, default: 0.9 },
    color: { type: Number, default: 0x003300 },
    distance: { type: Number, default: 400 },
    posY: { type: Number, default: -0.02 },
  },
  setup(props) {
    const scene = useScene()
    const instance = getCurrentInstance()
    if (!instance) {
      throw new Error("Not in Vue sciope")
    }

    const geometry = new THREE.PlaneGeometry(2, 2, 1, 1)
    const material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      side: THREE.DoubleSide,
      transparent: true,
      // lights: true,
      uniforms: {
        uSize: { value: props.size },
        uColor: { value: new THREE.Color(props.color) },
        uDistance: { value: props.distance },
      },
      // TODO: receive shadow
      vertexShader,
      fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotateY(Math.PI / 2)
    mesh.position.setY(props.posY)

    if (isReactive(props)) {
      // TODO: make props ref properly if necessary
      watchEffect(() => {
        material.uniforms.uSize.value = props.size
        material.uniforms.uColor.value = new THREE.Color(props.color)
        material.uniforms.uDistance.value = props.distance
        material.needsUpdate = true
      })
    }

    instance.appContext.app.config.globalProperties.$scene.add(mesh)

    onScopeDispose(() => {
      instance.appContext.app.config.globalProperties.$scene.remove(mesh)
      geometry.dispose()
      material.dispose()
    })

    return () => null
  },
})