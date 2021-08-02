/**
** Basic objects for a humanoid-like character.
**
** nose
** left_eye_inner
** left_eye
** left_eye_outer
** right_eye_inner
** right_eye
** right_eye_outer
** left_ear
** right_ear
** mouth_left
** mouth_right
**/
import { BLAZEPOSE_HEAD_KEYPOINTS } from "../misc/constants"
import { Mesh, MeshPhongMaterial, SphereGeometry } from "three"

const sphere = new SphereGeometry(0.3)

const red = new MeshPhongMaterial({ color: 0x9f1f19 })
const redy = new MeshPhongMaterial({ color: 0xff6600 })
const blue = new MeshPhongMaterial({ color: 0x2e536f })
const yellow = new MeshPhongMaterial({ color: 0xf7e8a9 })

export function headPart(name: typeof BLAZEPOSE_HEAD_KEYPOINTS[number]): KeypointMesh {
  let mesh: KeypointMesh

  switch (name) {
    case "nose":
      mesh = new Mesh(sphere, redy)
      break
    case "left_eye_inner":
    case "left_eye":
    case "left_eye_outer":
      mesh = new Mesh(sphere, blue)
      break
    case "right_eye_inner":
    case "right_eye":
    case "right_eye_outer":
      mesh = new Mesh(sphere, blue)
      break
    case "left_ear":
    case "right_ear":
      mesh = new Mesh(sphere, yellow)
      break
    case "mouth_left":
    case "mouth_right":
    default:
      mesh = new Mesh(sphere, red)
      break
  }

  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.name = name
  return mesh
}
