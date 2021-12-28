import { useScene } from "@depth/canvas"
import { getWorld } from "@depth/physics"
import { ColliderDesc } from "@dimforge/rapier3d-compat"
import { FrontSide, RepeatWrapping, sRGBEncoding } from "three/src/constants"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"
import { MeshPhysicalMaterial } from "three/src/materials/MeshPhysicalMaterial"
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial"
import { Vector2 } from "three/src/math/Vector2"
import { Mesh } from "three/src/objects/Mesh"

export default defineComponent({
  setup(_, { slots }) {
    // const loader = new TextureLoader().setPath("/textures/terrain/Ground_Wet_Rocks_002_SD/")
    // const loader = new TextureLoader().setPath("/textures/terrain/Rocks_Hexagons_001_SD/")

    const loader = new TextureLoader().setPath("/textures/terrain/Stylized_Grass/")

    const material = new MeshStandardMaterial({
    // const material = new MeshPhongMaterial({
    // const material = new MeshPhysicalMaterial({
    // const material = new MeshPhysicalMaterial({
      // shininess: 8,
      // aoMap: loader.load("Rocks_Hexagons_001_ambientOcclusion.jpg"),
      // map: loader.load("Rocks_Hexagons_001_basecolor.jpg"),
      // bumpMap: loader.load("Rocks_Hexagons_001_height.png"),

      aoMap: loader.load("T_SNP_Grass_A_ambientOcclusion.webp"),
      map: loader.load("T_SNP_Grass_A_basecolor.webp"),
      bumpMap: loader.load("T_SNP_Grass_A_height.webp"),
      // bumpScale: 1,
      // shininess: 0,
      // envMap: loader.load("Rocks_Hexagons_001_height.png"),
      // envMapIntensity: 1,
      // displacementScale: 1,
      bumpScale: 15,
      normalMap: loader.load("T_SNP_Grass_A_normal.webp"),
      // normalScale: new Vector2(2, 2),
      roughnessMap: loader.load("T_SNP_Grass_A_roughness.webp"),
      metalnessMap: loader.load("T_SNP_Grass_A_metallic.webp"),
      // roughness: 15,
      // side: FrontSide,
      // roughness: 0.5,
      // metalness: 0.5,
      // envMapIntensity: 10,

      // clearcoat: 1,
      // clearcoatRoughness: 1,
    })


    // const material = new MeshStandardMaterial({
    //   // aoMap: loader.load("Terracotta_Tiles_006_ambientOcclusion.jpg"),
    //   map: loader.load("Terracotta_Tiles_006_basecolor.jpg"),
    //   // bumpMap: loader.load("Terracotta_Tiles_006_height.png"),
    //   envMap: loader.load("Terracotta_Tiles_006_height.png"),
    //   // displacementScale: 1,
    //   // bumpScale: 12,
    //   // normalMap: loader.load("Terracotta_Tiles_006_normal.jpg"),
    //   // roughnessMap: loader.load("Terracotta_Tiles_006_roughness.jpg"),
    //   // roughness: 15,
    //   side: FrontSide,
    //   // roughness: 0.5,
    //   // metalness: 0.5,
    //   // envMapIntensity: 10,
    // })
    // material.bumpScale = 10
    material.map!.encoding = sRGBEncoding
    material.map!.repeat.set(4, 4)
    material.map!.wrapS = RepeatWrapping
    material.map!.wrapT = RepeatWrapping

    // material.map!.

    // material.map!.updateMatrix()
    // material.needsUpdate = true

    return () => slots.default?.({ material })
  },
})
