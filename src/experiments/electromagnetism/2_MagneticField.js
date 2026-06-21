/**
 * 电磁学实验2：磁场与洛伦兹力
 */
import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';
import { PhysicsConstants } from '../../constants/PhysicsConstants';

export class MagneticFieldSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.params = { current: 5, wireLength: 10, magneticField: 0.5, angle: 90 };
    this.wire = null;
    this.forceVector = null;
  }

  initScene() {
    const wireGeometry = new THREE.BoxGeometry(0.2, 0.2, this.params.wireLength);
    const wireMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    this.wire = new THREE.Mesh(wireGeometry, wireMaterial);
    this.wire.position.z = this.params.wireLength / 2;
    this.renderer.addMesh(this.wire);

    const fieldGeometry = new THREE.TorusGeometry(8, 0.5, 8, 32);
    const fieldMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent: true, opacity: 0.5 });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.rotation.y = Math.PI / 2;
    this.renderer.addMesh(field);
  }

  update() {
    const angleRad = (this.params.angle * Math.PI) / 180;
    const force = this.params.magneticField * this.params.current * this.params.wireLength * Math.sin(angleRad);
    this.wire.rotation.x = angleRad;

    if (this.forceVector) this.renderer.scene.remove(this.forceVector);
    if (Math.abs(force) > 0.1) {
      this.forceVector = this.renderer.createArrow([0, 0, 0], [0, force > 0 ? 1 : -1, 0], Math.abs(force) / 5, force > 0 ? 0xff0000 : 0x00ff00, 0.3);
    }

    this.recordData('time', this.time);
    this.recordData('force', force);
  }

  setParams(newParams) {
    Object.assign(this.params, newParams);
    this.params.angle = Math.max(0, Math.min(180, this.params.angle));
  }

  getKnowledgePoints() {
    return { title: '磁场与洛伦兹力', textbook: '人教版高中物理必修2', chapter: '第9章 磁场', pages: '第163-170页' };
  }

  getCurrentData() {
    const angleRad = (this.params.angle * Math.PI) / 180;
    const force = this.params.magneticField * this.params.current * this.params.wireLength * Math.sin(angleRad);
    return {
      current: validateAndFormatValue(this.params.current, 3, { unit: 'A' }),
      magnetic_field: validateAndFormatValue(this.params.magneticField, 3, { unit: 'T' }),
      angle: validateAndFormatValue(this.params.angle, 1, { unit: '°' }),
      force: validateAndFormatValue(force, 3, { unit: 'N' })
    };
  }
}

export default MagneticFieldSimulation;