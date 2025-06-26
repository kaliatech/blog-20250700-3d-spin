import { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial'
import { Constants } from '@babylonjs/core/Engines/constants'
import { Mesh } from '@babylonjs/core/Meshes/mesh'

import { Color3 } from '@babylonjs/core/Maths/math.color'
import {
  BASE_COLOR,
  BASE_MESH_IDX,
  INNER_DOT_IDX,
  INNER_ORBIT_COLOR,
  INNER_ORBIT_IDX,
  OUTER_ORBIT_COLOR,
  OUTER_ORBIT_IDX,
} from './BabylonDemoConstants.ts'

export function updateColor(material: PBRMaterial, color: Color3, alpha: number) {
  material.albedoColor = color
  material.emissiveColor = color
  material.alpha = alpha
  if (alpha < 0.99) {
    material.alphaMode = Constants.ALPHA_COMBINE
    material.transparencyMode = Constants.ALPHA_COMBINE
    material.backFaceCulling = false
  } else {
    material.alphaMode = Constants.ALPHA_DISABLE
    material.transparencyMode = Constants.ALPHA_DISABLE
    material.backFaceCulling = false
  }
}

export function setupMaterials(logoMesh: Mesh) {
  const meshes = logoMesh.getChildMeshes()
  const baseMesh = meshes[BASE_MESH_IDX]
  if (baseMesh && baseMesh.material instanceof PBRMaterial) {
    const color = new Color3(BASE_COLOR.r / 255, BASE_COLOR.g / 255, BASE_COLOR.b / 255)
    const m = baseMesh.material
    m.metallic = 0.5
    m.roughness = 0.2
    //m.emissiveIntensity = 0.5
    updateColor(baseMesh.material, color, BASE_COLOR.a)
  }

  const outerOrbit = meshes[OUTER_ORBIT_IDX]
  if (outerOrbit && outerOrbit.material instanceof PBRMaterial) {
    const color = new Color3(OUTER_ORBIT_COLOR.r / 255, OUTER_ORBIT_COLOR.g / 255, OUTER_ORBIT_COLOR.b / 255)
    const m = outerOrbit.material
    m.metallic = 0.8
    m.roughness = 0.2
    m.emissiveIntensity = 0.5
    updateColor(outerOrbit.material, color, OUTER_ORBIT_COLOR.a)

    const m2 = meshes[INNER_DOT_IDX] as Mesh
    if (m2 && m2.material instanceof PBRMaterial) {
      m2.material = m
    }
  }

  const innerOrbit = meshes[INNER_ORBIT_IDX]
  if (innerOrbit && innerOrbit.material instanceof PBRMaterial) {
    const color = new Color3(INNER_ORBIT_COLOR.r / 255, INNER_ORBIT_COLOR.g / 255, INNER_ORBIT_COLOR.b / 255)
    const m = innerOrbit.material
    m.metallic = 0.8
    m.roughness = 0.2
    m.emissiveIntensity = 0.5
    m.emissiveIntensity = 0.5
    updateColor(innerOrbit.material, color, INNER_ORBIT_COLOR.a)
  }

  return
}
