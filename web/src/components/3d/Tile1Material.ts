import { useScene } from "@depth/canvas"
import { getWorld } from "@depth/physics"
import { ColliderDesc } from "@dimforge/rapier3d-compat"
import { FrontSide, RepeatWrapping, sRGBEncoding } from "three/src/constants"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial"
import { Mesh } from "three/src/objects/Mesh"

export default defineComponent({
  setup(_, { slots }) {
    const loader = new TextureLoader().setPath("/textures/terrain/Tiles_045_SD/")

    // const material = new MeshStandardMaterial({
    //   aoMap: loader.load("Tiles_045_ambientOcclusion.webp"),
    //   map: loader.load("Tiles_045_basecolor.webp"),
    //   bumpMap: loader.load("Tiles_045_height.webp"),
    //   normalMap: loader.load("Tiles_045_normal.webp"),
    //   roughnessMap: loader.load("Tiles_045_roughness.webp"),
    //   side: FrontSide,
    //   bumpScale: 10,
    //   // roughness: 15,
    //   // metalness: 5,
    //   // depthTest: true,
    // })
    const material = new MeshPhongMaterial({
      aoMap: loader.load("Tiles_045_ambientOcclusion.webp"),
      map: loader.load("Tiles_045_basecolor.webp"),
      bumpMap: loader.load("Tiles_045_height.webp"),
      normalMap: loader.load("Tiles_045_normal.webp"),
      // roughnessMap: loader.load("Tiles_045_roughness.webp"),
      // side: FrontSide,
      bumpScale: 15,
      shininess: 15,
      // roughness: 15,
      // metalness: 5,
      // depthTest: true,
    })
    material.map!.encoding = sRGBEncoding
    material.map!.repeat.set(2, 2)
    material.map!.wrapS = RepeatWrapping
    material.map!.wrapT = RepeatWrapping

    return () => slots.default?.({ material })
  },
})
