<template lang="pug">
</template>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare"

const props = defineProps<{
  position?: PositionTuple
  color?: number | string
  intensity?: number
}>()

const light = new THREE.PointLight(props.color ?? 0xffffff, props.intensity ?? 1.5, 2000)
if (props.position) {
  light.position.set(...props.position)
  // light.position.set(50, 30, 20)
}

const textureLoader = new THREE.TextureLoader()

const textureFlare0 = textureLoader.load("textures/lensflare/lensflare0.webp")
const textureFlare1 = textureLoader.load("textures/lensflare/lensflare2.webp")
const textureFlare2 = textureLoader.load("textures/lensflare/lensflare3.webp")

textureFlare0.encoding = THREE.sRGBEncoding
textureFlare1.encoding = THREE.sRGBEncoding
textureFlare2.encoding = THREE.sRGBEncoding

const lensflare = new Lensflare()

lensflare.addElement(new LensflareElement(textureFlare0, 512, 0))
lensflare.addElement(new LensflareElement(textureFlare1, 512, 0))
lensflare.addElement(new LensflareElement(textureFlare2, 60, 0.6))

light.add(lensflare)

const scene = useScene()
scene.add(light)

onScopeDispose(() => {
  scene.remove(light)
})
</script>
