import * as THREE from "three"

const brown = new THREE.MeshPhongMaterial({ color: 0x3d2211 })
const blue = new THREE.MeshPhongMaterial({ color: 0x0000ff })
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(-0.5, 1, -1)
directionalLight.castShadow = true
const planeGeo = new THREE.PlaneGeometry(10, 10)
planeGeo.rotateX(-Math.PI / 2)
const plane = new THREE.Mesh(planeGeo, brown)
plane.receiveShadow = true
const box = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), blue)
box.castShadow = true
box.position.setY(0.5)
box.name = "boxocska"

async function loadSkybox(nr = 1, compressed = true): Promise<THREE.CubeTexture> {
  return new Promise((resolve, reject) => {
    if (nr < 1 || nr > 15) {
      return reject("a valid skybox number is between 1 and 15")
    }
    const loader = new THREE.CubeTextureLoader()
    const onError = (err: ErrorEvent) => reject(err)
    const onLoad = (texture: THREE.CubeTexture) => resolve(texture)
    const path = `/textures/skybox/${String(nr).padStart(2, "0")}/`
    const urls = ["RT", "LF", "UP", "DN", "BK", "FR"].map((side) => `sky${nr}_${side}.${compressed ? "webp" : "jpg"}`)
    loader.setPath(path).load(urls, onLoad, undefined, onError)
  })
}

export default function ({ detail: { exec3D, loop3D } }: Canvas3DProps) {
  exec3D(({ scene, camera }) => {
    scene.background = new THREE.Color(0x396a85)
    camera.position.set(3, 3, 2)
    camera.lookAt(0, 1, 0)
    scene.add(directionalLight, directionalLight.target, plane, box)
    // loadSkybox(15).then((texture) => {
    //   scene.background = texture
    // })
  })

  loop3D(({ scene, deltaTime }) => {
    const box = scene.getObjectByName("boxocska")
    if (box) {
      box.rotation.y += 50 * (Math.PI / 180) * deltaTime
    }
  })
}
