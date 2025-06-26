import { Engine } from '@babylonjs/core/Engines/engine.js'
import { Scene } from '@babylonjs/core/scene.js'
import { Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector.js'
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera.js'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight.js'
import { Color4 } from '@babylonjs/core/Maths/math.color.js'
import { LoadAssetContainerAsync } from '@babylonjs/core/Loading/sceneLoader.js'
import { Tools } from '@babylonjs/core/Misc/tools.js'
import { Mesh } from '@babylonjs/core'

import '@babylonjs/loaders/glTF/2.0'

export function initBabylon(canvasEl: HTMLCanvasElement) {
  // Initialize Babylon.js engine
  const engine = new Engine(canvasEl, true, {}, true)
  window.addEventListener('resize', () => {
    engine.resize()
  })

  // Create a new scene
  const scene = new Scene(engine)
  scene.createDefaultEnvironment({ createGround: false, createSkybox: false })
  scene.clearColor = new Color4(0, 0, 0, 0)

  // Setup camera
  const camera = new ArcRotateCamera('Camera', Tools.ToRadians(90), Tools.ToRadians(90), 2, new Vector3(0, 0, 0), scene)

  camera.wheelDeltaPercentage = 0.01
  camera.attachControl(true)

  // Let there be light
  new HemisphericLight('light', new Vector3(0, 1, 0), scene)

  // Load the glTF model
  let logoMesh: Mesh | null = null
  LoadAssetContainerAsync(
    'https://kaliatech.github.io/blog-20250700-3d-spin/babylon-prebuilt-viewer/ao-logo-3d-001.glb',
    scene,
    { name: 'aologo' },
  ).then((container) => {
    container.addAllToScene()
    if (container.meshes.length > 0) {
      logoMesh = container.meshes[0] as Mesh
    }
  })

  // Start the render loop
  let lastTime = performance.now()
  engine.runRenderLoop(() => {
    const now = performance.now()
    const deltaTime = (now - lastTime) / 1000 // seconds
    lastTime = now

    scene.render()

    if (logoMesh) {
      const rotationSpeed = 1 // radians per second
      const deltaQuat = Quaternion.RotationAxis(Vector3.Up(), rotationSpeed * deltaTime)
      logoMesh.rotationQuaternion = logoMesh.rotationQuaternion
        ? logoMesh.rotationQuaternion.multiply(deltaQuat)
        : deltaQuat
    }
  })

  //  Inspector.Show(scene, {})

  return scene
}
