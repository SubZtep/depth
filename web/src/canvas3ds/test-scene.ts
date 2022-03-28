import * as THREE from "three"

async function loadSkybox(nr = 1, compressed = true): Promise<THREE.CubeTexture> {
  return new Promise((resolve, reject) => {
    if (nr < 1 || nr > 15) {
      return reject("a valid skybox number is between 1 and 15")
    }
    const loader = new THREE.CubeTextureLoader()
    const onError = (err: ErrorEvent) => reject(err)
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const onProgress = (ev: ProgressEvent) => console.log("Propress", ev)
    const onLoad = (texture: THREE.CubeTexture) => resolve(texture)
    const path = `/textures/skybox/${String(nr).padStart(2, "0")}/`
    const urls = ["RT", "LF", "UP", "DN", "BK", "FR"].map((side) => `sky${nr}_${side}.${compressed ? "webp" : "jpg"}`)
    loader.setPath(path).load(urls, onLoad, onProgress, onError)
  })
}

export default function ({ detail: { exec3D, loop3D } }: Canvas3DProps) {
  exec3D(({ scene, camera }) => {
    camera.position.set(3, 3, 2)
    camera.lookAt(0, 1, 0)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(-0.5, 1, -1)
    directionalLight.castShadow = true
    const red = new THREE.MeshPhongMaterial({ color: 0xff0000 })
    const blue = new THREE.MeshPhongMaterial({ color: 0x0000ff, wireframe: false })
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), red)
    plane.receiveShadow = true
    plane.rotateX(-Math.PI / 2)
    const box = new THREE.Mesh(new THREE.BoxGeometry(), blue)
    box.castShadow = true
    box.position.setY(0.5)
    scene.add(directionalLight, directionalLight.target, plane, box)
    box.name = "boxocska"

    loadSkybox().then((sky) => {
      scene.background = sky
    })
  })

  loop3D(({ scene, deltaTime }) => {
    const box = scene.getObjectByName("boxocska")
    if (box) {
      box.rotation.y += 50 * (Math.PI / 180) * deltaTime
    }
  })
}
