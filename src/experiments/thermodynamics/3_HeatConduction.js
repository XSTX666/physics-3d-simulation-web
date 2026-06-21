/**
 * 热学实验3：热传导
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';

export class HeatConductionSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { length: 1, area: 0.01, thermalConductivity: 50, hotTemp: 100, coldTemp: 20 };
    this.rod = null;
  }

  initScene() {
    const rodGeo = new THREE.BoxGeometry(0.2, 0.2, this.params.length);
    const rodMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    this.rod = new THREE.Mesh(rodGeo, rodMat);
    this.renderer.addMesh(this.rod);
  }

  update() {
    const heatFlow = (this.params.thermalConductivity * this.params.area * (this.params.hotTemp - this.params.coldTemp)) / this.params.length;
    const color = Math.floor((heatFlow / 10000) * 255);
    this.rod.material.color.setHex((color << 8) | 0xff);
    this.recordData('time', this.time);
    this.recordData('heat_flow', heatFlow);
  }

  getKnowledgePoints() {
    return { title: '热传导', textbook: '人教版高中物理必修2', chapter: '第13章 热和能', pages: '第310-315页' };
  }

  getCurrentData() {
    const heatFlow = (this.params.thermalConductivity * this.params.area * (this.params.hotTemp - this.params.coldTemp)) / this.params.length;
    return {
      thermal_conductivity: validateAndFormatValue(this.params.thermalConductivity, 1, { unit: 'W/(m·K)' }),
      temperature_difference: validateAndFormatValue(this.params.hotTemp - this.params.coldTemp, 0, { unit: 'K' }),
      heat_flow: validateAndFormatValue(heatFlow, 2, { unit: 'W' })
    };
  }
}

export default HeatConductionSimulation;