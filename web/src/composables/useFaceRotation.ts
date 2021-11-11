import type { FaceMeshResults } from "@depth/mediapipe"
import { Quaternion } from "three/src/math/Quaternion"
import { Vector3 } from "three/src/math/Vector3"
import type { Ref } from "vue"

function rotateVectorsSimultaneously(u0: Vector3, v0: Vector3, u2: Vector3, v2: Vector3) {
  // https://stackoverflow.com/a/55248720/1398275
  const q2 = new Quaternion().setFromUnitVectors(u0, u2)
  const v1 = v2.clone().applyQuaternion(q2.clone().conjugate())

  const v0_proj = v0.projectOnPlane(u0)
  const v1_proj = v1.projectOnPlane(u0)

  let angleInPlane = v0_proj.angleTo(v1_proj)
  if (v1_proj.dot(new Vector3().crossVectors(u0, v0)) < 0) {
    angleInPlane *= -1
  }
  const q1 = new Quaternion().setFromAxisAngle(u0, angleInPlane)
  const q = new Quaternion().multiplyQuaternions(q2, q1)

  return q
}

export default function useFaceRotation(landmarks: Ref<FaceMeshResults["multiFaceLandmarks"] | undefined>) {
  const q = ref(new Quaternion())
  const pos = ref(new Vector3())
  const vh1o = new Vector3(1, 0, 0)
  const vv1o = new Vector3(0, 1, 0)

  watch (landmarks, l => {
    if (l === undefined) return
    const lm = l[0]
    if (!lm || !lm[454] || !lm[234] || !lm[10] || !lm[152] || !lm[173]) return

    const vh1 = new Vector3(l[0][454].x, l[0][454].y, l[0][454].z)
    const vh2 = new Vector3(l[0][234].x, l[0][234].y, l[0][234].z)
    const vv1 = new Vector3(l[0][10].x, l[0][10].y, l[0][10].z)
    const vv2 = new Vector3(l[0][152].x, l[0][152].y, l[0][152].z)

    const vh2o = vh2.clone().sub(vh1.clone()).normalize()
    const vv2o = vv2.clone().sub(vv1.clone()).normalize()

    q.value = rotateVectorsSimultaneously(vh1o, vv1o, vh2o, vv2o)
    pos.value.set(lm[173].x, lm[173].y, lm[173].z)
  })

  return {
    q,
    pos,
  }
}
