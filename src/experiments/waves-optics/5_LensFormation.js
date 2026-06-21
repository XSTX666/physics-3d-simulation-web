/**
 * 波动光学实验5：透镜成像
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';

export class LensFormationSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { focalLength: 10, objectDistance: 20 };
    this.lens = null;
    this.object = null;
    this.image = null;
  }

  initScene() {
    const lensGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x0080ff, transparent: true, opacity: 0.7 });
    this.lens = new THREE.Mesh(lensGeo, lensMat);
    this.lens.rotation.z = Math.PI / 2;
    this.renderer.addMesh(this.lens);

    const objGeo = new THREE.BoxGeometry(0.5, 2, 0.5);
    const objMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    this.object = new THREE.Mesh(objGeo, objMat);
    this.object.position.x = -this.params.objectDistance;
    this.renderer.addMesh(this.object);
  }

  update() {
    const f = this.params.focalLength;
    const u = this.params.objectDistance;
    const v = (f * u) / (u - f);

    if (this.image) this.renderer.scene.remove(this.image);

    if (Math.abs(v) > 0.5) {
      const imgGeo = new THREE.BoxGeometry(0.5, -2 * v / u, 0.5);
      const imgMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
      this.image = new THREE.Mesh(imgGeo, imgMat);
      this.image.position.x = v;
      this.renderer.addMesh(this.image);
    }

    this.recordData('time', this.time);
    this.recordData('image_distance', v);
  }

  getKnowledgePoints() {
    return { title: '透镜成像', textbook: '人教版高中物理必修2', chapter: '第12章 光的性质', pages: '第212-220页' };
  }

  getCurrentData() {
    const f = this.params.focalLength;
    const u = this.params.objectDistance;
    const v = (f * u) / (u - f);
    const magnification = v / u;
    return {
      focal_length: validateAndFormatValue(f, 2, { unit: 'cm' }),
      object_distance: validateAndFormatValue(u, 2, { unit: 'cm' }),
      image_distance: validateAndFormatValue(v, 2, { unit: 'cm' }),
      magnification: validateAndFormatValue(magnification, 2, { unit: '' })
    };
  }
}

export default LensFormationSimulation;