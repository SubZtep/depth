import { RepeatWrapping, sRGBEncoding } from "three/src/constants"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"

export default defineComponent({
  setup(_, { slots }) {
    // const loader = new TextureLoader().setPath("/textures/terrain/Ground_Wet_Rocks_002_SD/")
    // const loader = new TextureLoader().setPath("/textures/terrain/Rocks_Hexagons_001_SD/")

    const loader = new TextureLoader().setPath("/textures/terrain/Terracotta_Tiles_006_SD/")

    const material = new MeshPhongMaterial({
    // const material = new MeshPhysicalMaterial({
    // const material = new MeshPhysicalMaterial({
      // shininess: 8,
      // aoMap: loader.load("Rocks_Hexagons_001_ambientOcclusion.jpg"),
      // map: loader.load("Rocks_Hexagons_001_basecolor.jpg"),
      // bumpMap: loader.load("Rocks_Hexagons_001_height.png"),

      aoMap: loader.load("Terracotta_Tiles_006_ambientOcclusion.jpg"),
      map: loader.load("Terracotta_Tiles_006_basecolor.jpg"),
      bumpMap: loader.load("Terracotta_Tiles_006_height.png"),
      bumpScale: 1,
      shininess: 0.5,
      // envMap: loader.load("Rocks_Hexagons_001_height.png"),
      // envMapIntensity: 1,
      // displacementScale: 1,
      // bumpScale: 15,
      normalMap: loader.load("Terracotta_Tiles_006_normal.jpg"),
      // normalScale: new Vector2(2, 2),
      // roughnessMap: loader.load("Rocks_Hexagons_001_roughness.jpg"),
      // roughness: 15,
      // side: FrontSide,
      // roughness: 0.5,
      // metalness: 0.5,
      // envMapIntensity: 10,

      // clearcoat: 1,
      // clearcoatRoughness: 1,
    })


    material.map!.encoding = sRGBEncoding
    material.map!.repeat.set(4, 4)
    material.map!.wrapS = RepeatWrapping
    material.map!.wrapT = RepeatWrapping

    return () => slots.default?.({ material })
  },
})
