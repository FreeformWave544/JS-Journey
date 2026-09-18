import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'
import { debug, metalness, roughness } from 'three/tsl'


const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/Logo.png')
const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAmbientOccTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('./textures/matcaps/1.png')
const gradientTexture = textureLoader.load('./textures/gradients/5.png')
doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace
texture.colorSpace = THREE.SRGBColorSpace
// texture.minFilter = THREE.NearestFilter

const gui = new GUI({
    width: 150,
    title: 'Debug UI',
    closeFolders: false
})
gui.close()
const cubeTweaks = gui.addFolder("Cube").close()
const debugObject = {}

window.addEventListener('keypress', (e) => { if (e.key == 'h') {gui.show(gui._hidden)} })

const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()
const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1)
// const geometry = new THREE.BufferGeometry()
const geometrySettings = {
    count: 50,
    positionsArray: []
}
geometrySettings.positionsArray = new Float32Array(geometrySettings.count * 3 * 3)
for (let i = 0; i < geometrySettings.count * 3 * 3; i++) {
    geometrySettings.positionsArray[i] = (Math.random() - 0.5) * 500
}

let positionsAttribute = new THREE.BufferAttribute(geometrySettings.positionsArray, 3)

// geometry.setAttribute('position', positionsAttribute)

debugObject.color = '#00ffff'
// const material = new THREE.MeshPhongMaterial({ 
//     // map: texture, 
//     shininess: 100,
//     specular: new THREE.Color('#f9faa8'),
//     map: doorColorTexture, alphaMap: doorAlphaTexture, 
//     side: THREE.DoubleSide})

// const material = new THREE.MeshToonMaterial()
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.45
material.roughness = 0.65

const materialGroup = gui.addFolder('Materials')
gui.add(material, 'metalness', 0, 1, 0.0001)
gui.add(material, 'roughness', 0, 1, 0.0001)

const mesh = new THREE.Mesh(geometry, material)
mesh.position.y = 1.5
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material)
sphere.position.x = - 1.5
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), material)
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 16, 32), material)
torus.position.x = 1.5
scene.add(sphere, plane, torus, mesh)

const ambientLight = new THREE.AmbientLight('#ffffff', 1)
scene.add(ambientLight)
const pointLight = new THREE.PointLight('#ffffff', 30)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

window.addEventListener('keypress', (e) => { if (e.key == "e" && geometry.type == "BufferGeometry") {
    for (let i = 0; i < geometrySettings.count * 3 * 3; i++) {
        geometrySettings.positionsArray[i] = (Math.random() - 0.5) * 500
    }

    positionsAttribute = new THREE.BufferAttribute(geometrySettings.positionsArray, 3)

    geometry.setAttribute('position', positionsAttribute)
} })

cubeTweaks.add(mesh, 'visible')
cubeTweaks.add(material, 'wireframe')

cubeTweaks.addColor(debugObject, 'color').onChange((value) => { material.color.set(debugObject.color) })

debugObject.spin = () => { gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 }) }
cubeTweaks.add(debugObject, 'spin')

debugObject.subdivision = 2
cubeTweaks.add(debugObject, 'subdivision', 1, 20, 1).onFinishChange((value) => { mesh.geometry.dispose() ; mesh.geometry = new THREE.BoxGeometry(1, 1, 1, debugObject.subdivision, debugObject.subdivision, debugObject.subdivision) })

if (geometry.type == "BufferGeometry") {gui.add(geometrySettings, 'count', 1, geometrySettings.count, 1)}


const sizes = {
    width: innerWidth,
    height: innerHeight
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

window.addEventListener('resize', () => { 
    sizes.width = innerWidth; sizes.height = innerHeight;
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
 })

window.addEventListener('keypress', (e) => {
    if (e.key != "f") {return}
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if (!fullscreenElement) { if (canvas.requestFullscreen) {canvas.requestFullscreen()} else if (canvas.webkitRequestFullscreen) {canvas.webkitRequestFullscreen} }
    else { if (document.exitFullscreen) { document.exitFullscreen() } else if (canvas.webkitExitFullscreen) { document.webkitExitFullscreen() } }
})


const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.001)
camera.position.z = 3
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.maxDistance = 3
controls.minDistance = 1

const renderer = new THREE.WebGLRenderer({
        canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera)




// gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })
// gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 })

const clock = new THREE.Timer()
const tick = (timestamp) => {
    clock.update(timestamp)
    const delta = clock.getDelta()
    const elapsed = clock.getElapsed()

    sphere.rotation.y = 0.1 * elapsed
    plane.rotation.y = 0.1 * elapsed
    torus.rotation.y = 0.1 * elapsed
    mesh.rotation.y = 0.1 * elapsed
    mesh.rotation.x = -0.15 * elapsed
    sphere.rotation.x = -0.15 * elapsed
    plane.rotation.x = -0.15 * elapsed
    torus.rotation.x = -0.15 * elapsed


    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 4
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 4
    // camera.position.y = -cursor.y * 3
    // camera.lookAt(mesh.position)
    // mesh.position.y = Math.sin(elapsed)
    // mesh.position.x = Math.cos(elapsed)
    window.requestAnimationFrame(tick)
    // mesh.rotation.x += Math.sin(elapsed) * delta * 2
    // mesh.rotation.y += Math.cos(elapsed) * delta * 2
    // mesh.rotation.z += delta * 2
    controls.update()
    renderer.render(scene, camera)
}

tick()
