import * as THREE from "three";
const num = 50;
/** min and max included */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function createCube(i) {
    const width = i * 10;
    const segments = num - i;
    const opacity = 1 - i / num;
    const geometry = new THREE.BoxGeometry(width, width, width, segments, segments, segments);
    const material = new THREE.MeshPhongMaterial({ color: 0x669913, transparent: true, wireframe: true, opacity });
    const cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    const light = new THREE.PointLight(0x69ff69, 1);
    light.power = 20;
    light.decay = 2;
    light.distance = Number.POSITIVE_INFINITY;
    cube.position.set(randomInt(-100, 100), randomInt(-100, 100), randomInt(-100, 100));
    cube.add(light);
    return cube;
}
function rotateObject(cube, time, speed = 0.05) {
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
}
export const state = {
    width: 300,
    height: 150, // canvas default
};
export function init(data) {
    const { canvas } = data;
    // const renderer = new THREE.WebGLRenderer({ canvas })
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: "high-performance",
        logarithmicDepthBuffer: true,
    });
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    state.width = canvas.width;
    state.height = canvas.height;
    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 690;
    const scene = new THREE.Scene();
    const light = new THREE.DirectionalLight(0xff0000, 0.2);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    const cubes = Array.from({ length: num }, (_, i) => createCube(i));
    scene.add(light, light.target, ...cubes);
    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = state.width;
        const height = state.height;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }
    function render(time) {
        time *= 0.001;
        if (resizeRendererToDisplaySize(renderer)) {
            camera.aspect = state.width / state.height;
            camera.updateProjectionMatrix();
        }
        for (const [index, cube] of cubes.entries())
            rotateObject(cube, time, (cubes.length - index) * 0.1);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
