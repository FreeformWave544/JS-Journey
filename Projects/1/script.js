import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'
import { HDRLoader, TextGeometry } from 'three/addons/Addons.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { time } from 'three/tsl'



const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()
const fontLoader = new FontLoader()



const matcapTexture = textureLoader.load('./textures/matcaps/5.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

const donutMatcapTexture = textureLoader.load('./textures/matcaps/8.png')
donutMatcapTexture.colorSpace = THREE.SRGBColorSpace

const logoTexture = textureLoader.load('./Logo.png')
logoTexture.colorSpace = THREE.SRGBColorSpace

const gradientTexture = textureLoader.load('./textures/gradients/5.png')

const gui = new GUI({
    width: 150,
    title: 'Debug UI',
    closeFolders: false
})

gui.hide()

const cubeTweaks = gui.addFolder('Cube').close()

const materialGroup = gui.addFolder('Materials').close()

const debugObject = {}

debugObject.color = '#00ffff'

window.addEventListener('keypress', (e) =>
{
    if (e.key == 'h')
    {
        gui.show(gui._hidden)
    }
})



const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})



const scrollIndicator = document.querySelector('#scroll-indicator')

window.addEventListener('scroll', () =>
{
    if (window.scrollY > 200)
    {
        gsap.to(scrollIndicator, {
            opacity: 0,
            duration: 0.3,
            overwrite: true
        })
    }
    else
    {
        gsap.to(scrollIndicator, {
            opacity: 1,
            duration: 0.3,
            overwrite: true
        })
    }
})



const clubLink = document.querySelector('#club-link')

clubLink.addEventListener('mouseenter', () =>
{
    gsap.to(clubLink, {
        letterSpacing: '0.04em',
        duration: 0.3,
        ease: 'power2.out'
    })
})

clubLink.addEventListener('mouseleave', () =>
{
    gsap.to(clubLink, {
        letterSpacing: '0em',
        duration: 0.3,
        ease: 'power2.out'
    })
})



const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1)

const geometrySettings = {
    count: 50,
    positionsArray: []
}

geometrySettings.positionsArray = new Float32Array(
    geometrySettings.count * 3 * 3
)

for (let i = 0; i < geometrySettings.count * 3 * 3; i++)
{
    geometrySettings.positionsArray[i] =
        (Math.random() - 0.5) * 500
}

let positionsAttribute = new THREE.BufferAttribute(
    geometrySettings.positionsArray,
    3
)

const material = new THREE.MeshPhongMaterial({
    map: logoTexture,
    shininess: 100,
    specular: new THREE.Color('#f9faa8'),
    side: THREE.DoubleSide
})

gui.add(material, 'shininess', 0, 100, 0.1)

gui.addColor(material, 'specular')



const mesh = new THREE.Mesh(
    geometry,
    material
)

mesh.position.y = 1.5

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)

sphere.position.x = -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.0, 1.0, 100, 100),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
)

torus.position.x = 1.5

scene.add(
    sphere,
    plane,
    torus,
    mesh
)



fontLoader.load(
    './fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'Rutlish Terminal',
            {
                font,
                size: 0.5,
                depth: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )

        textGeometry.computeBoundingBox()
        textGeometry.center()
        textGeometry.translate(0, 0, 1.0)

        const textMaterial = new THREE.MeshMatcapMaterial({
            color: '#ec3750',
            matcap: matcapTexture
        })

        const text = new THREE.Mesh(
            textGeometry,
            textMaterial
        )

        scene.add(text)

        const donutMesh = new THREE.TorusGeometry(
            0.3,
            0.2,
            20,
            45
        )

        const cubeMesh = new THREE.BoxGeometry(
            1,
            1,
            1,
            1,
            1
        )

        const donutMaterial = new THREE.MeshMatcapMaterial({
            matcap: donutMatcapTexture
        })



        for (let i = 0; i < 500; i++)
        {
            const donut = new THREE.Mesh(
                donutMesh,
                donutMaterial
            )

            donut.position.set(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50
            )

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()

            donut.scale.set(
                scale,
                scale,
                scale
            )

            scene.add(donut)


            const cube = new THREE.Mesh(
                cubeMesh,
                donutMaterial
            )

            cube.position.set(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 50
            )

            cube.rotation.x = Math.random() * Math.PI
            cube.rotation.y = Math.random() * Math.PI

            const cubeScale = Math.random()

            cube.scale.set(
                cubeScale,
                cubeScale,
                cubeScale
            )

            scene.add(cube)
        }



        for (let i = 0; i < 50; i++)
        {
            const donut = new THREE.Mesh(
                donutMesh,
                donutMaterial
            )

            donut.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            )

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()

            donut.scale.set(
                scale,
                scale,
                scale
            )

            scene.add(donut)
        }
    }
)



cubeTweaks.add(mesh, 'visible')
cubeTweaks.add(material, 'wireframe')

cubeTweaks.addColor(
    debugObject,
    'color'
).onChange(() =>
{
    material.color.set(debugObject.color)
})

debugObject.spin = () =>
{
    gsap.to(mesh.rotation, {
        duration: 1,
        y: mesh.rotation.y + Math.PI * 2
    })
}

