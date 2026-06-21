/**
 * 热学实验2：热膨胀
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';

export class ThermalExpansionSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { initialLength: 10, coefficient: 0.000012, temperatureChange: 100 };
    this.rod = null;
  }

  initScene() {
    const rodGeo = new THREE.CylinderGeometry(0.2, 0.2, this.params.initialLength, 32);
    const rodMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    this.rod = new THREE.Mesh(rodGeo, rodMat);
    this.renderer.addMesh(this.rod);
  }

  update() {
    const deltaLength = this.params.initialLength * this.params.coefficient * this.params.temperatureChange * (this.time / 10);
    const newLength = this.params.initialLength + deltaLength;
    this.rod.scale.y = newLength / this.params.initialLength;
    this.recordData('time', this.time);
    this.recordData('length', newLength);
  }

  getKnowledgePoints() {
    return { title: '热膨胀', textbook: '人教版高中物理必修2', chapter: '第13章 热和能', pages: '第298-305页' };
  }

  getCurrentData() {
    const deltaLength = this.params.initialLength * this.params.coefficient * this.params.temperatureChange;
    return {
      initial_length: validateAndFormatValue(this.params.initialLength, 2, { unit: 'cm' }),
      temperature_change: validateAndFormatValue(this.params.temperatureChange, 0, { unit: 'K' }),
      expansion: validateAndFormatValue(deltaLength, 4, { unit: 'cm' }),
      expansion_ratio: validateAndFormatValue((deltaLength / this.params.initialLength) * 100, 3, { unit: '%' })
    };
  }
}

export default ThermalExpansionSimulation;