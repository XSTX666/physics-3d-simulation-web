/**
 * 力学实验4：抛体运动
 * 知识点：人教版高中物理必修1 第4章 力与运动
 * 页码：第58-65页
 * 物理模型：x = v₀ₓ·t, y = v₀ᵧ·t - ½gt²
 */

import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';
import { PhysicsConstants } from '../../constants/PhysicsConstants';

export class ProjectileMotionSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    
    this.params = {
      initialVelocity: 20,   // 初速度 (m/s)
      angle: 45,             // 发射角度 (度)
      mass: 1                // 物体质量 (kg)
    };

    this.projectile = null;
    this.trajectory = null;
    this.ground = null;
  }

  /**
   * 初始化场景
   */
  initScene() {
    // 创建抛体
    const projectileGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const projectileMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
    this.projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);
    this.projectile.position.set(0, 0, 0);
    this.projectile.castShadow = true;
    this.renderer.addMesh(this.projectile);

    // 创建地面
    const groundGeometry = new THREE.PlaneGeometry(100, 1);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -0.5;
    this.renderer.addMesh(this.ground);

    // 创建轨迹
    this.trajectory = this.renderer.createTrajectory([], 0x00ff00, 2);
  }

  /**
   * 更新仿真
   */
  update() {
    const angleRad = (this.params.angle * Math.PI) / 180;
    const v0x = this.params.initialVelocity * Math.cos(angleRad);
    const v0y = this.params.initialVelocity * Math.sin(angleRad);

    // 位置计算
    const x = v0x * this.time;
    const y = v0y * this.time - 0.5 * PhysicsConstants.g * this.time * this.time;

    if (y >= 0) {
      this.projectile.position.set(x, y, 0);
      this.renderer.updateTrajectory(this.trajectory, new THREE.Vector3(x, y, 0));

      // 速度
      const vx = v0x;
      const vy = v0y - PhysicsConstants.g * this.time;

      // 记录数据
      this.recordData('time', this.time);
      this.recordData('position_x', x);
      this.recordData('position_y', y);
      this.recordData('velocity_x', vx);
      this.recordData('velocity_y', vy);
    }
  }

  /**
   * 设置参数
   */
  setParams(newParams) {
    Object.assign(this.params, newParams);
    this.params.angle = Math.max(1, Math.min(89, this.params.angle));
  }

  /**
   * 获取知识点
   */
  getKnowledgePoints() {
    return {
      title: '抛体运动',
      textbook: '人教版高中物理必修1',
      chapter: '第4章 力与运动',
      pages: '第58-65页',
      formulas: [
        'x = v₀·cos(θ)·t',
        'y = v₀·sin(θ)·t - ½gt²',
        '最大高度：hₘₐₓ = (v₀·sin(θ))²/(2g)',
        '射程：R = v₀²·sin(2θ)/g'
      ],
      keyPoints: [
        '水平方向匀速直线运动',
        '竖直方向匀加速直线运动',
        '45°发射角射程最大',
        '水平和竖直方向独立'
      ]
    };
  }

  /**
   * 获取当前数据
   */
  getCurrentData() {
    const angleRad = (this.params.angle * Math.PI) / 180;
    const v0x = this.params.initialVelocity * Math.cos(angleRad);
    const v0y = this.params.initialVelocity * Math.sin(angleRad);
    const vx = v0x;
    const vy = v0y - PhysicsConstants.g * this.time;
    const x = v0x * this.time;
    const y = v0y * this.time - 0.5 * PhysicsConstants.g * this.time * this.time;
    const maxHeight = (v0y * v0y) / (2 * PhysicsConstants.g);
    const range = (this.params.initialVelocity ** 2) * Math.sin(2 * angleRad) / PhysicsConstants.g;
    
    return {
      angle: validateAndFormatValue(this.params.angle, 1, { unit: '°' }),
      initial_velocity: validateAndFormatValue(this.params.initialVelocity, 3, { unit: 'm/s' }),
      position_x: validateAndFormatValue(x, 3, { unit: 'm' }),
      position_y: validateAndFormatValue(y, 3, { unit: 'm' }),
      velocity_x: validateAndFormatValue(vx, 3, { unit: 'm/s' }),
      velocity_y: validateAndFormatValue(vy, 3, { unit: 'm/s' }),
      max_height: validateAndFormatValue(maxHeight, 3, { unit: 'm' }),
      range: validateAndFormatValue(range, 3, { unit: 'm' })
    };
  }
}

export default ProjectileMotionSimulation;