cubeTweaks.add(debugObject, 'spin')

debugObject.subdivision = 2

cubeTweaks.add(
    debugObject,
    'subdivision',
    1,
    20,
    1
).onFinishChange((value) =>
{
    mesh.geometry.dispose()

    mesh.geometry = new THREE.BoxGeometry(
        1,
        1,
        1,
        debugObject.subdivision,
        debugObject.subdivision,
        debugObject.subdivision
    )
})



window.addEventListener('keypress', (e) =>
{
    if (
        e.key != 'e' ||
        geometry.type != 'BufferGeometry'
    )
    {
        return
    }

    for (
        let i = 0;
        i < geometrySettings.count * 3 * 3;
        i++
    )
    {
        geometrySettings.positionsArray[i] =
            (Math.random() - 0.5) * 500
    }

    positionsAttribute = new THREE.BufferAttribute(
        geometrySettings.positionsArray,
        3
    )

    geometry.setAttribute(
        'position',
        positionsAttribute
    )
})



const sizes = {
    width: innerWidth,
    height: innerHeight
}



const camera = new THREE.PerspectiveCamera(
    60,
    sizes.width / sizes.height,
    0.001
)

camera.position.z = 5

scene.add(camera)



const controls = new OrbitControls(
    camera,
    canvas
)

controls.mouseButtons.LEFT = null
controls.enableDamping = true
controls.enablePan = false
controls.minDistance = 3.2
controls.maxDistance = 50

gui.add(
    controls,
    'maxDistance',
    1,
    50,
    0.5
)



const hdrLoader = new HDRLoader()

hdrLoader.load(
    './textures/environmentMap/2k.hdr',
    (environmentMap) =>
    {
        environmentMap.mapping =
            THREE.EquirectangularReflectionMapping

        scene.background = environmentMap
        scene.environment = environmentMap
    }
)



window.addEventListener('resize', () =>
{
    sizes.width = innerWidth
    sizes.height = innerHeight

    camera.aspect =
        sizes.width / sizes.height

    camera.updateProjectionMatrix()

    renderer.setSize(
        sizes.width,
        sizes.height
    )

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    )
})



window.addEventListener('keypress', (e) =>
{
    if (e.key != 'f')
    {
        return
    }

    const fullscreenElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement

    if (!fullscreenElement)
    {
        if (canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if (canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if (document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if (canvas.webkitExitFullscreen)
        {
            canvas.webkitExitFullscreen()
        }
    }
})



const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})

renderer.setSize(
    sizes.width,
    sizes.height
)

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
)



let scrollY = window.scrollY

const wheelListener = (event) => {
        scrollY = window.scrollY
        const distance = controls.getDistance()
        if (distance >= controls.maxDistance || distance <= controls.minDistance) { controls.enableZoom = false
            document.getElementById('What').classList.remove("hidden")
            document.getElementById('Why').classList.remove("hidden")
            document.getElementById('Club').classList.remove("hidden")
            const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
            for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                document.getElementById('overlay').style.backgroundColor = `rgba(${i}, ${40 - i}, 0, ${0.2 + (i / 400)})`;
                document.getElementById('overlay').style.width = `${100 - (i / 1.2)}%`;
            }, i * 15);
            }
            window.removeEventListener('wheel', wheelListener)
        }
    }
window.addEventListener('wheel', wheelListener, { passive: false })



const clock = new THREE.Timer()

let parallaxSpeed = 1.0
const tick = (timestamp) =>
{
    clock.update(timestamp)

    const delta = clock.getDelta()
    const elapsed = clock.getElapsed()



    sphere.rotation.y = 0.1 * elapsed
    plane.rotation.y = 0.1 * elapsed
    torus.rotation.y = 0.1 * elapsed
    mesh.rotation.y = 0.1 * elapsed

    sphere.rotation.x = -0.15 * elapsed
    plane.rotation.x = -0.15 * elapsed
    torus.rotation.x = -0.15 * elapsed
    mesh.rotation.x = -0.15 * elapsed



    const parallaxX = cursor.x * 0.5
    const parallaxY = cursor.y * 0.5

    camera.position.x += (parallaxX - camera.position.x) * 5 * delta * parallaxSpeed

    camera.position.y += (-parallaxY - camera.position.y) * 5 * delta * parallaxSpeed


    controls.update()



    renderer.render(
        scene,
        camera
    )

    window.requestAnimationFrame(tick)
}

tick()

document.getElementById('What').classList.add("hidden")
document.getElementById('Why').classList.add("hidden")
document.getElementById('Club').classList.add("hidden")

parallaxSpeed = 0.1
camera.position.y = -5000
camera.position.z = 700
camera.position.x = 700 * ((Math.random() - 0.5) * 2)

const timer = setInterval(() => {
    if (parallaxSpeed < 1.0) {
        parallaxSpeed += 0.1;
    } else {
        parallaxSpeed = 1.0
        clearInterval(timer)
    }
    
}, 150);

document.querySelectorAll(".link").forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    document.body.classList.add("fade-out");

    setTimeout(() => {
      window.location.href = this.href;
    }, 300);
  });
});
