import { Engine } from '@babylonjs/core/Engines/engine.js'
import { Scene } from '@babylonjs/core/scene.js'
import { Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector.js'
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera.js'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight.js'
import { Color4, Color3 } from '@babylonjs/core/Maths/math.color.js'
import { LoadAssetContainerAsync } from '@babylonjs/core/Loading/sceneLoader.js'
import { Tools } from '@babylonjs/core/Misc/tools.js'
import { Mesh } from '@babylonjs/core/Meshes/mesh.js'
import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial.js'
import { GlowLayer } from '@babylonjs/core/Layers/glowLayer'

//import { Inspector } from '@babylonjs/inspector'

// This is required for createDefaultEnvironment, but
// increases bundle size by ~600k gzipped. Marginal value for
// this demo.
import '@babylonjs/core/Helpers/sceneHelpers'

// Increases bundle size considerably, but unavoidable.
import '@babylonjs/loaders/glTF/2.0'
import { setupMaterials, updateColor } from './setupMaterials.js'
import { BASE_MESH_IDX, INNER_DOT_IDX, INNER_ORBIT_IDX, OUTER_ORBIT_IDX } from './BabylonDemoConstants.js'
import type { RGBColor } from 'react-color'

const INTERACTION_TIMEOUT_MS = 2000

const glbModelUrl = 'https://kaliatech.github.io/blog-20250700-3d-spin/babylon-prebuilt-viewer/ao-logo-3d-007.glb'

export class BabylonDemo {
  private _engine: Engine | null = null
  private _logoMesh: Mesh | null = null
  private _glLayer: GlowLayer | null = null

  private _spinSpeed = 1 // radians per second
  private _glowIntensity = 3

  private _lastPointerDown = Date.now() - INTERACTION_TIMEOUT_MS

  constructor(private _canvasEl: HTMLCanvasElement) {}

  public init(initSpinSpeed: number, initGlowIntensity: number) {
    this._spinSpeed = initSpinSpeed
    this._glowIntensity = initGlowIntensity

    // Initialize Babylon.js engine
    const engine = new Engine(this._canvasEl, true, { alpha: true }, true)
    this._engine = engine
    window.addEventListener('resize', () => {
      engine.resize()
    })

    // Create scene
    const scene = new Scene(engine)
    scene.createDefaultEnvironment({ createGround: false, createSkybox: false })
    scene.clearColor = new Color4(0, 0, 0, 0)

    const gl = new GlowLayer('glow', scene)
    gl.intensity = initGlowIntensity
    this._glLayer = gl

    // Create camera
    const camera = new ArcRotateCamera(
      'Camera',
      Tools.ToRadians(90),
      Tools.ToRadians(90),
      2.2,
      new Vector3(-0.2, 0, 0),
      scene,
    )
    camera.wheelDeltaPercentage = 0.01
    camera.attachControl(true)

    // Let there be light
    new HemisphericLight('light', new Vector3(0, 1, 0), scene)

    // Load the glTF model
    LoadAssetContainerAsync(glbModelUrl, scene).then((container) => {
      if (container.meshes.length < 1) {
        throw new Error('No meshes found in the assset container.')
      }
      this._logoMesh = container.meshes[0] as Mesh
      setupMaterials(this._logoMesh)

      //gl.addExcludedMesh(this._logoMesh.getChildMeshes()[BASE_MESH_IDX] as Mesh)

      container.addAllToScene()
    })

    scene.onPointerDown = () => {
      this._lastPointerDown = Date.now()
    }

    // Start the render loop
    let lastTime = performance.now()
    engine.runRenderLoop(() => {
      const now = performance.now()
      const deltaTime = (now - lastTime) / 1000 // seconds
      lastTime = now

      scene.render()

      // Rotate the model.
      // Babylon uses quaternions for gltf models.
      if (this._logoMesh && Date.now() - this._lastPointerDown > INTERACTION_TIMEOUT_MS) {
        const deltaQuat = Quaternion.RotationAxis(Vector3.Up(), this._spinSpeed * deltaTime)
        const mesh = this._logoMesh
        mesh.position.x = 0.2
        mesh.rotationQuaternion = mesh.rotationQuaternion ? mesh.rotationQuaternion.multiply(deltaQuat) : deltaQuat
      }
    })

    // Useful for debugging:
    //Inspector.Show(scene, { enablePopup: true, overlay: true, embedMode: true })

    return scene
  }

  public dispose() {
    this._engine?.dispose()
  }

  updateGlowLayerIntensity(intensity: number) {
    this._glowIntensity = intensity
    if (!this._glLayer) {
      return
    }
    this._glLayer.intensity = this._glowIntensity
  }

  updateSpinSpeed(speed: number) {
    this._spinSpeed = speed
  }

  updateMaterialColor(controlId: string, color: RGBColor) {
    if (!this._logoMesh) {
      return
    }

    let meshes: Mesh[] | null = []
    switch (controlId) {
      case 'color1':
        meshes = [this._logoMesh.getChildMeshes()[BASE_MESH_IDX] as Mesh]
        break
      case 'color2':
        meshes = [
          this._logoMesh.getChildMeshes()[OUTER_ORBIT_IDX] as Mesh,
          this._logoMesh.getChildMeshes()[INNER_DOT_IDX] as Mesh,
        ]
        break
      case 'color3':
        meshes = [this._logoMesh.getChildMeshes()[INNER_ORBIT_IDX] as Mesh]
        break
    }

    const color3 = new Color3(color.r / 255, color.g / 255, color.b / 255)

    for (const mesh of meshes) {
      const material = mesh.material
      if (!material || !(material instanceof PBRMaterial)) {
        console.warn(`No valid material found for control ID: ${controlId}`)
        return
      }
      updateColor(material, color3, color.a === undefined ? 1.0 : color.a)
    }
  }
}
