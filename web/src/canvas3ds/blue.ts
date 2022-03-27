import * as THREE from "three"

export default function ({ detail: { exec3D, loop3D } }: Canvas3DProps) {
  exec3D(({ scene }) => {
    scene.background = new THREE.Color(0x0000ff)
  })
}
