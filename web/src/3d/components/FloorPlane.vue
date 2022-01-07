<template lang="pug">
slot(:mesh="mesh")
</template>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"
import { getWorld } from "@depth/physics"
import { ColliderDesc } from "@dimforge/rapier3d-compat"
import type { ColorRepresentation } from "three"
import { DoubleSide } from "three/src/constants"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import type { MeshLambertMaterialParameters } from "three/src/materials/MeshLambertMaterial"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
import { Mesh } from "three/src/objects/Mesh"
import { onScopeDispose } from "vue"

const props = defineProps<{
  width: number
  height: number
  position?: PositionTuple
  color?: ColorRepresentation
  opacity?: number
}>()

const scene = useScene()
const geometry = new PlaneGeometry()
geometry.scale(props.width, props.height, 1)

const materialParameters: MeshLambertMaterialParameters = {
  color: props.color ?? 0x000300,
  side: DoubleSide,
}

if (props.opacity) {
  Object.assign(materialParameters, {
    transparent: true,
    opacity: props.opacity,
  })
}

const material = new MeshLambertMaterial(materialParameters)
const mesh = new Mesh(geometry, material)

const colliderHeight = 0.1

let translateCollider: Vector
if (props.position) {
  mesh.position.set(...props.position)
  translateCollider = { x: props.position[0], y: props.position[1] - colliderHeight, z: props.position[2] }
} else {
  translateCollider = { x: 0, y: -colliderHeight, z: 0 }
}

mesh.matrixAutoUpdate = false
mesh.rotateX(-Math.PI / 2)
mesh.updateMatrix()
mesh.receiveShadow = true
scene.add(mesh)

const world = getWorld()
const groundColliderDesc = ColliderDesc.cuboid(props.width / 2, colliderHeight, props.height / 2)
const groundCollider = world.createCollider(groundColliderDesc)
groundCollider.setTranslation(translateCollider)

onScopeDispose(() => {
  scene.remove(mesh)
  world.removeCollider(groundCollider, true)
})
</script>
