import { useScene } from "@depth/canvas"
import { AmbientLight } from "three/src/lights/AmbientLight"
import { DirectionalLight } from "three/src/lights/DirectionalLight"

export default defineComponent({
  setup() {
    const scene = useScene()

    const ambientLight = new AmbientLight(0xffff69, 0.2)
    // ambientLight.layers.enableAll()

    const directionalLight = new DirectionalLight(0xffffcc, 0.6)
    directionalLight.layers.enableAll()
    directionalLight.position.set(0, 10, 0)
    directionalLight.rotateZ(Math.PI / 8)
    directionalLight.rotation.set(0, 10, -30)
    directionalLight.castShadow = true
    // dirLight.target.position.set(-5, 0, 0)

    directionalLight.shadow.mapSize.width = 512 // default
    directionalLight.shadow.mapSize.height = 512 // default
    directionalLight.shadow.camera.near = 0.5 // default
    directionalLight.shadow.camera.far = 500 // default

    scene.add(ambientLight, directionalLight)

    onScopeDispose(() => {
      scene.remove(ambientLight, directionalLight)
    })

    return () => {}
  },
})
