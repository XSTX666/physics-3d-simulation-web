/**
 * 近代物理实验1：光电效应
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';
import { PhysicsConstants } from '../../constants/PhysicsConstants';

export class PhotoelectricEffectSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { wavelength: 400e-9, workFunction: 2.3, photonCount: 0 };
    this.photons = [];
    this.electrons = [];
  }

  initScene() {
    const metalGeo = new THREE.BoxGeometry(10, 10, 1);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const metal = new THREE.Mesh(metalGeo, metalMat);
    metal.position.z = -5;
    this.renderer.addMesh(metal);
  }

  update() {
    const photonEnergy = PhysicsConstants.h * PhysicsConstants.c / this.params.wavelength;
    const workFunctionJ = this.params.workFunction * PhysicsConstants.e_charge;
    const kineticEnergy = Math.max(0, photonEnergy - workFunctionJ);

    if (this.time > 1 && Math.random() < 0.1 && kineticEnergy > 0) {
      const eGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const eMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const electron = new THREE.Mesh(eGeo, eMat);
      electron.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, 0);
      electron.velocity = new THREE.Vector3((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, Math.sqrt(2 * kineticEnergy / 9.11e-31) / 1e15);
      this.renderer.addMesh(electron);
      this.electrons.push(electron);
    }

    for (let e of this.electrons) {
      e.position.add(e.velocity.clone().multiplyScalar(0.01));
      if (e.position.z > 20) this.renderer.scene.remove(e);
    }
    this.electrons = this.electrons.filter(e => e.position.z <= 20);

    this.recordData('time', this.time);
    this.recordData('photon_energy', photonEnergy / PhysicsConstants.e_charge);
  }

  getKnowledgePoints() {
    return { title: '光电效应', textbook: '人教版高中物理选修3-5', chapter: '第16章 动量 能量 波粒二象性', pages: '第281-290页' };
  }

  getCurrentData() {
    const photonEnergy = PhysicsConstants.h * PhysicsConstants.c / this.params.wavelength;
    const workFunctionJ = this.params.workFunction * PhysicsConstants.e_charge;
    const kineticEnergy = Math.max(0, photonEnergy - workFunctionJ);
    return {
      wavelength: validateAndFormatValue(this.params.wavelength * 1e9, 0, { unit: 'nm' }),
      work_function: validateAndFormatValue(this.params.workFunction, 2, { unit: 'eV' }),
      photon_energy: validateAndFormatValue(photonEnergy / PhysicsConstants.e_charge, 2, { unit: 'eV' }),
      max_kinetic_energy: validateAndFormatValue(kineticEnergy / PhysicsConstants.e_charge, 3, { unit: 'eV' })
    };
  }
}

export default PhotoelectricEffectSimulation;