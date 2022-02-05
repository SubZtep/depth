import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { loop3D, rotationFromQuaternion, useScene } from "@depth/canvas"
import { useSingleton } from "@depth/misc"
import { onScopeDispose, watchEffect } from "vue"

const gltfLoader = new GLTFLoader().setPath("/models/")
gltfLoader.setDRACOLoader(new DRACOLoader().setDecoderPath("/libs/draco/"))

let model: THREE.Object3D

function getModel(scale = 0.1): Promise<THREE.Object3D> {
  const { progress } = useNProgress()

  return new Promise((resolve, reject) => {
    gltfLoader.load(
      "SnailShell.glb",
      async gltf => {
        const group = gltf.scene
        group.scale.set(scale, scale, scale)
        group.position.set(0, -scale * 4, 0)
        group.traverse(node => {
          if ((node as THREE.Mesh).isMesh) {
            node.castShadow = true
            node.receiveShadow = true
          }
        })
        return gltf
        // const pivot = new Object3D().add(group)
        // return resolve(pivot)
      },
      xhr => set(progress, xhr.loaded / xhr.total),
      error => reject(`Load error: ${error.message}`)
    )
  })
}

function searchMaterial(group: THREE.Object3D): THREE.MeshStandardMaterial {
  group.traverse((child: any) => {
    if (child.material) {
      return [child.material].flat().pop()
    }
  })
  throw new Error("No material found")
}

export default defineComponent({
  props: {
    color: { type: Number, required: true },
    wireframe: { type: Boolean, required: true },
    roughness: { type: Number, required: true },
    position: { type: Object as PropType<Ref<PositionTuple>>, required: true },
    rotation: { type: Object as PropType<Ref<RotationTuple>>, required: true },
    id: { type: String, required: false },
  },
  async setup(props, { slots }) {
    const scene = useScene()
    const { single } = useSingleton()

    onScopeDispose(() => {
      scene.remove(mesh)
    })

    if (!model) await getModel()
    const material = searchMaterial(model)

    // @ts-ignore
    const mesh = single(`${props.id}_SnailShell`, new THREE.Mesh(model.associations, material))

    const box = new THREE.BoxGeometry(0.6, 0.45, 0.7)
    const boxMesh = new THREE.Mesh(box)
    const boxHelper = new THREE.BoxHelper(boxMesh, 0xe4e41b)
    mesh.add(boxHelper)

    // eslint-disable-next-line vue/no-watch-after-await
    watchEffect(() => {
      material.color.set(props.color)
      material.wireframe = props.wireframe
      material.roughness = props.roughness
    })

    // console.log(props.position.value)

    loop3D(() => {
      if (
        mesh.position.x !== props.position.value[0] ||
        mesh.position.y !== props.position.value[1] ||
        mesh.position.z !== props.position.value[2]
      ) {
        // FIXME: lerp position
        mesh.position.set(...(props.position.value as PositionTuple))
      }

      if (
        mesh.quaternion.x !== props.rotation.value[0] ||
        mesh.quaternion.y !== props.rotation.value[1] ||
        mesh.quaternion.z !== props.rotation.value[2] ||
        mesh.quaternion.w !== props.rotation.value[3]
      ) {
        // FIXME: lerp rotation
        rotationFromQuaternion(mesh, props.rotation.value)
      }
    })

    return () => slots.default?.({ mesh })
  },
})
