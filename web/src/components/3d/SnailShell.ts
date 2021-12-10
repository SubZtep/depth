import { Group } from "three/src/objects/Group"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { exec3D, loop3D } from "@depth/canvas"
import { Mesh } from "three/src/objects/Mesh"
import { createSmallBody } from "@depth/physics"
import { BoxBufferGeometry, MeshBasicMaterial, Quaternion } from "three/src/Three"

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
    const object3d = await getModel()
    const rigidBody = createSmallBody()

    const helper = new Mesh(
      new BoxBufferGeometry(0.6, 0.4, 0.7), //.translate(0, 0.2, 0.1),
      new MeshBasicMaterial({ transparent: true, opacity: 0.5 })
    )

    exec3D(({ scene }) => {
      scene.add(object3d, helper)
    })

    loop3D(() => {
      const pos = rigidBody.translation() // TODO: toFixed(5)
      object3d.position.set(pos.x, pos.y, pos.z)

      // const rot = rigidBody.rotation()
      // object3d.setRotationFromQuaternion({ x: rot.x, y: rot.y, z: rot.z, w: rot.w } as Quaternion)
    })

    return () => {}
  },
})
