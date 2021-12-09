import { Group } from "three/src/objects/Group"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { exec3D } from "@depth/canvas"
import type { Mesh } from "three/src/objects/Mesh"

function getModel(): Promise<Group> {
  const { start, done, progress } = useNProgress()
  const gltfLoader = new GLTFLoader().setPath("/models/")
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath("/libs/draco/")
  gltfLoader.setDRACOLoader(dracoLoader)

  return new Promise((resolve, reject) => {
    gltfLoader.load(
      "SnailShell.glb",
      async gltf => {
        start()
        const snailObject = gltf.scene
        snailObject.traverse(node => {
          if ((node as Mesh).isMesh) {
            node.castShadow = true
            node.receiveShadow = true
          }
        })
        snailObject.scale.set(0.1, 0.1, 0.1)
        done()
        return resolve(snailObject)
      },
      xhr => set(progress, xhr.loaded / xhr.total),
      error => reject(`Load error: ${error.message}`)
    )
  })
}

export default defineComponent({
  async setup() {
    //

    const object3d = await getModel()
    // console.log("QWW", object3d)

    exec3D(({ scene }) => {
      scene.add(object3d)
    })

    return () => {}
  },
})
