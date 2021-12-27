<template lang="pug">
</template>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"
import { sRGBEncoding } from "three/src/constants"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare"
import { PointLight } from "three/src/lights/PointLight"

const props = defineProps<{
  position?: PositionTuple
}>()

const light = new PointLight(0xffffff, 1.5, 2000)
if (props.position) {
  light.position.set(...props.position)
  // light.position.set(50, 30, 20)
}

const textureLoader = new TextureLoader()

const textureFlare0 = textureLoader.load("textures/lensflare/lensflare0.webp")
const textureFlare1 = textureLoader.load("textures/lensflare/lensflare2.webp")
const textureFlare2 = textureLoader.load("textures/lensflare/lensflare3.webp")

textureFlare0.encoding = sRGBEncoding
textureFlare1.encoding = sRGBEncoding
textureFlare2.encoding = sRGBEncoding

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
