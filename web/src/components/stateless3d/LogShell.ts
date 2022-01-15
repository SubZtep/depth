import { degToRad, toVector, useScene } from "@depth/canvas"
import { getWorld } from "@depth/physics"
import { Collider, ColliderDesc, RigidBodyDesc } from "@dimforge/rapier3d-compat"
import { DoubleSide } from "three/src/constants"
import { BufferGeometry } from "three/src/core/BufferGeometry"
import { EllipseCurve } from "three/src/extras/curves/EllipseCurve"
import { LineBasicMaterial } from "three/src/materials/LineBasicMaterial"
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial"
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial"
import { Euler } from "three/src/math/Euler"
import { Line } from "three/src/objects/Line"
import { Mesh } from "three/src/objects/Mesh"

function map(val: number, r1start: number, r1end: number, r2start: number, r2end: number) {
  return r2start + (r2end - r2start) * ((val - r1start) / (r1end - r1start))
}

interface ShellArgs {
  aX?: number
  aY?: number
  xRadius?: number
  yRadius?: number
  startAngle?: number
  endAngle?: number
  clockwise?: boolean
  // rotation?: number
  turns?: number
}

function logarithmicShell(args: ShellArgs = {}) {
  const {
    aX = 0,
    aY = 0,
    xRadius = 0.5,
    yRadius = 0.5,
    startAngle = 0,
    endAngle = 2 * Math.PI,
    clockwise = false,
    // rotation = 0,
    turns = 3.14,
  } = args

  // profile
  const curve = new EllipseCurve(aX, aY, xRadius, yRadius, startAngle, endAngle, clockwise, /*rotation*/ 0)

  const profilePoints = curve.getPoints(12).map(p => new Vector3(...p.toArray(), 0))
  for (const p of profilePoints) {
    p.applyEuler(new Euler(degToRad(90), 0, 0))
  }

  // spiral
  const spiralPoints = [new Vector3()]
  const shellPoints: Vector3[] = []
  const shellIndex: number[] = []
  const sResolution = 150
  const sTurns = turns // 3.14
  const alpha = degToRad(80)
  const radiusVector = new Vector3(1, 0, 0)
  const axis = new Vector3(0, 0, 1)
  const euler = new Euler()

  for (let i = 0; i <= sResolution; i++) {
    const theta = map(i, 0, sResolution, 0, Math.PI * 2 * sTurns)
    const rad = Math.exp(theta / Math.tan(alpha)) // cos / sin = cotangent = 1 / tan
    const theta2 = theta + Math.PI * 2
    const rad2 = Math.exp(theta2 / Math.tan(alpha))
    const midRad = (rad + rad2) * 0.5
    const scale = rad2 - rad

    const p = new Vector3().copy(radiusVector).multiplyScalar(rad).applyAxisAngle(axis, theta)
    spiralPoints.push(p)

    const c = new Vector3().copy(p).setLength(midRad)

    const segCurrent = i * profilePoints.length
    const segNext = (i + 1) * profilePoints.length

    for (const [idx, p] of profilePoints.entries()) {
      const pShell = new Vector3()
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

  return {
    profilePoints,
    spiralPoints,
    shellPoints,
    shellIndex,
  }
}

// const world = getWorld()

let profilePoints: Vector3[] = []
let spiralPoints: Vector3[] = []
let shellPoints: Vector3[] = []
let shellIndex: number[] = []

const spiralGeometry = new BufferGeometry()
const profileGeometry = new BufferGeometry()
const shellGeometry = new BufferGeometry()

// const rigidBodyDesc = RigidBodyDesc.newStatic()
// const rigidBody = world.createRigidBody(rigidBodyDesc)
// let collider: Collider

// const sss = {
//   // position: props.position ?? [-5, 0, 10],
//   showShell: true,
//   showSpiral: true,
//   showWireframe: true,
//   a: [0, 0] as [number, number],
//   radius: [0.5, 0.5] as [number, number],
//   startAngle: 0,
//   endAngle: 2 * Math.PI,
//   clockwise: false,
//   // rotation: 0,
//   turns: 1, // 3.14,
// }

// // watchEffect(() => {
// //   const ls = logarithmicShell({
// //     aX: state.a[0],
// //     aY: state.a[1],
// //     xRadius: state.radius[0],
// //     yRadius: state.radius[1],
// //     startAngle: state.startAngle,
// //     endAngle: state.endAngle,
// //     clockwise: state.clockwise,
// //     rotation: state.rotation,
// //     turns: state.turns,
// //   })
// //   profilePoints = ls.profilePoints
// //   spiralPoints = ls.spiralPoints
// //   shellPoints = ls.shellPoints
// //   shellIndex = ls.shellIndex

// //   spiralGeometry.setFromPoints(spiralPoints)
// //   profileGeometry.setFromPoints(profilePoints)
// //   shellGeometry.setFromPoints(shellPoints).setIndex(shellIndex)
// //   shellGeometry.computeVertexNormals()

// //   // collider && world.removeCollider(collider, false)
// //   // const vertices = Float32Array.from(shellPoints.flatMap(v => v.toArray()))
// //   // const indices = Uint32Array.from(shellIndex)
// //   // const colliderDesc = ColliderDesc.trimesh(vertices, indices)
// //   // collider = world.createCollider(colliderDesc, rigidBody.handle)
// // })

// const spiral = new Line(spiralGeometry, new LineBasicMaterial({ color: "yellow" }))
// spiral.add(new Line(profileGeometry, new LineBasicMaterial({ color: "red" })))

// const shell = new Mesh(
//   shellGeometry,
//   new MeshStandardMaterial({ color: "sandybrown", flatShading: true, side: DoubleSide })
// )
// const wireframe = new Mesh(shellGeometry, new MeshBasicMaterial({ color: "green", wireframe: true }))

// shell.castShadow = true
// shell.receiveShadow = true

// const root = new Object3D()
// root.add(shell, spiral, wireframe)

// const scene = useScene()
// scene.add(root)

// watchEffect(() => {
//   root.position.set(...state.position)
//   rigidBody.setTranslation(toVector(state.position), true)

//   state.showShell ? root.add(shell) : root.remove(shell)
//   state.showSpiral ? root.add(spiral) : root.remove(spiral)
//   state.showWireframe ? root.add(wireframe) : root.remove(wireframe)
// })

export default defineComponent({
  props: {
    state: { type: Object as PropType<LogShellState>, required: true },
  },
  setup({ state }) {
    const scene = useScene()

    const spiral = new Line(spiralGeometry, new LineBasicMaterial({ color: "yellow" }))
    spiral.add(new Line(profileGeometry, new LineBasicMaterial({ color: "red" })))

    const shell = new Mesh(
      shellGeometry,
      new MeshStandardMaterial({ color: "sandybrown", flatShading: true, side: DoubleSide })
    )
    const wireframe = new Mesh(shellGeometry, new MeshBasicMaterial({ color: "green", wireframe: true }))

    shell.castShadow = true
    shell.receiveShadow = true

    const root = new Object3D()
    root.add(shell, spiral, wireframe)
    scene.add(root)

    watchEffect(() => {
      root.position.set(...state.position)

      const ls = logarithmicShell({
        aX: state.a[0],
        aY: state.a[1],
        xRadius: state.radius[0],
        yRadius: state.radius[1],
        startAngle: state.startAngle,
        endAngle: state.endAngle,
        clockwise: state.clockwise,
        // rotation: state.rotation,
        turns: state.turns,
      })
      profilePoints = ls.profilePoints
      spiralPoints = ls.spiralPoints
      shellPoints = ls.shellPoints
      shellIndex = ls.shellIndex

      spiralGeometry.setFromPoints(spiralPoints)
      profileGeometry.setFromPoints(profilePoints)
      shellGeometry.setFromPoints(shellPoints).setIndex(shellIndex)
      shellGeometry.computeVertexNormals()

      // collider && world.removeCollider(collider, false)
      // const vertices = Float32Array.from(shellPoints.flatMap(v => v.toArray()))
      // const indices = Uint32Array.from(shellIndex)
      // const colliderDesc = ColliderDesc.trimesh(vertices, indices)
      // collider = world.createCollider(colliderDesc, rigidBody.handle)
    })

    // watchEffect(() => {
    //   // console.log("LogShell.ts", state.turns)
    //   // root.position.set(...state.position)
    //   // rigidBody.setTranslation(toVector(state.position), true)

    //   // state.showShell ? root.add(shell) : root.remove(shell)
    //   // state.showSpiral ? root.add(spiral) : root.remove(spiral)
    //   // state.showWireframe ? root.add(wireframe) : root.remove(wireframe)
    // })

    onScopeDispose(() => {
      scene.remove(root)

      // TODO: displose `root` with a recursive helper
      shell.geometry.dispose()
      shell.material.dispose()
      spiral.geometry.dispose()
      spiral.material.dispose()
      wireframe.geometry.dispose()
      wireframe.material.dispose()
    })

    return () => null
  },
})
