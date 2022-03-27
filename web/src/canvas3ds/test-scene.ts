import * as THREE from "three"

export default function ({ detail: { exec3D, loop3D } }: Canvas3DProps) {
  // let boxid: number
  exec3D(({ scene, camera }) => {
    camera.position.set(3, 4, 2)
    camera.lookAt(0, 1, 0)
    scene.background = new THREE.Color(0xcc00ff)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(-0.5, 1, -1)
    directionalLight.castShadow = true
    const red = new THREE.MeshPhongMaterial({ color: 0xff0000 })
    const blue = new THREE.MeshPhongMaterial({ color: 0x0000ff, wireframe: false })
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), red)
    const box = new THREE.Mesh(new THREE.BoxGeometry(), blue)
    plane.receiveShadow = true
    box.castShadow = true
    plane.rotateX(-Math.PI / 2)
    box.position.setY(0.5)
    scene.add(directionalLight, directionalLight.target, plane, box)
    // boxid = box.id
    box.name = "boxocska"

    // for (let i = -10; i < 10; i++) {
    //   for (let j = -10; j < 10; j++) {
    //     const mesh = new THREE.Mesh(new THREE.BoxGeometry(), red)
    //     mesh.position.set(i, 0, j)
    //     mesh.castShadow = true
    //     mesh.receiveShadow = true
    //     scene.add(mesh)
    //   }
    // }
  })

  loop3D(({ scene, deltaTime }) => {
    scene.getObjectByName("boxocska").rotation.y += 50 * (Math.PI / 180) * deltaTime
  })
}
