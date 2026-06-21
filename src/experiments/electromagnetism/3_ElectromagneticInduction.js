/**
 * 电磁学实验3：电磁感应
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';
import { PhysicsConstants } from '../../constants/PhysicsConstants';

export class ElectromagneticInductionSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { coilTurns: 100, coilArea: 0.1, magneticField: 1, rotationSpeed: 2 };
    this.coil = null;
  }

  initScene() {
    const coilGeometry = new THREE.TorusGeometry(3, 0.5, 16, 32);
    const coilMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    this.coil = new THREE.Mesh(coilGeometry, coilMaterial);
    this.renderer.addMesh(this.coil);

    const fieldPlaneGeometry = new THREE.PlaneGeometry(12, 12);
    const fieldPlaneMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent: true, opacity: 0.2 });
    const field = new THREE.Mesh(fieldPlaneGeometry, fieldPlaneMaterial);
    field.position.z = -1;
    this.renderer.addMesh(field);
  }

  update() {
    const theta = this.params.rotationSpeed * this.time;
    this.coil.rotation.z = theta;

    const magneticFlux = this.params.magneticField * this.params.coilArea * Math.cos(theta);
    const dt = PhysicsConstants.TIME_STEP;
    const nextTheta = this.params.rotationSpeed * (this.time + dt);
    const nextFlux = this.params.magneticField * this.params.coilArea * Math.cos(nextTheta);
    const inducedEMF = -this.params.coilTurns * (nextFlux - magneticFlux) / dt;

    this.recordData('time', this.time);
    this.recordData('magnetic_flux', magneticFlux);
    this.recordData('induced_emf', inducedEMF);
  }

  setParams(newParams) {
    Object.assign(this.params, newParams);
    this.params.coilTurns = Math.max(1, Math.round(this.params.coilTurns));
  }

  getKnowledgePoints() {
    return { title: '电磁感应', textbook: '人教版高中物理必修2', chapter: '第10章 电磁感应', pages: '第187-193页' };
  }

  getCurrentData() {
    const theta = this.params.rotationSpeed * this.time;
    const magneticFlux = this.params.magneticField * this.params.coilArea * Math.cos(theta);
    const dt = PhysicsConstants.TIME_STEP;
    const nextTheta = this.params.rotationSpeed * (this.time + dt);
    const nextFlux = this.params.magneticField * this.params.coilArea * Math.cos(nextTheta);
    const inducedEMF = -this.params.coilTurns * (nextFlux - magneticFlux) / dt;
    return {
      coil_turns: validateAndFormatValue(this.params.coilTurns, 0, { unit: '' }),
      magnetic_flux: validateAndFormatValue(magneticFlux, 3, { unit: 'Wb' }),
      induced_emf: validateAndFormatValue(inducedEMF, 3, { unit: 'V' })
    };
  }
}

export default ElectromagneticInductionSimulation;