/**
 * 近代物理实验3：康普顿散射
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';
import { PhysicsConstants } from '../../constants/PhysicsConstants';

export class ComptonScatteringSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { wavelength: 0.71e-10, scatteringAngle: 90 };
    this.photon = null;
    this.electron = null;
  }

  initScene() {
    const electronGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const electronMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    this.electron = new THREE.Mesh(electronGeo, electronMat);
    this.renderer.addMesh(this.electron);

    const photonGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const photonMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    this.photon = new THREE.Mesh(photonGeo, photonMat);
    this.photon.position.x = -10;
    this.renderer.addMesh(this.photon);
  }

  update() {
    const theta = (this.params.scatteringAngle * Math.PI) / 180;
    const compton_shift = (PhysicsConstants.h / (PhysicsConstants.m_e * PhysicsConstants.c)) * (1 - Math.cos(theta));
    const scatteredWavelength = this.params.wavelength + compton_shift;

    this.photon.position.x = 10 * Math.cos((this.time % 10) / 10 * Math.PI * 2);
    this.photon.position.y = 10 * Math.sin((this.time % 10) / 10 * Math.PI * 2);

    this.recordData('time', this.time);
    this.recordData('wavelength_shift', compton_shift);
  }

  getKnowledgePoints() {
    return { title: '康普顿散射', textbook: '人教版高中物理选修3-5', chapter: '第16章 动量 能量 波粒二象性', pages: '第300-310页' };
  }

  getCurrentData() {
    const theta = (this.params.scatteringAngle * Math.PI) / 180;
    const compton_shift = (PhysicsConstants.h / (PhysicsConstants.m_e * PhysicsConstants.c)) * (1 - Math.cos(theta));
    return {
      wavelength: validateAndFormatValue(this.params.wavelength * 1e12, 2, { unit: 'pm' }),
      scattering_angle: validateAndFormatValue(this.params.scatteringAngle, 0, { unit: '°' }),
      wavelength_shift: validateAndFormatValue(compton_shift * 1e12, 3, { unit: 'pm' })
    };
  }
}

export default ComptonScatteringSimulation;