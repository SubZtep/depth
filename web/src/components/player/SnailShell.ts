import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { Object3D } from "three/src/core/Object3D"
import useSceneHelper from "~/composables/useSceneHelper"
import useResources from "~/composables/useResources"

export default defineComponent({
  setup(_props, { slots }) {
    const hasSlot = slots.default !== undefined
    const snail = ref<Object3D>()

    const { start, done, progress } = useNProgress()
    const { addForPage } = useSceneHelper()
    const resources = useResources()
    let snailObj: Object3D

    if (resources.has("SnailShell")) {
      snailObj = resources.get("SnailShell")
      hasSlot && set(snail, snailObj)
      addForPage(snailObj)
      return
    }

    const gltfLoader = new GLTFLoader().setPath("/models/")
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath("/libs/draco/")
    gltfLoader.setDRACOLoader(dracoLoader)
    gltfLoader.load(
      "SnailShell.glb",
      async gltf => {
        start()
        snailObj = gltf.scene
        snailObj.scale.set(0.1, 0.1, 0.1)
        await addForPage(snailObj)
        done()

        resources.set("SnailShell", snailObj)
        hasSlot && set(snail, snailObj)
        addForPage(snailObj)
      },
      xhr => set(progress, xhr.loaded / xhr.total),
      e => console.log("An error happened", e)
    )

    return () => hasSlot && slots.default!({ snail })
  },
})
