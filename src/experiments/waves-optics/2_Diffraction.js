/**
 * 波动光学实验2：衍射
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';

export class DiffractionSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { wavelength: 550e-9, slitWidth: 1e-3, distance: 1 };
    this.canvas = null;
  }

  initScene() {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    this.canvas = canvas;
    
    const texture = new THREE.CanvasTexture(canvas);
    const geo = new THREE.PlaneGeometry(10, 10);
    const mat = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geo, mat);
    this.renderer.addMesh(mesh);
  }

  update() {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 800, 600);

    for (let y = 0; y < 600; y++) {
      for (let x = 0; x < 800; x++) {
        const angle = Math.atan2(y - 300, x - 400);
        const sinc = Math.sin(Math.PI * this.params.slitWidth * Math.sin(angle) / this.params.wavelength);
        const intensity = (sinc / Math.max(0.1, Math.PI * this.params.slitWidth * Math.sin(angle) / this.params.wavelength)) ** 2;
        const brightness = Math.floor(Math.min(intensity * 500, 255));
        ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    this.recordData('time', this.time);
  }

  getKnowledgePoints() {
    return { title: '衍射', textbook: '人教版高中物理选修3-4', chapter: '第11章 波动光学', pages: '第111-118页' };
  }

  getCurrentData() {
    return {
      wavelength: validateAndFormatValue(this.params.wavelength * 1e9, 1, { unit: 'nm' }),
      slit_width: validateAndFormatValue(this.params.slitWidth * 1e6, 2, { unit: 'μm' })
    };
  }
}

export default DiffractionSimulation;