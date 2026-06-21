/**
 * 波动光学实验1：双缝干涉
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';

export class DoubleSlit extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { wavelength: 550e-9, slitSpacing: 1e-3, distance: 1, slitWidth: 0.5e-3 };
    this.canvas = null;
  }

  initScene() {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 800, 600);
    
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

    const wavelengthPx = (this.params.wavelength * 1e6) / 10;
    const slitSpacingPx = (this.params.slitSpacing * 1e3) / 10;

    for (let y = 0; y < 600; y++) {
      for (let x = 0; x < 800; x++) {
        const dx = Math.abs(x - 200);
        const dy = Math.abs(x - 600);
        const pathDiff = (dx - dy) * this.params.distance;
        const intensity = Math.cos(Math.PI * pathDiff / this.params.wavelength) ** 2;
        const brightness = Math.floor(intensity * 255);
        ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    this.recordData('time', this.time);
  }

  getKnowledgePoints() {
    return { title: '双缝干涉', textbook: '人教版高中物理选修3-4', chapter: '第11章 波动光学', pages: '第103-110页' };
  }

  getCurrentData() {
    return {
      wavelength: validateAndFormatValue(this.params.wavelength * 1e9, 1, { unit: 'nm' }),
      slit_spacing: validateAndFormatValue(this.params.slitSpacing * 1e3, 3, { unit: 'mm' })
    };
  }
}

export default DoubleSlit;