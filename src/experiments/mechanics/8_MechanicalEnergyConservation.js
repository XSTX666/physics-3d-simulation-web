/**
 * 力学实验8：机械能守恒
 * 知识点：人教版高中物理必修2 第6章 机械能
 * 页码：第110-115页
 * 物理模型：E = Ek + Ep = ½mv² + mgh
 */

import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';
import { PhysicsConstants } from '../../constants/PhysicsConstants';

export class MechanicalEnergyConservationSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    
    this.params = {
      mass: 2,               // 物体质量 (kg)
      initialHeight: 20,     // 初始高度 (m)
      initialVelocity: 0,    // 初速度 (m/s)
      friction: false        // 是否有摩擦力
    };

    this.ball = null;
    this.trajectory = null;
    this.initialEnergy = 0;
  }

  /**
   * 初始化场景
   */
  initScene() {
    // 计算初始机械能
    this.initialEnergy = this.params.mass * PhysicsConstants.g * this.params.initialHeight +
                         0.5 * this.params.mass * this.params.initialVelocity ** 2;

    // 创建球体
    const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
    this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
    this.ball.position.y = this.params.initialHeight;
    this.ball.castShadow = true;
    this.renderer.addMesh(this.ball);

    // 创建地面
    const groundGeometry = new THREE.PlaneGeometry(100, 1);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    this.renderer.addMesh(ground);

    // 创建轨迹
    this.trajectory = this.renderer.createTrajectory([], 0x00ff00, 2);
  }

  /**
   * 更新仿真
   */
  update() {
    const g = PhysicsConstants.g;
    const friction = this.params.friction ? 0.02 : 0;
    
    // 下落运动（考虑摩擦）
    const height = Math.max(
      this.params.initialHeight - 0.5 * g * this.time * this.time * (1 - friction),
      0
    );
    
    const velocity = Math.sqrt(
      2 * g * (this.params.initialHeight - height) * (1 - friction)
    );
    
    // 更新位置
    this.ball.position.y = height;
    this.renderer.updateTrajectory(this.trajectory, new THREE.Vector3(0, height, 0));
    
    // 计算能量
    const potentialEnergy = this.params.mass * g * height;
    const kineticEnergy = 0.5 * this.params.mass * velocity * velocity;
    const totalEnergy = potentialEnergy + kineticEnergy;
    const energyLoss = this.initialEnergy - totalEnergy;
    
    // 记录数据
    this.recordData('time', this.time);
    this.recordData('height', height);
    this.recordData('velocity', velocity);
    this.recordData('potential_energy', potentialEnergy);
    this.recordData('kinetic_energy', kineticEnergy);
    this.recordData('total_energy', totalEnergy);
    this.recordData('energy_loss', energyLoss);
  }

  /**
   * 设置参数
   */
  setParams(newParams) {
    Object.assign(this.params, newParams);
  }

  /**
   * 获取知识点
   */
  getKnowledgePoints() {
    return {
      title: '机械能守恒',
      textbook: '人教版高中物理必修2',
      chapter: '第6章 机械能',
      pages: '第110-115页',
      formulas: [
        'E = Ek + Ep = ½mv² + mgh',
        'Ek = ½mv²（动能）',
        'Ep = mgh（重力势能）',
        'ΔE = -W摩擦力（能量变化）'
      ],
      keyPoints: [
        '机械能 = 动能 + 势能',
        '无摩擦：机械能守恒',
        '有摩擦：机械能逐渐减少',
        '摩擦力做功 = 机械能损失',
        '物体运动过程中总能量守恒'
      ]
    };
  }

  /**
   * 获取当前数据
   */
  getCurrentData() {
    const height = Math.max(
      this.params.initialHeight - 0.5 * PhysicsConstants.g * this.time * this.time,
      0
    );
    const velocity = Math.sqrt(2 * PhysicsConstants.g * (this.params.initialHeight - height));
    const potentialEnergy = this.params.mass * PhysicsConstants.g * height;
    const kineticEnergy = 0.5 * this.params.mass * velocity * velocity;
    
    return {
      initial_height: validateAndFormatValue(this.params.initialHeight, 3, { unit: 'm' }),
      height: validateAndFormatValue(height, 3, { unit: 'm' }),
      velocity: validateAndFormatValue(velocity, 3, { unit: 'm/s' }),
      potential_energy: validateAndFormatValue(potentialEnergy, 3, { unit: 'J' }),
      kinetic_energy: validateAndFormatValue(kineticEnergy, 3, { unit: 'J' }),
      total_energy: validateAndFormatValue(potentialEnergy + kineticEnergy, 3, { unit: 'J' }),
      initial_energy: validateAndFormatValue(this.initialEnergy, 3, { unit: 'J' })
    };
  }
}

export default MechanicalEnergyConservationSimulation;
