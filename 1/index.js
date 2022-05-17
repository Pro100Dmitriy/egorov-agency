import * as THREE from 'three'
import { GLTFLoader } from 'GLTFLoader'
import { OrbitControls } from 'OrbitControls'

const scene = new THREE.Scene()

// Сubemap
const path = 'assets/cubemap/'
const format = '.jpg'
const urls = [
    path + 'posx' + format, path + 'negx' + format,
    path + 'posy' + format, path + 'negy' + format,
    path + 'posz' + format, path + 'negz' + format
];

const reflectionCube = new THREE.CubeTextureLoader().load( urls );
const refractionCube = new THREE.CubeTextureLoader().load( urls );
refractionCube.mapping = THREE.CubeRefractionMapping;

scene.background = reflectionCube;


// Lights
const lightTop = new THREE.SpotLight()
lightTop.intensity = 3
lightTop.position.set( 5,5,5 )
scene.add( lightTop )

const lightBottom = new THREE.SpotLight()
lightBottom.intensity = 1
lightBottom.position.set( -5,-5,-5 )
scene.add( lightBottom )


// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50000)
camera.position.z = 5


// Renderer
const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.domElement.setAttribute('id', 'object')
document.body.appendChild(renderer.domElement)


// Controls
const controls = new OrbitControls( camera, renderer.domElement )
camera.lookAt( 0.5, 0.5, 0.5 )
controls.target.set( 0, 0, 0 )
controls.maxDistance = 6
controls.minDistance = 3
controls.update()


// Three deferent meshes
const allSceneMeshes = []

const boxGeometry = new THREE.BoxGeometry()
const basicMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} )
const boxMesh = new THREE.Mesh( boxGeometry, basicMaterial )
boxMesh.position.set( 2, 2, 2 )
scene.add( boxMesh )
allSceneMeshes.push( boxMesh )

const sphereGeometry = new THREE.SphereGeometry()
const phongMaterial = new THREE.MeshPhongMaterial( {color: 0x00ff00} )
const sphereMesh = new THREE.Mesh( sphereGeometry, phongMaterial )
sphereMesh.position.set( -2, -2, -2 )
scene.add( sphereMesh )
allSceneMeshes.push( sphereMesh )

const icosahedronGeometry = new THREE.IcosahedronGeometry()
const physicalMaterial = new THREE.MeshPhysicalMaterial( {color: 0x0000ff} )
const icosahedronMesh = new THREE.Mesh( icosahedronGeometry, physicalMaterial )
icosahedronMesh.position.set( -5, -5, -5 )
scene.add( icosahedronMesh )
allSceneMeshes.push( icosahedronMesh )


// Egorov Agency Cube
const GLTF = new GLTFLoader()

let modalReady = false
let EgorovAgencyCube = null
let mixer = null
let animationActions = {}

GLTF.load(
    'assets/models/EgorovAgencyCube.gltf',
    gltf => {
        mixer = new THREE.AnimationMixer(gltf.scene)
        console.log( gltf.animations )

        EgorovAgencyCube = {
            mesh: gltf.scene,
            stoped: false
        }

        // First cube plug
        const plugOne = gltf.scene.children[2]
        const plugOneAnimation = gltf.animations[0]
        const plugOneAction = mixer.clipAction( plugOneAnimation )
        animationActions.plugOne = plugOneAction
    
        // Second cube plug
        const plugTwo = gltf.scene.children[5]
        const plugTwoAnimation = gltf.animations[3]
        const plugTwoAction = mixer.clipAction( plugTwoAnimation )
        animationActions.plugTwo = plugTwoAction

        // Third cube plug
        const plugThree = gltf.scene.children[4]
        const plugThreeAnimation = gltf.animations[2]
        const plugThreeAction = mixer.clipAction( plugThreeAnimation )
        animationActions.plugThree = plugThreeAction

        // Fourth cube plug
        const plugFore = gltf.scene.children[3]
        const plugForeAnimation = gltf.animations[1]
        const plugForeAction = mixer.clipAction( plugForeAnimation )
        animationActions.plugFore = plugForeAction

        scene.add( gltf.scene )

        // Cube frame 
        allSceneMeshes.push( gltf.scene.children[0] )
        allSceneMeshes.push( gltf.scene.children[1] )

        // Cube plugs
        allSceneMeshes.push( ...plugOne.children )
        allSceneMeshes.push( ...plugTwo.children )
        allSceneMeshes.push( ...plugThree.children )
        allSceneMeshes.push( ...plugFore.children )

        modalReady = true
    },
    xhr => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    error => {
        console.log(error)
    }
)


// Raycaster
const raycaster = new THREE.Raycaster()
let intersectedObject = null

renderer.domElement.addEventListener( 'mousemove', onMouseMove, false )

function onMouseMove( event ) {
    raycaster.setFromCamera( {
        x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    }, camera )

    const intersects = raycaster.intersectObjects( allSceneMeshes, false )

    if( intersects.length ) {
        intersectedObject = intersects[0].object
    } else {
        intersectedObject = null
    }
}


