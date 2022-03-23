import * as THREE from "three"

export default function ({ detail: { exec3D, loop3D } }: Canvas3DProps) {
  exec3D(({ scene }) => {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshPhongMaterial({
        color: 0x669913,
        wireframe: false,
        opacity: 0.4,
        transparent: true,
        side: THREE.DoubleSide,
      })
      // new THREE.MeshToonMaterial({ color: 0x669913, opacity: 0.9,  })
    )

    const mat = new THREE.MeshToonMaterial({ color: 0x669913, opacity: 0.9 })
    // scene.overrideMaterial = mat

    cube.position.setZ(-1)
    scene.add(
      cube,
      new THREE.PointLight(0xffffff, 0.8, 0).translateZ(-30),
      new THREE.PointLight(0xffffff, 0.8, 0).translateZ(30)
      // new THREE.Mesh(new THREE.DodecahedronGeometry(), mat)
    )
  })

  loop3D(({ scene, camera, deltaTime }) => {
    // console.log(scene.children[0])
    scene.children[0].rotation.y += 100 * (Math.PI / 180) * deltaTime
    scene.children[0].rotation.z += 100 * (Math.PI / 180) * deltaTime
    // camera
  })
}
