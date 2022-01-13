import { useScene } from "@depth/canvas"
import * as THREE from "three"

export {}

function map(val, r1start, r1end, r2start, r2end) {
  return r2start + (r2end - r2start) * ((val - r1start) / (r1end - r1start))
}

// profile
const curve = new THREE.EllipseCurve(
  0,
  0, // ax, aY
  0.5,
  0.5, // xRadius, yRadius
  0,
  2 * Math.PI, // aStartAngle, aEndAngle
  false, // aClockwise
  0 // aRotation
)
let profilePoints: THREE.Vector3[] = curve.getPoints(12)

profilePoints = profilePoints.map(p => {
  return new THREE.Vector3().copy(p).setZ(0)
})
for (const p of profilePoints) {
  p.applyEuler(new THREE.Euler(THREE.Math.degToRad(90), 0, 0))
}

// spiral
const shellPoints: THREE.Vector3[] = []
const shellIndex = []

const spiralPoints: THREE.Vector3[] = []
spiralPoints.push(new THREE.Vector3())
const sResolution = 150
const sTurns = 3.14
const alpha = THREE.Math.degToRad(80)
const radiusVector = new THREE.Vector3(1, 0, 0)
const axis = new THREE.Vector3(0, 0, 1)
const euler = new THREE.Euler()
for (let i = 0; i <= sResolution; i++) {
  const theta = map(i, 0, sResolution, 0, Math.PI * 2 * sTurns)
  const rad = Math.exp(theta / Math.tan(alpha)) // cos / sin = cotangent = 1 / tan

  const theta2 = theta + Math.PI * 2
  const rad2 = Math.exp(theta2 / Math.tan(alpha))

  const midRad = (rad + rad2) * 0.5

  const scale = rad2 - rad

  const p = new THREE.Vector3().copy(radiusVector).multiplyScalar(rad).applyAxisAngle(axis, theta)
  spiralPoints.push(p)

  const c = new THREE.Vector3().copy(p).setLength(midRad)

  const segCurrent = i * profilePoints.length
  const segNext = (i + 1) * profilePoints.length

  for (const [idx, p] of profilePoints.entries()) {
    const pShell = new THREE.Vector3()
      .copy(p)
      .setX(p.x * scale)
      .setZ(p.z * scale * 0.6)
      .applyEuler(euler.set(0, 0, theta))
      .add(c)
    shellPoints.push(pShell)

    if (i < sResolution && idx < profilePoints.length - 1) {
      shellIndex.push(
        segCurrent + idx + 1,
        segCurrent + idx,
        segNext + idx,
        segCurrent + idx + 1,
        segNext + idx,
        segNext + idx + 1
      )
    }
  }
}

const spiralGeom = new THREE.BufferGeometry().setFromPoints(spiralPoints)
const spiralMat = new THREE.LineBasicMaterial({ color: "yellow" })
const spiral = new THREE.Line(spiralGeom, spiralMat)

// console.log([shellPoints.length, shellIndex.length])

// const shellGeom = new THREE.BufferGeometry().setFromPoints(shellPoints.splice(0, 200))
const shellGeom = new THREE.BufferGeometry().setFromPoints(shellPoints)
shellGeom.setIndex(shellIndex)
shellGeom.computeVertexNormals()
const shellMat = new THREE.MeshStandardMaterial({ color: "magenta", flatShading: true, side: THREE.DoubleSide })
const shell = new THREE.Mesh(shellGeom, shellMat)

//wireframe for awesomeness
const shellWireframe = new THREE.Mesh(shellGeom, new THREE.MeshBasicMaterial({ color: "pink", wireframe: true }))

export default defineComponent({
  props: {
    // position: { type: Array as PropType<PositionTuple>, default: () => [0, 0, 0] },
    position: { type: Array as PropType<PositionTuple>, default: () => [0, 0, 0] },
  },
  async setup({ position } , { slots }) {
    const scene = useScene()

    // scene.add(
    //   new THREE.Line(
    //     new THREE.BufferGeometry().setFromPoints(profilePoints),
    //     new THREE.LineBasicMaterial({ color: "red" })
    //   )
    // )

    // scene.add(spiral)
    shell.position.set(...position as [number, number, number])
    scene.add(shell)
    // scene.add(shellWireframe)

    return () => slots.default?.({})
  },
})
