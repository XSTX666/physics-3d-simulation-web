/**
 * 力学实验5：简谐振动
 * 知识点：人教版高中物理选修3-4 第10章 机械波
 * 页码：第142-148页
 * 物理模型：x = A·sin(ωt + φ), v = Aω·cos(ωt + φ)
 */

import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue, checkPhysicalValidity } from '../../utils/validators';
import { PhysicsConstants } from '../../constants/PhysicsConstants';

export class SimpleHarmonicMotionSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    
    this.params = {
      amplitude: 5,          // 振幅 (m)
      period: 4,             // 周期 (s)
      phase: 0,              // 初相位 (rad)
      mass: 1                // 物体质量 (kg)
    };

    this.block = null;
    this.spring = null;
    this.trajectory = null;
    this.equilibrium = null;
  }

  /**
   * 初始化场景
   */
  initScene() {
    // 创建均衡位置标记
    const markerGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const markerMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    this.equilibrium = new THREE.Mesh(markerGeometry, markerMaterial);
    this.equilibrium.position.set(0, 0, 0);
    this.renderer.addMesh(this.equilibrium);

    // 创建振动物体
    const blockGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const blockMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
    this.block = new THREE.Mesh(blockGeometry, blockMaterial);
    this.block.position.set(0, 0, 0);
    this.block.castShadow = true;
    this.renderer.addMesh(this.block);

    // 创建轨迹
    this.trajectory = this.renderer.createTrajectory([], 0x00ff00, 2);
  }

  /**
   * 更新仿真
   */
  update() {
    const omega = (2 * Math.PI) / this.params.period;
    
    // 位移：x = A·sin(ωt + φ)
    const displacement = this.params.amplitude * Math.sin(omega * this.time + this.params.phase);
    
    // 速度：v = Aω·cos(ωt + φ)
    const velocity = this.params.amplitude * omega * Math.cos(omega * this.time + this.params.phase);
    
    // 加速度：a = -Aω²·sin(ωt + φ)
    const acceleration = -this.params.amplitude * omega * omega * Math.sin(omega * this.time + this.params.phase);
    
    // 恢复力：F = -kx = mω²x
    const springConstant = this.params.mass * omega * omega;
    const force = -springConstant * displacement;
    
    // 更新物体位置
    this.block.position.x = displacement;
    
    // 更新轨迹
    this.renderer.updateTrajectory(this.trajectory, new THREE.Vector3(displacement, 0, this.time % 10 - 5));
    
    // 计算动能和势能
    const kineticEnergy = 0.5 * this.params.mass * velocity * velocity;
    const potentialEnergy = 0.5 * springConstant * displacement * displacement;
    const totalEnergy = kineticEnergy + potentialEnergy;
    
    // 记录数据
    this.recordData('time', this.time);
    this.recordData('displacement', displacement);
    this.recordData('velocity', velocity);
    this.recordData('acceleration', acceleration);
    this.recordData('force', force);
    this.recordData('kinetic_energy', kineticEnergy);
    this.recordData('potential_energy', potentialEnergy);
    this.recordData('total_energy', totalEnergy);
  }

  /**
   * 设置参数
   */
  setParams(newParams) {
    Object.assign(this.params, newParams);
    this.params.amplitude = checkPhysicalValidity(this.params.amplitude, 'amplitude', false);
    this.params.period = checkPhysicalValidity(this.params.period, 'period', false);
  }

  /**
   * 获取知识点
   */
  getKnowledgePoints() {
    return {
      title: '简谐振动',
      textbook: '人教版高中物理选修3-4',
      chapter: '第10章 机械波',
      pages: '第142-148页',
      formulas: [
        'x = A·sin(ωt + φ)',
        'v = Aω·cos(ωt + φ)',
        'a = -Aω²·sin(ωt + φ)',
        'ω = 2π/T',
        'E = ½kA² = ½mω²A²'
      ],
      keyPoints: [
        '简谐振动是往复运动的特殊情形',
        '速度超前位移90°相位',
        '加速度与位移反向',
        '机械能守恒',
        '周期与初相无关'
      ]
    };
  }

  /**
   * 获取当前数据
   */
  getCurrentData() {
    const omega = (2 * Math.PI) / this.params.period;
    const displacement = this.params.amplitude * Math.sin(omega * this.time + this.params.phase);
    const velocity = this.params.amplitude * omega * Math.cos(omega * this.time + this.params.phase);
    const acceleration = -this.params.amplitude * omega * omega * Math.sin(omega * this.time + this.params.phase);
    const springConstant = this.params.mass * omega * omega;
    const kineticEnergy = 0.5 * this.params.mass * velocity * velocity;
    const potentialEnergy = 0.5 * springConstant * displacement * displacement;
    
    return {
      amplitude: validateAndFormatValue(this.params.amplitude, 3, { unit: 'm' }),
      period: validateAndFormatValue(this.params.period, 3, { unit: 's' }),
      frequency: validateAndFormatValue(1 / this.params.period, 3, { unit: 'Hz' }),
      displacement: validateAndFormatValue(displacement, 3, { unit: 'm' }),
      velocity: validateAndFormatValue(velocity, 3, { unit: 'm/s' }),
      acceleration: validateAndFormatValue(acceleration, 3, { unit: 'm/s²' }),
      kinetic_energy: validateAndFormatValue(kineticEnergy, 3, { unit: 'J' }),
      potential_energy: validateAndFormatValue(potentialEnergy, 3, { unit: 'J' })
    };
  }
}

export default SimpleHarmonicMotionSimulation;
