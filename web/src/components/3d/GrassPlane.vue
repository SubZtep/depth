<template lang="pug">
slot(:mesh="mesh")
</template>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"
import { getWorld } from "@depth/physics"
import { ColliderDesc } from "@dimforge/rapier3d-compat"
import { FrontSide, DoubleSide, RepeatWrapping, sRGBEncoding } from "three/src/constants"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"
import { Mesh } from "three/src/objects/Mesh"

const props = defineProps<{
  width: number
  height: number
  position?: PositionTuple
}>()

const geometry = new PlaneGeometry(props.width, props.height)

const material = new MeshPhongMaterial({
  color: 0xffffff,
  side: FrontSide,
  map: new TextureLoader().load("/textures/terrain/grasslight-big.webp"),
  shininess: 0,
})
const mesh = new Mesh(geometry, material)
mesh.material.map!.repeat.set(2, 2)
mesh.material.map!.wrapS = RepeatWrapping
mesh.material.map!.wrapT = RepeatWrapping
mesh.material.map!.encoding = sRGBEncoding
mesh.receiveShadow = true

mesh.matrixAutoUpdate = false
mesh.rotateX(-Math.PI / 2)
mesh.updateMatrix()

const scene = useScene()
scene.add(mesh)

const colliderHeight = 0.1

let translateCollider: Vector
if (props.position) {
  mesh.position.set(...props.position)
  translateCollider = { x: props.position[0], y: props.position[1] - colliderHeight, z: props.position[2] }
} else {
  translateCollider = { x: 0, y: -colliderHeight, z: 0 }
}

const world = getWorld()
const groundColliderDesc = ColliderDesc.cuboid(props.width / 2, colliderHeight, props.height / 2)
const groundCollider = world.createCollider(groundColliderDesc)
groundCollider.setTranslation(translateCollider)

onScopeDispose(() => {
  scene.remove(mesh)
  world.removeCollider(groundCollider, true)
})
</script>
