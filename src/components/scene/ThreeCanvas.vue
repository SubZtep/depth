<template lang="pug">
Teleport(to="#world")
  canvas(ref="wc")

MainScene
</template>

<script lang="ts" setup>
import {
  Mesh,
  Color,
  Vector3,
  SpotLight,
  GridHelper,
  PlaneGeometry,
  HemisphereLight,
  MeshPhongMaterial,
  DoubleSide,
} from "three"
import type { Ref } from "vue"
import { ref, provide } from "vue"
import { useToast } from "vue-toastification"
import { sleep, rand } from "../../misc/utils"
import { useAssets } from "../../packages/ThreeJS/useAssets"
import { useThreeJs } from "../../packages/ThreeJS/useThreeJS"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { transformables } from "../../packages/ThreeJS/useTransformControls"

const assets = useAssets()
const toast  = useToast()
const errorHandler: ErrorHandler = e => {
  if (e instanceof Error) {
    toast.error(e.message)
  }
}

await assets.loadNoVideoMaterial()
const leaf   = await assets.loadLeafMaterial()
const skybox = await assets.loadSkybox(rand(15))
const wc = ref() as Ref<HTMLCanvasElement>

useThreeJs(
  scene => {
    const hemiLight = new HemisphereLight(0xb1e1ff, 0x080820, 2)
    scene.add(hemiLight)

    const light = new SpotLight(0xffa95c, 4)
    light.position.set(-50, 50, 50)
    light.castShadow = true
    light.shadow.bias = -0.0001
    light.shadow.mapSize.width = 1024 * 4
    light.shadow.mapSize.height = 1024 * 4
    scene.add(light)

    const grid = new GridHelper(20, 20, Color.NAMES.yellow, Color.NAMES.green)
    grid.receiveShadow = true
    scene.add(grid)

    const plane = new Mesh(
      new PlaneGeometry(6, 2),
      new MeshPhongMaterial({ color: 0x001000, specular: 0x000000, shininess: 69, side: DoubleSide })
    )
    plane.position.setX(2)
    plane.position.setY(-0.1)
    plane.rotateX(-Math.PI / 2)
    plane.receiveShadow = true
    scene.add(plane)

    const leafPlane = new Mesh(new PlaneGeometry(4, 4), leaf)
    leafPlane.rotateX(-Math.PI / 2)
    leafPlane.position.set(-1, -0.05, 0.7)
    leafPlane.receiveShadow = true
    leafPlane.name = "leafPlane"
    scene.add(leafPlane)
    transformables.push(leafPlane.name)

    scene.background = skybox
    return {
      // light
    }
  },
  {
    canvas: wc,
    errorHandler,
  }
)

useNProgress().done()

// tickFns.add(({ cameraControls, light }) => {
//   let pos = new Vector3()
//   cameraControls.getPosition(pos)
//   light.position.set(...pos.toArray())
//   return Promise.resolve()
// })

// provide("scene", scene)
// provide("tickFns", tickFns)
// provide("toggleRun", toggleRun)

// await sleep(69)
// useNProgress().done()
// toggleRun()
</script>
