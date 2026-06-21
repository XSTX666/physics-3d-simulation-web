/**
 * 电磁学实验4：带电粒子在磁场中的运动
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';

export class ChargedParticleMotionSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { charge: 1.6e-19, mass: 9.11e-31, velocity: 1e6, magneticField: 0.1, angle: 90 };
    this.particle = null;
    this.trajectory = null;
  }

  initScene() {
    const particleGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const particleMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00 });
    this.particle = new THREE.Mesh(particleGeometry, particleMaterial);
    this.renderer.addMesh(this.particle);
    this.trajectory = this.renderer.createTrajectory([], 0xffff00, 2);
  }

  update() {
    const angleRad = (this.params.angle * Math.PI) / 180;
    const radius = (this.params.mass * this.params.velocity) / (Math.abs(this.params.charge) * this.params.magneticField);
    const omega = this.params.velocity / Math.max(radius, 0.1);
    const angle = omega * this.time;

    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    this.particle.position.set(x, 0, z);
    this.renderer.updateTrajectory(this.trajectory, new THREE.Vector3(x, 0, z));

    this.recordData('time', this.time);
    this.recordData('radius', radius);
  }

  getKnowledgePoints() {
    return { title: '带电粒子在磁场中的运动', textbook: '人教版高中物理必修2', chapter: '第9章 磁场', pages: '第175-182页' };
  }

  getCurrentData() {
    const radius = (this.params.mass * this.params.velocity) / (Math.abs(this.params.charge) * this.params.magneticField);
    return { radius: validateAndFormatValue(radius, 3, { unit: 'm' }) };
  }
}

export default ChargedParticleMotionSimulation;