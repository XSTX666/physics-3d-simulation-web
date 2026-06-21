/**
 * 近代物理实验2：核衰变
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';

export class NuclearDecaySimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { initialNuclei: 1000, halfLife: 10, decayType: 'beta' };
    this.nuclei = [];
  }

  initScene() {
    const colors = { alpha: 0xff0000, beta: 0x0000ff, gamma: 0xffff00 };
    for (let i = 0; i < this.params.initialNuclei; i++) {
      const nucleusGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const nucleusMat = new THREE.MeshStandardMaterial({ color: colors[this.params.decayType] || 0xffffff });
      const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
      nucleus.position.set((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40);
      nucleus.decayed = false;
      this.renderer.addMesh(nucleus);
      this.nuclei.push(nucleus);
    }
  }

  update() {
    const decayConstant = Math.LN2 / this.params.halfLife;
    const decayProbability = 1 - Math.exp(-decayConstant * 0.1);

    for (let nucleus of this.nuclei) {
      if (!nucleus.decayed && Math.random() < decayProbability) {
        nucleus.material.color.set(0x888888);
        nucleus.scale.set(0.5, 0.5, 0.5);
        nucleus.decayed = true;
      }
    }

    const remainingNuclei = this.nuclei.filter(n => !n.decayed).length;
    this.recordData('time', this.time);
    this.recordData('remaining_nuclei', remainingNuclei);
  }

  getKnowledgePoints() {
    return { title: '核衰变', textbook: '人教版高中物理选修3-5', chapter: '第18章 原子核 粒子物理', pages: '第320-328页' };
  }

  getCurrentData() {
    const remainingNuclei = this.nuclei.filter(n => !n.decayed).length;
    const decayPercentage = ((this.params.initialNuclei - remainingNuclei) / this.params.initialNuclei) * 100;
    return {
      initial_nuclei: validateAndFormatValue(this.params.initialNuclei, 0, { unit: '' }),
      remaining_nuclei: validateAndFormatValue(remainingNuclei, 0, { unit: '' }),
      decay_percentage: validateAndFormatValue(decayPercentage, 2, { unit: '%' }),
      half_life: validateAndFormatValue(this.params.halfLife, 1, { unit: 's' })
    };
  }
}

export default NuclearDecaySimulation;