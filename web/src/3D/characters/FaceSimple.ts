import type { FaceMeshResults } from "@depth/mediapipe"
import { exec3D, camera } from "@depth/three.js"
import type { Ref } from "vue"
import useObjectPool from "~/composables/useObjectPool"
import { whenever } from "@vueuse/core"
import useObjectFactory from "~/composables/useObjectFactory"
// import { Quaternion } from "three/src/math/Quaternion"
import { Group } from "three/src/objects/Group"
import { BoxGeometry } from "three/src/geometries/BoxGeometry"
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial"
import { Mesh } from "three/src/objects/Mesh"
import { Vector3 } from "three/src/math/Vector3"
import { Shape } from "three/src/extras/core/Shape"
import { CubicBezierCurve3 } from "three/src/extras/curves/CubicBezierCurve3"
import { BufferGeometry } from "three/src/core/BufferGeometry"
import { LineBasicMaterial } from "three/src/materials/LineBasicMaterial"
import { Line } from "three/src/objects/Line"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"
import { DoubleSide } from "three/src/constants"
import { Quaternion } from "three/src/math/Quaternion"
import { ConeGeometry } from "three/src/geometries/ConeGeometry"

// const vh1 = new Vector3()
// const vh2 = new Vector3()
// const vv1 = new Vector3()
// const vv2 = new Vector3()

export default defineComponent({
  props: {
    landmarks: { type: Object as PropType<FaceMeshResults["multiFaceLandmarks"]>, required: false },
    cssVarsTarget: { type: Object as PropType<HTMLElement>, required: false },
    // vh1: { type: Object as PropType<Vector3>, required: true },
  },

  setup(props) {
    const factory = useObjectFactory()
    const lineHorizontal = factory.line()
    const lineVertical = factory.line()

    // const vh1 = toRef(props, "vh1")
    // eslint-disable-next-line vue/no-setup-props-destructure
    // const vh1 = props.vh1

    const cube = factory.cube()
    // const gc = new ConeGeometry(0.2, 5, 4)
    // const mc = new MeshPhongMaterial({ color: 0xaaaa00 })
    // const cube = new Mesh(gc, mc)

    const root = new Group()
    exec3D(({ scene }) => scene.add(root, lineHorizontal, lineVertical, cube))

    const geometry = new BoxGeometry(0.08, 0.08, 0.08)
    const material = new MeshBasicMaterial({ color: 0xcccc22 })
    const pool = useObjectPool({ modelType: "face", creator: () => new Mesh(geometry, material), size: 468 })

    let csss: Ref<string>[] = []
    const stop = whenever(
      () => props.cssVarsTarget,
      target => {
        for (let i = 0; i < 468; i++) {
          csss[i] = useCssVar(`--el-pos-${i}`, target)
        }
        stop()
      },
      { immediate: true }
    )

    // const rotateVectorsSimultaneously = (u0: Vector3, v0: Vector3, u2: Vector3, v2: Vector3) => {
    //   const q2 = new Quaternion().setFromUnitVectors(u0, u2)

    //   const v1 = v2.clone().applyQuaternion(q2.clone().conjugate())

    //   const v0_proj = v0.projectOnPlane(u0)
    //   const v1_proj = v1.projectOnPlane(u0)

    //   let angleInPlane = v0_proj.angleTo(v1_proj)
    //   if (v1_proj.dot(new Vector3().crossVectors(u0, v0)) < 0) {
    //     angleInPlane *= -1
    //   }
    //   const q1 = new Quaternion().setFromAxisAngle(u0, angleInPlane)

    //   const q = new Quaternion().multiplyQuaternions(q2, q1)
    //   return q
    // }

    const rotateVectorsSimultaneously = (u0: Vector3, v0: Vector3, u2: Vector3, v2: Vector3) => {
      const q2 = new Quaternion().setFromUnitVectors(u0, u2)

      const v1 = v2.clone().applyQuaternion(q2.clone().conjugate())

      const v0_proj = v0.projectOnPlane(u0)
      const v1_proj = v1.projectOnPlane(u0)

      // let angleInPlane = v0_proj.angleTo(v1_proj)
      // if (v1_proj.dot(new Vector3().crossVectors(u0, v0)) < 0) {
      //   angleInPlane *= -1
      // }
      // const q1 = new Quaternion().setFromAxisAngle(v0_proj, v1_proj)
      const q1 = new Quaternion().setFromUnitVectors(v0_proj, v1_proj)

      const q = new Quaternion().multiplyQuaternions(q2, q1)
      return q
    }

    const tempPos = new Vector3()
    let x: number, y: number
    watch(
      () => props.landmarks,
      (landmarks: FaceMeshResults["multiFaceLandmarks"]) => {
        if (!landmarks || landmarks.length === 0) return

        for (const [index, landmark] of Object.entries(landmarks[0])) {
          const obj3d = pool.getByIndex(+index)
          obj3d.position.set(landmark.x * 10 - 5, landmark.y * -10 + 11, landmark.z * -10)

          if (props.cssVarsTarget) {
            obj3d.updateWorldMatrix(true, false)
            obj3d.getWorldPosition(tempPos)
            tempPos.project(camera)
            // canvas is full without scrollbars, so windows size is just as good
            x = (tempPos.x * 0.5 + 0.5) * window.innerWidth
            y = (tempPos.y * -0.5 + 0.5) * window.innerHeight
            csss[index].value = `translate(${x}px,${y}px)`
          }
        }

        const vh1 = pool.getByIndex(454).position
        const vh2 = pool.getByIndex(234).position
        const vv1 = pool.getByIndex(10).position
        const vv2 = pool.getByIndex(152).position

        lineHorizontal.geometry.setFromPoints([vh1, vh2])
        lineVertical.geometry.setFromPoints([vv1, vv2])

        // const q = rotateVectorsSimultaneously(vh1, vh2, vv1, vv2)
        // const q = rotateVectorsSimultaneously(vh1.normalize(), vh2.normalize(), vv1.normalize(), vv2.normalize())
        const q = rotateVectorsSimultaneously(vh1, vv1, vh2, vv2)
        cube.setRotationFromQuaternion(q.normalize())
        // cube.quaternion. copy(q)
        // cube.updateMatrix()

      }
    )

    onBeforeUnmount(() => {
      exec3D(({ scene }) => scene.remove(root))
      geometry.dispose()
      material.dispose()
    })
  },

  render() {
    return null
    // return { vh1, vh2, vv1, vv2 }
  },
})
