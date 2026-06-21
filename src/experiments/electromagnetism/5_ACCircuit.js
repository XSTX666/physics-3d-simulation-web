/**
 * 电磁学实验5：交流电
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';
import { PhysicsConstants } from '../../constants/PhysicsConstants';

export class ACCircuitSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { amplitude: 220, frequency: 50, resistance: 100 };
    this.trajectory = null;
  }

  initScene() {
    this.trajectory = this.renderer.createTrajectory([], 0x00ff00, 2);
  }

  update() {
    const omega = 2 * Math.PI * this.params.frequency;
    const voltage = this.params.amplitude * Math.sin(omega * this.time);
    const current = voltage / this.params.resistance;
    const power = voltage * current;

    const x = this.time % 5;
    const y = voltage / 100;
    this.renderer.updateTrajectory(this.trajectory, new THREE.Vector3(x, y, 0));

    this.recordData('time', this.time);
    this.recordData('voltage', voltage);
    this.recordData('current', current);
    this.recordData('power', power);
  }

  getKnowledgePoints() {
    return { title: '交流电', textbook: '人教版高中物理选修3-4', chapter: '第12章 交流电', pages: '第220-230页' };
  }

  getCurrentData() {
    const omega = 2 * Math.PI * this.params.frequency;
    const voltage = this.params.amplitude * Math.sin(omega * this.time);
    const current = voltage / this.params.resistance;
    return {
      amplitude: validateAndFormatValue(this.params.amplitude, 1, { unit: 'V' }),
      frequency: validateAndFormatValue(this.params.frequency, 1, { unit: 'Hz' }),
      voltage: validateAndFormatValue(voltage, 1, { unit: 'V' }),
      current: validateAndFormatValue(current, 3, { unit: 'A' })
    };
  }
}

export default ACCircuitSimulation;