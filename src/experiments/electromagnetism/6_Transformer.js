/**
 * 电磁学实验6：变压器
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';

export class TransformerSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { primaryTurns: 100, secondaryTurns: 50, primaryVoltage: 220 };
    this.primaryCoil = null;
    this.secondaryCoil = null;
  }

  initScene() {
    const primaryGeo = new THREE.TorusGeometry(3, 0.3, 8, 32);
    const primaryMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    this.primaryCoil = new THREE.Mesh(primaryGeo, primaryMat);
    this.primaryCoil.position.x = -5;
    this.renderer.addMesh(this.primaryCoil);

    const secondaryGeo = new THREE.TorusGeometry(3, 0.3, 8, 32);
    const secondaryMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    this.secondaryCoil = new THREE.Mesh(secondaryGeo, secondaryMat);
    this.secondaryCoil.position.x = 5;
    this.renderer.addMesh(this.secondaryCoil);
  }

  update() {
    const ratio = this.params.secondaryTurns / this.params.primaryTurns;
    const secondaryVoltage = this.params.primaryVoltage * ratio;
    const primaryCurrent = 1;
    const secondaryCurrent = primaryCurrent / ratio;

    this.recordData('time', this.time);
    this.recordData('secondary_voltage', secondaryVoltage);
  }

  getKnowledgePoints() {
    return { title: '变压器', textbook: '人教版高中物理选修3-4', chapter: '第12章 交流电', pages: '第235-242页' };
  }

  getCurrentData() {
    const ratio = this.params.secondaryTurns / this.params.primaryTurns;
    const secondaryVoltage = this.params.primaryVoltage * ratio;
    return {
      primary_turns: validateAndFormatValue(this.params.primaryTurns, 0, { unit: '' }),
      secondary_turns: validateAndFormatValue(this.params.secondaryTurns, 0, { unit: '' }),
      primary_voltage: validateAndFormatValue(this.params.primaryVoltage, 1, { unit: 'V' }),
      secondary_voltage: validateAndFormatValue(secondaryVoltage, 1, { unit: 'V' })
    };
  }
}

export default TransformerSimulation;