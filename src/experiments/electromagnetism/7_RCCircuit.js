/**
 * 电磁学实验7：RC电路
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';

export class RCCircuitSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { voltage: 100, resistance: 1000, capacitance: 1e-5 };
    this.trajectory = null;
  }

  initScene() {
    this.trajectory = this.renderer.createTrajectory([], 0x00ff00, 2);
  }

  update() {
    const tau = this.params.resistance * this.params.capacitance;
    const capacitorVoltage = this.params.voltage * (1 - Math.exp(-this.time / tau));
    const current = (this.params.voltage / this.params.resistance) * Math.exp(-this.time / tau);

    const x = this.time % 5;
    const y = capacitorVoltage / 50;
    this.renderer.updateTrajectory(this.trajectory, new THREE.Vector3(x, y, 0));

    this.recordData('time', this.time);
    this.recordData('capacitor_voltage', capacitorVoltage);
    this.recordData('current', current);
  }

  getKnowledgePoints() {
    return { title: 'RC电路', textbook: '人教版高中物理选修3-1', chapter: '第2章 恒定电流', pages: '第45-52页' };
  }

  getCurrentData() {
    const tau = this.params.resistance * this.params.capacitance;
    const capacitorVoltage = this.params.voltage * (1 - Math.exp(-this.time / tau));
    return {
      voltage: validateAndFormatValue(this.params.voltage, 1, { unit: 'V' }),
      time_constant: validateAndFormatValue(tau, 6, { unit: 's' }),
      capacitor_voltage: validateAndFormatValue(capacitorVoltage, 2, { unit: 'V' })
    };
  }
}

export default RCCircuitSimulation;