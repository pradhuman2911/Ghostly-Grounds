import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()

/**
 * Fog
 */
const fog = new THREE.Fog('#262837',6,15)

scene.fog = fog

/**
 * Textures
 */
const textureLoader =new THREE.TextureLoader()

// Door Textures
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')

// Walls Textures
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')

// Grass Textures
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')

    // Grave Textures
const graveColorTexture = textureLoader.load('/textures/grave/color.jpg')
const graveNormalTexture = textureLoader.load('/textures/grave/normal.jpg')
const graveRoughnessTexture = textureLoader.load('/textures/grave/roughness.jpg')
const graveAmbientOcclusionTexture = textureLoader.load('/textures/grave/ambientOcclusion.jpg')
const graveHeightTexture = textureLoader.load('/textures/grave/height.jpg')


grassColorTexture.repeat.set(8,8)
grassAmbientOcclusionTexture.repeat.set(8,8)
grassNormalTexture.repeat.set(8,8)
grassRoughnessTexture.repeat.set(8,8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping

/**
 * House
 */
// Group
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map:bricksColorTexture,
        aoMap:bricksAmbientOcclusionTexture,
        normalMap:bricksNormalTexture,
        roughnessMap:bricksRoughnessTexture,
         
    })
)
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2)
)
walls.position.y = 2.5/2
walls.castShadow=true

house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({
        color:'#b35f45',
        
    })
)
roof.position.y = 2.5 + 1/2

roof.rotation.y = Math.PI *0.25
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2,2.2,100,100),
    new THREE.MeshStandardMaterial({
        map:doorColorTexture,
        transparent:true,
        alphaMap:doorAlphaTexture,
        aoMap:doorAmbientOcclusionTexture,
        displacementMap:doorHeightTexture,
        displacementScale:0.15,
        normalMap:doorNormalTexture,
        metalnessMap:doorMetalnessTexture,        
        roughnessMap:doorRoughnessTexture

    })
)
 
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2)
)

door.position.y= 1
door.position.z= 4/2 +0.01
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1,16,16)
const bushMaterial = new THREE.MeshStandardMaterial({color:'#89c854'})

const bush1 = new THREE.Mesh(bushGeometry,bushMaterial)
bush1.scale.set(0.5,0.5,0.5)
bush1.position.set(0.8,0.2,2.2)

const bush2 = new THREE.Mesh(bushGeometry,bushMaterial)
bush2.scale.set(0.25,0.25,0.25)
bush2.position.set(1.4,0.1,2.1)

const bush3 = new THREE.Mesh(bushGeometry,bushMaterial)
bush3.scale.set(0.4,0.4,0.4)
bush3.position.set(-0.8,0.1,2.2)

const bush4 = new THREE.Mesh(bushGeometry,bushMaterial)
bush4.scale.set(0.15,0.15,0.15)
bush4.position.set(-1,0.05,2.6)
bush1.castShadow=true
bush2.castShadow=true
bush3.castShadow=true
bush4.castShadow=true

house.add(bush1,bush2,bush3,bush4)

// Graves Group
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6,0.8,0.1)

const graveMaterial = new THREE.MeshStandardMaterial({
    displacementMap:graveHeightTexture,
    color:'#b2b6b1',
    map:graveColorTexture,
    aoMap:graveAmbientOcclusionTexture,
    normalMap:graveNormalTexture,
    roughnessMap:graveRoughnessTexture,
    displacementScale:0.00015,
    
})

for(let i=0;i<50;i++){
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 6
    const x = Math.cos(angle) *radius
    const z = Math.sin(angle) *radius

    const grave = new THREE.Mesh(graveGeometry,graveMaterial)

    grave.position.set(x,0.3,z)
    grave.rotation.y = (Math.random() -0.5) *0.4
    grave.rotation.z = (Math.random() -0.5) *0.4

    grave.castShadow=true
    graves.add(grave)

    grave.geometry.setAttribute(
        'uv2',
        new THREE.Float32BufferAttribute(grave.geometry.attributes.uv.array,2)
    )
}


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20),
    new THREE.MeshStandardMaterial({
        map:grassColorTexture,
        aoMap:grassAmbientOcclusionTexture,
        normalMap:grassNormalTexture,
        roughnessMap:grassNormalTexture
    })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2)
)
floor.position.y=0
floor.rotation.x= -(Math.PI * 0.5)
floor.receiveShadow=true

scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.2)
scene.add(ambientLight)
gui.add(ambientLight,'intensity').min(0).max(1).step(0.001).name('Ambient light')

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, -2)
moonLight.castShadow=true
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 7


scene.add(moonLight)
var btn  = 1 ;
const myObject = {
	Sound: function() { 
        
            if (btn == 1) {
                sound.play();
                btn = 0;
            }else{
                
                sound.stop()
                btn = 1
            }
        },
};

gui.add(moonLight,'intensity').min(0).max(1).step(0.001).name('Moon Light')
gui.add(moonLight.position,'x').min(-5).max(5).step(0.001).name('Moon Light X')
gui.add(moonLight.position,'y').min(-5).max(5).step(0.001).name('Moon Light Y')
gui.add(moonLight.position,'z').min(-5).max(5).step(0.001).name('Moon Light Z')



//Door light
const doorLight= new THREE.PointLight('#ff7d46',1,7)
doorLight.position.set(0, 2.2, 2.7)
doorLight.castShadow=true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far=15

gui.add(doorLight,'intensity').min(0).max(4).step(0.001).name('Door Light')

gui.add( myObject, 'Sound' );
house.add(doorLight)
// const pointLightHelper = new THREE.PointLightHelper(doorLight)
// house.add(pointLightHelper)

/**
 * ghost Lights
 */
const ghost1=new THREE.PointLight('#ff00ff',3,3)
const ghost2=new THREE.PointLight('#00ffff',3,3)
const ghost3=new THREE.PointLight('#ffff00',3,3)

ghost1.castShadow=true
ghost2.castShadow=true
ghost3.castShadow=true

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far=7
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far=7
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far=7

house.add(ghost1,ghost2,ghost3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

/**
 * Shadows
 */
renderer.shadowMap.enabled=true
renderer.shadowMap.type=THREE.PCFSoftShadowMap

// moonLight.castShadow=true
// doorLight.castShadow=true
// ghost1.castShadow=true
// ghost2.castShadow=true
// ghost3.castShadow=true

// walls.castShadow=true
// bush1.castShadow=true
// bush2.castShadow=true
// bush3.castShadow=true
// bush4.castShadow=true

// floor.receiveShadow=true

// moonLight.shadow.mapSize.width = 256
// moonLight.shadow.mapSize.height = 256
// moonLight.shadow.camera.far = 15
// doorLight.shadow.mapSize.width = 256
// doorLight.shadow.mapSize.height = 256
// doorLight.shadow.camera.far=7

// ghost1.shadow.mapSize.width = 256
// ghost1.shadow.mapSize.height = 256
// ghost1.shadow.camera.far=7
// ghost2.shadow.mapSize.width = 256
// ghost2.shadow.mapSize.height = 256
// ghost2.shadow.camera.far=7
// ghost3.shadow.mapSize.width = 256
// ghost3.shadow.mapSize.height = 256
// ghost3.shadow.camera.far=7

/**
 * particle
 */
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 800;
const positions = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 20 ;
    positions[i * 3 + 1] = Math.random() * 5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.015,
    color: '#00ffff',
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

//sounds 
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();

audioLoader.load('/sounds/spooky.mp3', (buffer) => {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
});


/**
 * Animate
 */
const timer = new Timer()
// const clock = new THREE.Clock()



const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()
// const elapsedTime2 = clock.getElapsedTime()
// console.log(elapsedTime)
// console.log(elapsedTime2)
    // Update Particles
for (let i = 0; i < particlesCount; i++) {
    const yBase = positions[i * 3 + 1]; // Initial height
    positions[i * 3 + 1] = yBase + Math.sin(elapsedTime + i) * 0.005; // Add oscillation
}
particlesGeometry.attributes.position.needsUpdate = true;
    // Update Ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.sin(ghost1Angle) *4
    ghost1.position.z = Math.cos(ghost1Angle) *4
    ghost1.position.y =Math.sin(elapsedTime *3)
    
    const ghost2Angle = -elapsedTime *0.32
    ghost2.position.x = Math.sin(ghost2Angle)*5
    ghost2.position.z = Math.cos(ghost2Angle)*5
    ghost2.position.y =Math.sin(elapsedTime*4)+Math.sin(elapsedTime*2.5)
     
    const ghost3Angle = -elapsedTime *0.18
    ghost3.position.x = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime*5) + Math.sin(elapsedTime * 2)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()