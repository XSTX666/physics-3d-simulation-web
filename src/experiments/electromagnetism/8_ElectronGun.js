/**
 * 电磁学实验8：电子枪
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';
import { PhysicsConstants } from '../../constants/PhysicsConstants';

export class ElectronGunSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { voltage: 1000, deflectionVoltage: 100, plateSeparation: 0.05 };
    this.electron = null;
    this.trajectory = null;
  }

  initScene() {
    const electronGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const electronMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00 });
    this.electron = new THREE.Mesh(electronGeo, electronMat);
    this.renderer.addMesh(this.electron);
    this.trajectory = this.renderer.createTrajectory([], 0xffff00, 2);
  }

  update() {
    const initialVelocity = Math.sqrt(2 * PhysicsConstants.e_charge * this.params.voltage / PhysicsConstants.m_e);
    const deflectionAccel = (PhysicsConstants.e_charge * this.params.deflectionVoltage) / (PhysicsConstants.m_e * this.params.plateSeparation);

    const x = initialVelocity * this.time;
    const y = 0.5 * deflectionAccel * this.time * this.time;

    this.electron.position.set(x / 1e6, y / 1e9, 0);
    this.renderer.updateTrajectory(this.trajectory, new THREE.Vector3(x / 1e6, y / 1e9, 0));

    this.recordData('time', this.time);
    this.recordData('deflection', y);
  }

  getKnowledgePoints() {
    return { title: '电子枪', textbook: '人教版高中物理选修3-1', chapter: '第1章 电的粒子性', pages: '第18-25页' };
  }

  getCurrentData() {
    return {
      accelerating_voltage: validateAndFormatValue(this.params.voltage, 0, { unit: 'V' }),
      deflection_voltage: validateAndFormatValue(this.params.deflectionVoltage, 0, { unit: 'V' })
    };
  }
}

export default ElectronGunSimulation;