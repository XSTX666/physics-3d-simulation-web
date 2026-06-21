/**
 * 波动光学实验4：光谱分析
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';

export class SpectrumAnalysisSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { wavelengthMin: 380, wavelengthMax: 780, intensity: 1 };
    this.spectrum = null;
  }

  initScene() {
    const geo = new THREE.PlaneGeometry(20, 2);
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');

    for (let x = 0; x < 400; x++) {
      const wavelength = 380 + (x / 400) * (780 - 380);
      const hue = ((wavelength - 380) / 400) * 360;
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fillRect(x, 0, 1, 40);
    }

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({ map: texture });
    this.spectrum = new THREE.Mesh(geo, mat);
    this.renderer.addMesh(this.spectrum);
  }

  update() {
    this.recordData('time', this.time);
  }

  getKnowledgePoints() {
    return { title: '光谱分析', textbook: '人教版高中物理选修3-4', chapter: '第12章 光的性质', pages: '第126-135页' };
  }

  getCurrentData() {
    return {
      wavelength_min: validateAndFormatValue(this.params.wavelengthMin, 0, { unit: 'nm' }),
      wavelength_max: validateAndFormatValue(this.params.wavelengthMax, 0, { unit: 'nm' })
    };
  }
}

export default SpectrumAnalysisSimulation;