import * as THREE from "three"

export default function ({ detail: { exec3D, loop3D } }: Canvas3DProps) {
  exec3D(({ scene }) => {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshPhongMaterial({ color: 0x669913, wireframe: true })
    )
    cube.position.setZ(-2)
    scene.add(cube)
  })

  loop3D(({ camera, deltaTime }) => {
    // camera.rotation.z += degInRad(100) * deltaTime
    camera.rotation.z += 100 * (Math.PI / 180) * deltaTime
  })
}
