import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import gsap from 'gsap'


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
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 'red' })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const sizes = {
    width: 800,
    height: 600
}

const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true



const renderer = new THREE.WebGLRenderer({
        canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)




// gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })
// gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 })

const clock = new THREE.Timer()
const tick = (timestamp) => {
    clock.update(timestamp)
    const delta = clock.getDelta()
    const elapsed = clock.getElapsed()
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
