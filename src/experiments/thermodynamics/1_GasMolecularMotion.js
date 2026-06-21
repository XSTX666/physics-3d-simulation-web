/**
 * 热学实验1：气体运动论
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';
import { PhysicsConstants } from '../../constants/PhysicsConstants';

export class GasMolecularMotionSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { temperature: 300, volume: 1, particleCount: 100 };
    this.particles = [];
  }

  initScene() {
    for (let i = 0; i < this.params.particleCount; i++) {
      const geo = new THREE.SphereGeometry(0.1, 8, 8);
      const mat = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      mesh.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      this.renderer.addMesh(mesh);
      this.particles.push(mesh);
    }
  }

  update() {
    const avgVelocity = Math.sqrt((3 * PhysicsConstants.k_B * this.params.temperature) / PhysicsConstants.m_e);

    for (let particle of this.particles) {
      particle.position.add(particle.velocity.clone().multiplyScalar(0.01));

      if (Math.abs(particle.position.x) > 10) particle.velocity.x *= -1;
      if (Math.abs(particle.position.y) > 10) particle.velocity.y *= -1;
      if (Math.abs(particle.position.z) > 10) particle.velocity.z *= -1;
    }

    this.recordData('time', this.time);
    this.recordData('avg_velocity', avgVelocity);
  }

  getKnowledgePoints() {
    return { title: '气体运动论', textbook: '人教版高中物理必修2', chapter: '第13章 热和能', pages: '第282-290页' };
  }

  getCurrentData() {
    const avgVelocity = Math.sqrt((3 * PhysicsConstants.k_B * this.params.temperature) / PhysicsConstants.m_e);
    return {
      temperature: validateAndFormatValue(this.params.temperature, 0, { unit: 'K' }),
      particle_count: validateAndFormatValue(this.params.particleCount, 0, { unit: '' }),
      avg_velocity: validateAndFormatValue(avgVelocity, 0, { unit: 'm/s' })
    };
  }
}

export default GasMolecularMotionSimulation;