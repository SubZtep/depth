import { Group } from "three/src/objects/Group"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { exec3D, loop3D, rotationFromQuaternion } from "@depth/canvas"
import { Mesh } from "three/src/objects/Mesh"
import { createSmallBody } from "@depth/physics"
import { Object3D } from "three/src/Three"
import { defineEmits } from "vue"

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
  emits: ["rigid-body", "material"],
  async setup(_, { emit }) {
    const mesh = await getModel()
    // mesh.mate/
    // mesh.children[0].material.color.set(0xffffff)

    mesh.traverse((child: any) => {
      if (child.material) {
        emit("material", Array.isArray(child.material) ? child.material[0] : child.material)
        // console.log("XXX", child.material)
        // if (Array.isArray(child.material)) {
        //   // child.material[0].emissive.set(0x0000ff)
        // } else {
        //   // child.material.emissive.set(0x0000ff)
        // }
      }
    })

    mesh.position.set(0, -0.5, 0)
    const pivot = new Object3D()
    pivot.add(mesh)

    const rigidBody = createSmallBody()

    emit("rigid-body", rigidBody)
    // emit("mesh", mesh)

    // const helper = new Mesh(
    //   new BoxBufferGeometry(0.6, 0.4, 0.7), //.translate(0, 0.2, 0.1),
    //   new MeshBasicMaterial({ transparent: true, opacity: 0.5 })
    // )

    exec3D(({ scene }) => {
      scene.add(pivot)
    })

    loop3D(() => {
      const pos = rigidBody.translation() // TODO: toFixed(5)
      const x = +pos.x.toFixed(5)
      const y = +pos.y.toFixed(5)
      const z = +pos.z.toFixed(5)
      if (x !== pivot.position.x || y !== pivot.position.y || z !== pivot.position.z) {
        pivot.position.set(pos.x, pos.y, pos.z)
      }

      // const rot = rigidBody.rotation()
      // rotationFromQuaternion(pivot, rot)
    })

    return () => {}
  },
})
