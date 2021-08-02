/**
** Basic objects for a humanoid-like character.
**/
import { BLAZEPOSE_HEAD_KEYPOINTS } from "../misc/constants"
import { Mesh, MeshPhongMaterial, SphereGeometry, ConeGeometry, CylinderGeometry, DoubleSide } from "three"

const sphere = new SphereGeometry(0.3)
const sphereSmall = new SphereGeometry(0.2)
const cone = new ConeGeometry(0.2, 1, 4)
const hat = new SphereGeometry(1.3, 4, 4, 0, 3, 0.3, 2.7)
const cylinder = new CylinderGeometry(0.5, 0.5, 0.1, 8, 1)

const red = new MeshPhongMaterial({ color: 0x9f1f19 })
const redy = new MeshPhongMaterial({ color: 0xaa6900 })
const blue = new MeshPhongMaterial({ color: 0x2e536f })
const white = new MeshPhongMaterial({ color: 0xffffff })
const yellow = new MeshPhongMaterial({ color: 0xf7e8a9 })
const yellower = new MeshPhongMaterial({ color: 0x691300, flatShading: true, transparent: true, opacity: 0.3 })
yellower.side = DoubleSide

export function headPart(name: typeof BLAZEPOSE_HEAD_KEYPOINTS[number]): KeypointMesh {
  let mesh: KeypointMesh

  switch (name) {
    case "nose":
      mesh = new Mesh(sphere, red)
      break
    case "left_eye":
    case "right_eye":
      mesh = new Mesh(sphere, blue)
      break
    case "left_eye_inner":
    case "right_eye_inner":
    case "left_eye_outer":
    case "right_eye_outer":
      mesh = new Mesh(sphereSmall, white)
      break
    case "left_ear":
    case "right_ear":
      mesh = new Mesh(cylinder, redy)
      mesh.rotation.x = Math.PI / 2
      mesh.rotation.z = Math.PI / 2
      break
    case "mouth_left":
    case "mouth_right":
      mesh = new Mesh(cone, yellow)
      mesh.rotateX(Math.PI)
      break

    case "hat":
      mesh = new Mesh(hat, yellower)
      break
    default:
      throw new Error(`Unknown head part: ${name}`)
  }

  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.name = name
  return mesh
}
