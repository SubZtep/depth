import * as THREE from "three"

export default function ({ detail: { exec3D, loop3D } }: Canvas3DProps) {
  exec3D(({ scene }) => {
    scene.background = new THREE.Color(0x669966)
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshPhongMaterial({
        color: 0x669913,
        wireframe: false,
        opacity: 0.4,
        transparent: true,
        specular: 0xffff00,
        side: THREE.DoubleSide,
        // side: 2, //THREE.DoubleSide,
      })
    )
    cube.position.setZ(-1)
    scene.add(
      cube,
      new THREE.PointLight(0xffffff, 0.8, 0).translateZ(-30),
      new THREE.PointLight(0xffffff, 0.8, 0).translateZ(30)
    )
  })

  loop3D(({ scene, deltaTime }) => {
    scene.children[0].rotation.y += 10 * (Math.PI / 180) * deltaTime
    scene.children[0].rotation.z += 20 * (Math.PI / 180) * deltaTime
  })
}
