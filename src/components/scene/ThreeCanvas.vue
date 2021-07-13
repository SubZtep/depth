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
  MeshBasicMaterial,
  MeshLambertMaterial,
  DoubleSide,
  BackSide,
  FrontSide,
} from "three"
import type { Ref } from "vue"
import { useToast } from "vue-toastification"
import { sleep, rand } from "../../misc/utils"
import { useAssets } from "../../packages/ThreeJS/useAssets"
import { useCanvas } from "../../packages/ThreeJS/useThreeJS"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { transformables } from "../../packages/ThreeJS/useTransformControls"
import { singleFns, loopFns } from "../../packages/ThreeJS/useRenderLoop"
import { useStats } from "../../packages/Stats/plugin"
import { useGui } from "../../packages/datGUI/plugin"

import * as THREE from "three"

const assets = useAssets()

await assets.loadNoVideoMaterial()
const leaf = await assets.loadLeafMaterial()
const skybox = await assets.loadSkybox(rand(15))
const wc = ref() as Ref<HTMLCanvasElement>

const stats = useStats()
loopFns.add(() => stats.update())
// loopFns.add(() => stats.update())
useGui().show()

await sleep(69)
useCanvas(wc)

singleFns.add(({ scene }) => {
  // const hemiLight = new HemisphereLight(0xb1e1ff, 0x080820, 2)
  // scene.add(hemiLight)

  // const light = new SpotLight(0xffa95c, 4)
  // light.position.set(-50, 50, 50)
  // light.castShadow = true
  // light.shadow.bias = -0.0001
  // light.shadow.mapSize.width = 1024 * 4
  // light.shadow.mapSize.height = 1024 * 4
  // scene.add(light)

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

  const material = new MeshPhongMaterial({
    color: 0x001001,
    specular: 0x010000,
    // shininess: 69,
    side: FrontSide,
  })

  // @ts-ignore
  const terrainScene = Terrain(
    {
      // @ts-ignore
      easing: THREE.Linear,
      frequency: 2.5,
      // @ts-ignore
      heightmap: THREE.DiamondSquare,
      material,
      maxHeight: -1,
      minHeight: -35,
      steps: 1,
      xSegments: 64,
      xSize: 128,
      ySegments: 64,
      ySize: 128,
    },
    THREE
  )

  scene.add(terrainScene)

  scene.background = skybox
})

useNProgress().done()
</script>
