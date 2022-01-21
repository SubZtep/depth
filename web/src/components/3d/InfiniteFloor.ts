import { loop3D, useScene } from "@depth/canvas"
import { useMouse } from "@vueuse/core"

const vertexShader = `
  uniform vec2 u_resolution;
  varying vec2 u_mouse;
  varying float u_time;

  void main() {
    // gl_Position = vec4(position, 1.0);
    vec3 pos = position.xzy * u_resolution.x;
    // vec3 pos = position.xzy * u_resolution.x;
    // pos.xz += cameraPosition.xz;
    // worldPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform vec2 u_resolution;
  varying vec2 u_mouse;
  varying float u_time;

  // Plot a line on Y using a value between 0.0-1.0
  float plot(vec2 st) {
      return smoothstep(0.02, 0.0, abs(st.y - st.x));
  }

  void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;

    float y = st.x;

    vec3 color = vec3(y);

    // Plot a line
    float pct = plot(st);
    color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);

    // color = vec3(0.0, 0.0, 1.0)
    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(y > 0.000001 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 0.0, 1.0), 1.0);
  }


`

export default defineComponent({
  props: {
    size: { type: Number, default: 1 },
    color: { type: Number, default: 0x00ff00 },
    distance: { type: Number, default: 100 },
  },
  setup(props) {
    const scene = useScene()
    // const instance = getCurrentInstance()
    // if (!instance) {
    //   throw new Error("Not in Vue sciope")
    // }

    const { x, y } = useMouse()

    const uniforms = {
      uTime: { type: "f", value: 1 },
      // uResolution: { type: "v2", value: new Vector2() },
      uMouse: { type: "v2", value: new THREE.Vector2() },
      // uTime: { type: "f", value: 1 },
      uResolution: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      // uMouse: { type: "v2", value: new Vector2(get(x), get(y)) },
    }

    const geometry = new THREE.PlaneGeometry(2, 2)
    // const materialq = new MeshBasicMaterial({ color: 0xffff66, side: FrontSide, })
    const material = new THREE.ShaderMaterial({
      // glslVersion: GLSL3,
      side: THREE.DoubleSide,
      // transparent: true,
      // lights: true,
      uniforms,

      // TODO: receive shadow
      vertexShader,
      fragmentShader,

      blending: THREE.AdditiveBlending,
      depthTest: false,
      // transparent: true,
      vertexColors: true,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotateY(-Math.PI / 2)
    mesh.position.setY(0.1)

    scene.add(mesh)

    // uniforms.uMouse.value.x = get(x)
    // uniforms.uMouse.value.y = get(y)

    // uniforms.uResolution.value.x = window.innerWidth
    // uniforms.uResolution.value.y = window.innerHeight
    // uniforms.uResolution.needsUpdate = true

    // geometry.setAttribute("uResolution", new Float32BufferAttribute([window.innerWidth, window.innerHeight], 2))

    const start = performance.now()

    loop3D(({ clock }) => {
      uniforms.uTime.value = clock.elapsedTime
      // geometry.attributes.uTime.needsUpdate = true
      // uniforms.uTime.value = (performance.now() - start) * 1000
      // uniforms.uTime.value = uniforms.uTime.value + deltaTime / 1000

      uniforms.uMouse.value.x = get(x)
      uniforms.uMouse.value.y = get(y)

      // geometry.attributes.uMouse.needsUpdate = true

      // geometry.setAttribute("uTime", new Float32BufferAttribute([clock.elapsedTime], 1))
      // geometry.setAttribute("uMouse", new Float32BufferAttribute([get(x), get(y)], 2))

      material.needsUpdate = true
      // console.log("BNOOOO", uniforms)
      mesh.updateMatrix()
    })

    // if (isReactive(props)) {
    //   // TODO: make props ref properly if necessary
    //   watchEffect(() => {
    //     material.uniforms.uSize.value = props.size
    //     material.uniforms.uColor.value = new Color(props.color)
    //     material.uniforms.uDistance.value = props.distance
    //     material.needsUpdate = true
    //   })
    // }

    // onScopeDispose(() => {
    //   scene.remove(mesh)
    //   geometry.dispose()
    //   material.dispose()
    // })

    return () => null
  },
})
