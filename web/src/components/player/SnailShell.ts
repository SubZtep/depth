// import type { Mesh } from "three/src/objects/Mesh"
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { Object3D } from "three/src/core/Object3D"
import useSceneHelper from "~/composables/useSceneHelper"
import useResources from "~/composables/useResources"
import { Group } from "three/src/objects/Group"

export default defineComponent({
  setup(_, { slots }) {
    const hasSlot = slots.default !== undefined
    const snail = ref<Object3D>()

    // const { start, done, progress } = useNProgress()
    const { addForPage } = useSceneHelper()
    const resources = useResources()
    let snailObject: Group

    if (resources.has("SnailShell")) {
      snailObject = resources.get("SnailShell")
      hasSlot && set(snail, snailObject)
      addForPage(snailObject)
      return
    }

    // const gltfLoader = new GLTFLoader().setPath("/models/")
    // const dracoLoader = new DRACOLoader()
    // dracoLoader.setDecoderPath("/libs/draco/")
    // gltfLoader.setDRACOLoader(dracoLoader)
    // gltfLoader.load(
    //   "SnailShell.glb",
    //   async gltf => {
    //     start()
    //     snailObject = gltf.scene
    //     snailObject.traverse((node: Mesh) => {
    //       if (node.isMesh) {
    //         node.castShadow = true
    //         node.receiveShadow = true
    //       }
    //     })
    //     snailObject.scale.set(0.1, 0.1, 0.1)
    //     // snailObject.position.setY(1)
    //     await addForPage(snailObject)
    //     done()

    //     resources.set("SnailShell", snailObject)
    //     hasSlot && set(snail, snailObject)
    //     addForPage(snailObject)
    //   },
    //   xhr => set(progress, xhr.loaded / xhr.total),
    //   error => console.log("An error happened", error)
    // )

    return () => hasSlot && slots.default!({ snail })
  },
})
