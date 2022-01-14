import { sRGBEncoding } from "three/src/constants"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial"

const loader = new TextureLoader().setPath("/textures/things/Wood_Crate_001_SD/")
export const woodCrateMaterial = new MeshStandardMaterial({
  aoMap: loader.load("Wood_Crate_001_ambientOcclusion.webp"),
  map: loader.load("Wood_Crate_001_basecolor.webp"),
  bumpMap: loader.load("Wood_Crate_001_height.webp"),
  normalMap: loader.load("Wood_Crate_001_normal.webp"),
  roughnessMap: loader.load("Wood_Crate_001_roughness.webp"),
  metalness: 0,
})
woodCrateMaterial.map!.encoding = sRGBEncoding
