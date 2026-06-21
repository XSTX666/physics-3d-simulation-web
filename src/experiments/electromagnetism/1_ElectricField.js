/**
 * 电磁学实验1：电场可视化
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';
import { PhysicsConstants } from '../../constants/PhysicsConstants';

export class ElectricFieldVisualization extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { charge1: 1e-6, charge2: -1e-6, distance: 10, showFieldLines: true };
    this.charge1Mesh = null;
    this.charge2Mesh = null;
    this.fieldLines = [];
  }

  initScene() {
    const geo1 = new THREE.SphereGeometry(0.8, 32, 32);
    const mat1 = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000 });
    this.charge1Mesh = new THREE.Mesh(geo1, mat1);
    this.charge1Mesh.position.set(-this.params.distance / 2, 0, 0);
    this.renderer.addMesh(this.charge1Mesh);

    const geo2 = new THREE.SphereGeometry(0.8, 32, 32);
    const mat2 = new THREE.MeshStandardMaterial({ color: 0x0000ff, emissive: 0x0000ff });
    this.charge2Mesh = new THREE.Mesh(geo2, mat2);
    this.charge2Mesh.position.set(this.params.distance / 2, 0, 0);
    this.renderer.addMesh(this.charge2Mesh);
    this.drawFieldLines();
  }

  drawFieldLines() {
    this.fieldLines.forEach(line => this.renderer.scene.remove(line));
    this.fieldLines = [];
    if (!this.params.showFieldLines) return;
    const numLines = 12;
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2;
      const points = [];
      const radius = 15;
      const steps = 50;
      for (let j = 0; j < steps; j++) {
        const t = j / steps;
        const x = -this.params.distance / 2 + (this.params.distance) * t;
        const y = radius * Math.sin(angle) * (t > 0.5 ? 2 - 2 * t : 2 * t);
        const z = radius * Math.cos(angle) * (t > 0.5 ? 2 - 2 * t : 2 * t);
        points.push(new THREE.Vector3(x, y, z));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0x00aa00, linewidth: 2 });
      const line = new THREE.Line(geometry, material);
      this.renderer.addMesh(line);
      this.fieldLines.push(line);
    }
  }

  update() {
    const E1 = (PhysicsConstants.k_e * Math.abs(this.params.charge1)) / (this.params.distance * this.params.distance);
    const force = (PhysicsConstants.k_e * this.params.charge1 * this.params.charge2) / (this.params.distance * this.params.distance);
    this.recordData('time', this.time);
    this.recordData('electric_field_1', E1);
    this.recordData('coulomb_force', force);
  }

  setParams(newParams) {
    const oldDistance = this.params.distance;
    Object.assign(this.params, newParams);
    if (this.params.distance !== oldDistance) {
      this.charge1Mesh.position.set(-this.params.distance / 2, 0, 0);
      this.charge2Mesh.position.set(this.params.distance / 2, 0, 0);
      this.drawFieldLines();
    }
  }

  getKnowledgePoints() {
    return {
      title: '电场可视化',
      textbook: '人教版高中物理必修2',
      chapter: '第8章 电场',
      pages: '第138-145页',
      formulas: ['E = kQ/r²', 'F = kQ1Q2/r²']
    };
  }

  getCurrentData() {
    const E1 = (PhysicsConstants.k_e * Math.abs(this.params.charge1)) / (this.params.distance * this.params.distance);
    const force = (PhysicsConstants.k_e * this.params.charge1 * this.params.charge2) / (this.params.distance * this.params.distance);
    return {
      charge1: validateAndFormatValue(this.params.charge1 * 1e6, 3, { unit: 'μC' }),
      distance: validateAndFormatValue(this.params.distance, 3, { unit: 'm' }),
      electric_field: validateAndFormatValue(E1, 3, { unit: 'N/C' }),
      force: validateAndFormatValue(force, 3, { unit: 'N' })
    };
  }
}

export default ElectricFieldVisualization;