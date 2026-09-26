import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import GUI from 'lil-gui'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const gui = new GUI()
const textureLoader = new THREE.TextureLoader()
gui.hide()
const parameters = {
    materialColor: '#00aeff',
    particleColor: '#00aeff'
}

const gradientTexture = textureLoader.load('./textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
})

const objectsDistance = 4

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh1.position.set(2, 0, 0)
mesh2.position.set(-2, -objectsDistance, 0)
mesh3.position.set(2, -objectsDistance * 2, 0)

const sectionMeshes = [mesh1, mesh2, mesh3]

scene.add(mesh1, mesh2, mesh3)

gui.addColor(parameters, 'materialColor').onChange(() => {
    material.color.set(parameters.materialColor)
    particlesMaterial.color.set(parameters.particleColor)
})

const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.particleColor,
    sizeAttenuation: true,
    size: 0.03
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

const sizes = {
    width: innerWidth,
    height: innerHeight
}

const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(
    35,
    sizes.width / sizes.height,
    0.1,
    100
)

camera.position.z = 6
cameraGroup.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

window.addEventListener('resize', () => {
    sizes.width = innerWidth
    sizes.height = innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
})

let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
    scrollY = window.scrollY

    const newSection = Math.min(
        Math.max(Math.round(scrollY / sizes.height), 0),
        sectionMeshes.length - 1
    )

    if (newSection != currentSection) {
        currentSection = newSection

        gsap.to(sectionMeshes[currentSection].rotation, {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+=6',
            y: '+=3',
            z: '+=1.5'
        })
    }
})

const cursor = { x: 0, y: 0 }

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

const scrollIndicator = document.querySelector('.section p i')

if (scrollIndicator) {
    gsap.to(scrollIndicator, {
        y: -7,
        duration: 0.8,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
    })
}

const homeLink = document.querySelector('#home-link')

homeLink.addEventListener('mouseenter', () => {
    gsap.to(homeLink, {
        letterSpacing: '0.04em',
        duration: 0.3
    })
})

homeLink.addEventListener('mouseleave', () => {
    gsap.to(homeLink, {
        letterSpacing: '0em',
        duration: 0.3
    })
})

const clock = new THREE.Timer()

const tick = (timestamp) => {
    clock.update(timestamp)

    const delta = clock.getDelta()

    camera.position.y = -scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = -cursor.y * 0.5

    cameraGroup.position.x +=
        (parallaxX - cameraGroup.position.x) * 5 * delta

    cameraGroup.position.y +=
        (parallaxY - cameraGroup.position.y) * 5 * delta

    for (const mesh of sectionMeshes) {
        mesh.rotation.x += delta * 0.1
        mesh.rotation.y += delta * 0.12
    }

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()