// Plug click animation
let exceptions = []

renderer.domElement.addEventListener( 'click', onMouseClick, false )

function onMouseClick() {
    if( !intersectedObject ) return

    if( intersectedObject.name.match('plug1') ) {
        const { plugOne } = animationActions
        exceptions.push( plugOne )
        plugOne.play()
        setTimeout( () => {
            plugOne.stop()
            exceptions = exceptions.filter( item => item !== plugOne )
        }, plugOne.loop )
    } else if( intersectedObject.name.match('plug2') ) {
        const { plugTwo } = animationActions
        exceptions.push( plugTwo )
        plugTwo.play()
        setTimeout( () => {
            plugTwo.stop()
            exceptions = exceptions.filter( item => item !== plugTwo )
        }, plugTwo.loop )
    } else if( intersectedObject.name.match('plug3') ) {
        const { plugThree } = animationActions
        exceptions.push( plugThree )
        plugThree.play()
        setTimeout( () => {
            plugThree.stop()
            exceptions = exceptions.filter( item => item !== plugThree )
        }, plugThree.loop )
    } else if( intersectedObject.name.match('plug4') ) {
        const { plugFore } = animationActions
        exceptions.push( plugFore )
        plugFore.play()
        setTimeout( () => {
            plugFore.stop()
            exceptions = exceptions.filter( item => item !== plugFore )
        }, plugFore.loop )
    }
}


// Stop cube rotation and animation
const stopButton = document.querySelector('.stop-rotation')
stopButton.addEventListener( 'click', stopRotation, false )

function stopRotation() {
    EgorovAgencyCube.stoped = !EgorovAgencyCube.stoped
}


// Anable cube rotation
const cubeRotation = document.querySelector('.cube-rotation')
let movementX
let movementY
let drag = false
let rotationAvailable = false
let rotationSensitivity = 0.05

let previousTouchPosition = {
    x: 0,
    y: 0
}

cubeRotation.addEventListener( 'click', enableRotation, false )
// Mouse
document.addEventListener( 'mousemove', onDocumentMouseMove )
document.addEventListener( 'mousedown', onStartRotate )
document.addEventListener( 'mouseup', onEndRotate )
// Touch
document.addEventListener( 'touchmove', onDocumentTouchMove )
document.addEventListener( 'touchstart', onStartRotate )
document.addEventListener( 'touchend', onEndRotate )

function enableRotation() {
    EgorovAgencyCube.stoped = true
    rotationAvailable = !rotationAvailable
}

function setRotation( movementX, movementY ) {
    if( movementX > 50 || movementX < -50 ) return
    if( drag && rotationAvailable ) {
        const deltaRotationQuaternion = new THREE.Quaternion()
        deltaRotationQuaternion.setFromEuler( new THREE.Euler(
            toRadians( movementY * rotationSensitivity ),
            toRadians( movementX * rotationSensitivity ),
            0,
            'XYZ'
        ) )

        EgorovAgencyCube.mesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, EgorovAgencyCube.mesh.quaternion);
    }
}

function onDocumentMouseMove( event ) {
    movementX = -( event.clientX - window.innerWidth ) / 100 * event.movementX
    movementY = -( event.clientY - window.innerHeight ) / 100 * event.movementY

    setRotation( movementX, movementY )
}

function onDocumentTouchMove( {targetTouches} ) {
    movementX = (targetTouches[0].clientX - previousTouchPosition.x)
    movementY = (targetTouches[0].clientY - previousTouchPosition.y) 

    setRotation( movementX, movementY )

    previousTouchPosition = {
        x: targetTouches[0].clientX,
        y: targetTouches[0].clientY
    }
}

function onStartRotate( event ) {
    drag = true
}

function onEndRotate( event ) {
    drag = false
}

function toRadians(angle) {
	return angle * (Math.PI / 180);
}




// Resize window
window.addEventListener( 'resize', onWindowResize, false )
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}


// Render
function render() {
    renderer.render( scene, camera )
}


// Loop animation
const clock = new THREE.Clock()
let rotationSpeed = 0.005

function animate() {
    requestAnimationFrame( animate )

    controls.enabled = !rotationAvailable

    if( modalReady ){
        controls.target.set( ...EgorovAgencyCube.mesh.position )
        controls.update()

        if( EgorovAgencyCube.stoped ) {
            Object.values( animationActions ).forEach( action => {
                if( exceptions.includes(action) ) return
                action.reset()
            } )
            if( rotationSpeed >= 0 ) rotationSpeed -= 0.0001
        } else {
            exceptions = []
            Object.values( animationActions ).forEach( (action, index) => {
                setTimeout( () => {
                    action.play()
                }, 1000 * index)
            } )
            if( rotationSpeed <= 0.005 ) rotationSpeed += 0.0001
        }

        EgorovAgencyCube.mesh.rotation.y += rotationSpeed

        mixer.update( clock.getDelta() )
    }

    render()
}


animate()