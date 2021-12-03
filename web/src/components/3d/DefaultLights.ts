// import { exec3D } from "@depth/three.js/dist/useRenderLoop"
import { AmbientLight } from "three/src/lights/AmbientLight"
import { DirectionalLight } from "three/src/lights/DirectionalLight"
import { getCurrentInstance, onScopeDispose } from "vue"

export default defineComponent({
  setup() {
    const instance = getCurrentInstance()
    if (!instance) {
      throw new Error("Not in Vue sciope")
    }

    // console.log("QQQ", instance.appContext.app.config.globalProperties.$scene)

    const ambientLight = new AmbientLight(0x00ff00, 10.2)
    // ambientLight.layers.enableAll()

    const directionalLight = new DirectionalLight(0xffffcc, 0.8)
    // directionalLight.layers.enableAll()
    directionalLight.position.set(0, 10, 0)
    directionalLight.rotateZ(Math.PI / 4)
    // directionalLight.rotation.set(0, 1.6, -30)
    // directionalLight.castShadow = true
    // // dirLight.target.position.set(-5, 0, 0)

    // directionalLight.shadow.mapSize.width = 512 // default
    // directionalLight.shadow.mapSize.height = 512 // default
    // directionalLight.shadow.camera.near = 0.5 // default
    // directionalLight.shadow.camera.far = 500 // default

    instance.appContext.app.config.globalProperties.$scene.add(ambientLight)
    instance.appContext.app.config.globalProperties.$scene.add(directionalLight)
    // exec3D(({ scene }) =>{
    //   scene.add(ambientLight, directionalLight)
    // })

    // onScopeDispose(() => {
    //   exec3D(({ scene }) => {
    //     scene.remove(ambientLight, directionalLight)
    //   })
    // })

    return () => {}
  },
})
