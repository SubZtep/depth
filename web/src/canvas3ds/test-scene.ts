import * as THREE from "three"

export default function ({ detail: { exec3D, loop3D } }: Canvas3DProps) {
  exec3D(({ scene, camera }) => {
    camera.position.set(3, 4, 2)
    camera.lookAt(0, 0, 0)

    scene.background = new THREE.Color(0xff00ff)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(-0.5, 1, -1)
    directionalLight.castShadow = true
    //
    const red = new THREE.MeshPhongMaterial({ color: 0xff0000 })
    const blue = new THREE.MeshPhongMaterial({ color: 0x0000ff, wireframe: false })
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), red)
    const box = new THREE.Mesh(new THREE.BoxGeometry(), blue)

    plane.receiveShadow = true
    // box.receiveShadow = true
    box.castShadow = true

    plane.rotateX(-Math.PI / 2)
    // plane.position.setZ(-2)
    box.position.setY(0.5)

    // const box = new THREE.BoxGeometry()
    // box.translate(0, -1, 0)

    // scene.add(box)
    // scene.add(directionalLight, directionalLight.target, plane)
    scene.add(directionalLight, directionalLight.target, plane, box)
  })
}
