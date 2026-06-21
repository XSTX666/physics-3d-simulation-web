/**
 * 力学实验3：圆周运动
 * 知识点：人教版高中物理必修2 第5章 圆周运动
 * 页码：第76-82页
 * 物理模型：v = 2πr/T, a = v²/r = ω²r, F = ma = mv²/r
 */

import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue, checkPhysicalValidity } from '../../utils/validators';
import { PhysicsConstants } from '../../constants/PhysicsConstants';

export class CircularMotionSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    
    this.params = {
      radius: 10,            // 圆周半径 (m)
      period: 4,             // 周期 (s)
      mass: 1,               // 物体质量 (kg)
      showForceVector: true  // 显示向心力
    };

    this.particle = null;
    this.circle = null;
    this.trajectory = null;
    this.forceArrow = null;
    this.velocityArrow = null;
  }

  /**
   * 初始化场景
   */
  initScene() {
    // 创建圆周轨道（虚线）
    const circleGeometry = new THREE.BufferGeometry();
    const points = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      points.push(
        this.params.radius * Math.cos(angle),
        0,
        this.params.radius * Math.sin(angle)
      );
    }
    circleGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points), 3));
    const circleMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 1, transparent: true, opacity: 0.5 });
    this.circle = new THREE.Line(circleGeometry, circleMaterial);
    this.renderer.addMesh(this.circle);

    // 创建粒子
    const particleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const particleMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b, roughness: 0.3 });
    this.particle = new THREE.Mesh(particleGeometry, particleMaterial);
    this.particle.position.set(this.params.radius, 0, 0);
    this.particle.castShadow = true;
    this.renderer.addMesh(this.particle);

    // 创建轨迹
    this.trajectory = this.renderer.createTrajectory([], 0x00ff00, 2);
  }

  /**
   * 更新仿真
   */
  update() {
    const omega = (2 * Math.PI) / this.params.period; // 角速度
    const angle = omega * this.time; // 当前角度
    
    // 位置
    const x = this.params.radius * Math.cos(angle);
    const z = this.params.radius * Math.sin(angle);
    this.particle.position.set(x, 0, z);
    
    // 速度（切向）
    const velocity = omega * this.params.radius;
    const vx = -velocity * Math.sin(angle);
    const vz = velocity * Math.cos(angle);
    
    // 向心加速度
    const centripetal = omega * omega * this.params.radius;
    const ax = -centripetal * Math.cos(angle);
    const az = -centripetal * Math.sin(angle);
    
    // 向心力
    const force = this.params.mass * centripetal;
    
    // 更新轨迹
    this.renderer.updateTrajectory(this.trajectory, new THREE.Vector3(x, 0, z));
    
    // 清除旧的箭头
    if (this.forceArrow) this.renderer.scene.remove(this.forceArrow);
    if (this.velocityArrow) this.renderer.scene.remove(this.velocityArrow);
    
    if (this.params.showForceVector) {
      // 绘制向心力箭头
      this.forceArrow = this.renderer.createArrow(
        [x, 0, z],
        [ax, 0, az],
        force / 10,
        0xff0000,
        0.3
      );
      
      // 绘制速度箭头
      this.velocityArrow = this.renderer.createArrow(
        [x, 0, z],
        [vx, 0, vz],
        velocity / 5,
        0x0000ff,
        0.3
      );
    }
    
    // 记录数据
    this.recordData('time', this.time);
    this.recordData('angle', angle);
    this.recordData('velocity', velocity);
    this.recordData('centripetal_force', force);
  }

  /**
   * 设置参数
   */
  setParams(newParams) {
    Object.assign(this.params, newParams);
    this.params.radius = checkPhysicalValidity(this.params.radius, 'radius', false);
    this.params.period = checkPhysicalValidity(this.params.period, 'period', false);
  }

  /**
   * 获取知识点
   */
  getKnowledgePoints() {
    return {
      title: '圆周运动',
      textbook: '人教版高中物理必修2',
      chapter: '第5章 圆周运动',
      pages: '第76-82页',
      formulas: [
        'v = 2πr/T = ωr',
        'a = v²/r = ω²r',
        'F = ma = mv²/r = mω²r',
        'ω = 2π/T = 2πf'
      ],
      keyPoints: [
        '向心加速度始终指向圆心',
        '速度始终与圆相切',
        '向心力是合力',
        '周期与角速度成反比'
      ]
    };
  }

  /**
   * 获取当前数据
   */
  getCurrentData() {
    const omega = (2 * Math.PI) / this.params.period;
    const velocity = omega * this.params.radius;
    const centripetal = omega * omega * this.params.radius;
    const force = this.params.mass * centripetal;
    
    return {
      period: validateAndFormatValue(this.params.period, 3, { unit: 's' }),
      radius: validateAndFormatValue(this.params.radius, 3, { unit: 'm' }),
      angular_velocity: validateAndFormatValue(omega, 3, { unit: 'rad/s' }),
      velocity: validateAndFormatValue(velocity, 3, { unit: 'm/s' }),
      centripetal_acceleration: validateAndFormatValue(centripetal, 3, { unit: 'm/s²' }),
      centripetal_force: validateAndFormatValue(force, 3, { unit: 'N' })
    };
  }
}

export default CircularMotionSimulation;
