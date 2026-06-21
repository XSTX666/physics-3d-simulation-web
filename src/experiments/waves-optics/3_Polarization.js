/**
 * 波动光学实验3：光的极化
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';

export class PolarizationSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { firstPolarizer: 0, secondPolarizer: 45, intensity: 1 };
    this.wave = null;
  }

  initScene() {
    const geo = new THREE.TorusGeometry(5, 0.2, 32, 100);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    this.wave = new THREE.Mesh(geo, mat);
    this.renderer.addMesh(this.wave);
  }

  update() {
    const angle1 = (this.params.firstPolarizer * Math.PI) / 180;
    const angle2 = (this.params.secondPolarizer * Math.PI) / 180;
    const angleChange = Math.abs(angle2 - angle1);

    const transmittedIntensity = this.params.intensity * Math.cos(angleChange) ** 2;
    this.wave.rotation.z = angle1;
    this.wave.scale.y = 0.5 + transmittedIntensity * 0.5;

    this.recordData('time', this.time);
    this.recordData('transmitted_intensity', transmittedIntensity);
  }

  getKnowledgePoints() {
    return { title: '光的极化', textbook: '人教版高中物理选修3-4', chapter: '第11章 波动光学', pages: '第119-125页' };
  }

  getCurrentData() {
    const angle1 = (this.params.firstPolarizer * Math.PI) / 180;
    const angle2 = (this.params.secondPolarizer * Math.PI) / 180;
    const angleChange = Math.abs(angle2 - angle1);
    const transmittedIntensity = this.params.intensity * Math.cos(angleChange) ** 2;
    return {
      polarizer_angle: validateAndFormatValue(angleChange, 1, { unit: '°' }),
      transmitted_intensity: validateAndFormatValue(transmittedIntensity, 3, { unit: '' })
    };
  }
}

export default PolarizationSimulation;