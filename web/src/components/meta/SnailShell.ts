import type { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { loop3D, rotationFromQuaternion, useScene } from "@depth/canvas"
import { Object3D } from "three/src/core/Object3D"
import { Mesh } from "three/src/objects/Mesh"
import { useSingleton } from "@depth/misc"
import { onScopeDispose, watchEffect } from "vue"
// import { BoxGeometry } from "three/src/geometries/BoxGeometry"
// import { BoxHelper } from "three/src/helpers/BoxHelper"

function getModel(): Promise<Object3D> {
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
        snailObject.position.set(0, -0.25, 0)
        const pivot = new Object3D()
        pivot.add(snailObject)

        done()
        return resolve(pivot)
      },
      xhr => set(progress, xhr.loaded / xhr.total),
      error => reject(`Load error: ${error.message}`)
    )
  })
}

function getMaterial(obj: Object3D): MeshStandardMaterial {
  let mat: MeshStandardMaterial | undefined
  obj.traverse((child: any) => {
    if (!mat && child.material) {
      mat = Array.isArray(child.material) ? child.material[0] : child.material
    }
  })
  if (!mat) throw new Error("No material found")
  return mat
}

export default defineComponent({
  props: {
    color: { type: Number, required: true },
    wireframe: { type: Boolean, required: true },
    roughness: { type: Number, required: true },
    position: { type: Object as PropType<Ref<PositionTuple>>, required: true },
    rotation: { type: Object as PropType<Ref<RotationTuple>>, required: true },
  },
  async setup(props) {
    const scene = useScene()
    const { single } = useSingleton()

    onScopeDispose(() => {
      scene.remove(snail)
    })

    const snail = single("SnailShell", await getModel())
    scene.add(snail)
    const material = getMaterial(snail)

    // const box = new BoxGeometry(0.6, 0.45, 0.7)
    // const boxMesh = new Mesh(box)
    // const boxHelper = new BoxHelper(boxMesh, 0xffff00)
    // snail.add(boxHelper)

    // eslint-disable-next-line vue/no-watch-after-await
    watchEffect(() => {
      material.color.set(props.color)
      material.wireframe = props.wireframe
      material.roughness = props.roughness
    })

    // console.log(props.position.value)

    loop3D(() => {
      if (
        snail.position.x !== props.position.value[0] ||
        snail.position.y !== props.position.value[1] ||
        snail.position.z !== props.position.value[2]
      ) {
        // FIXME: lerp position
        snail.position.set(...(props.position.value as PositionTuple))
      }

      if (
        snail.quaternion.x !== props.rotation.value[0] ||
        snail.quaternion.y !== props.rotation.value[1] ||
        snail.quaternion.z !== props.rotation.value[2] ||
        snail.quaternion.w !== props.rotation.value[3]
      ) {
        // FIXME: lerp rotation
        rotationFromQuaternion(snail, props.rotation.value)
      }
    })

    return () => {}
  },
})
