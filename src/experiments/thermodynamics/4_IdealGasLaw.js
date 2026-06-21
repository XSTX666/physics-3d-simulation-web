/**
 * 热学实验4：理想气体状态方程
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';
import { PhysicsConstants } from '../../constants/PhysicsConstants';

export class IdealGasLawSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { moles: 1, temperature: 300, volume: 0.1 };
    this.container = null;
  }

  initScene() {
    const containerGeo = new THREE.BoxGeometry(5, 5, 5);
    const containerMat = new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 0.2, wireframe: true });
    this.container = new THREE.Mesh(containerGeo, containerMat);
    this.renderer.addMesh(this.container);
  }

  update() {
    const pressure = (this.params.moles * PhysicsConstants.R_gas * this.params.temperature) / this.params.volume;
    this.container.scale.set(
      Math.cbrt(this.params.volume),
      Math.cbrt(this.params.volume),
      Math.cbrt(this.params.volume)
    );
    this.recordData('time', this.time);
    this.recordData('pressure', pressure);
  }

  getKnowledgePoints() {
    return { title: '理想气体状态方程', textbook: '人教版高中物理必修2', chapter: '第13章 热和能', pages: '第325-330页' };
  }

  getCurrentData() {
    const pressure = (this.params.moles * PhysicsConstants.R_gas * this.params.temperature) / this.params.volume;
    return {
      moles: validateAndFormatValue(this.params.moles, 1, { unit: 'mol' }),
      temperature: validateAndFormatValue(this.params.temperature, 0, { unit: 'K' }),
      volume: validateAndFormatValue(this.params.volume, 3, { unit: 'm³' }),
      pressure: validateAndFormatValue(pressure, 0, { unit: 'Pa' })
    };
  }
}

export default IdealGasLawSimulation;