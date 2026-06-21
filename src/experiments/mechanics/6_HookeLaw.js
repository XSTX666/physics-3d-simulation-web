/**
 * 力学实验6：胡克定律与弹簧
 * 知识点：人教版高中物理必修1 第4章 力与运动
 * 页码：第65-70页
 * 物理模型：F = kx, E = ½kx²
 */

import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue, checkPhysicalValidity } from '../../utils/validators';
import { PhysicsConstants } from '../../constants/PhysicsConstants';

export class HookeLawSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    
    this.params = {
      springConstant: 50,    // 劲度系数 (N/m)
      mass: 2,               // 物体质量 (kg)
      stretchDistance: 0,    // 当前拉伸距离 (m)
      showForce: true
    };

    this.block = null;
    this.spring = null;
    this.forceArrow = null;
    this.wall = null;
  }

  /**
   * 初始化场景
   */
  initScene() {
    // 创建固定墙
    const wallGeometry = new THREE.BoxGeometry(1, 10, 10);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    this.wall = new THREE.Mesh(wallGeometry, wallMaterial);
    this.wall.position.set(-15, 0, 0);
    this.renderer.addMesh(this.wall);

    // 创建弹簧（使用圆柱体近似）
    const springGeometry = new THREE.CylinderGeometry(0.2, 0.2, 10, 32);
    const springMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    this.spring = new THREE.Mesh(springGeometry, springMaterial);
    this.spring.position.set(-5, 0, 0);
    this.renderer.addMesh(this.spring);

    // 创建物体
    const blockGeometry = new THREE.BoxGeometry(2, 2, 2);
    const blockMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
    this.block = new THREE.Mesh(blockGeometry, blockMaterial);
    this.block.position.set(0, 0, 0);
    this.block.castShadow = true;
    this.renderer.addMesh(this.block);
  }

  /**
   * 更新仿真
   */
  update() {
    // 胡克定律：F = kx
    const force = -this.params.springConstant * this.params.stretchDistance;
    
    // 加速度
    const acceleration = force / this.params.mass;
    
    // 弹性势能：E = ½kx²
    const elasticPotentialEnergy = 0.5 * this.params.springConstant * 
                                  this.params.stretchDistance * this.params.stretchDistance;
    
    // 更新物体位置
    this.block.position.x = this.params.stretchDistance;
    
    // 更新弹簧长度
    const springLength = 10 - this.params.stretchDistance;
    this.spring.scale.y = Math.max(0.1, springLength / 10);
    this.spring.position.x = -7.5 + this.params.stretchDistance / 2;
    
    // 显示力的箭头
    if (this.forceArrow) this.renderer.scene.remove(this.forceArrow);
    if (this.params.showForce && Math.abs(force) > 0.1) {
      this.forceArrow = this.renderer.createArrow(
        [this.params.stretchDistance, 0, 0],
        [force > 0 ? 1 : -1, 0, 0],
        Math.abs(force) / 10,
        force > 0 ? 0x00ff00 : 0xff0000,
        0.3
      );
    }
    
    // 记录数据
    this.recordData('time', this.time);
    this.recordData('stretch_distance', this.params.stretchDistance);
    this.recordData('force', force);
    this.recordData('elastic_potential_energy', elasticPotentialEnergy);
  }

  /**
   * 设置参数
   */
  setParams(newParams) {
    Object.assign(this.params, newParams);
    this.params.springConstant = checkPhysicalValidity(this.params.springConstant, 'k', false);
    this.params.stretchDistance = Math.max(-10, Math.min(10, this.params.stretchDistance));
  }

  /**
   * 获取知识点
   */
  getKnowledgePoints() {
    return {
      title: '胡克定律与弹簧',
      textbook: '人教版高中物理必修1',
      chapter: '第4章 力与运动',
      pages: '第65-70页',
      formulas: [
        'F = -kx（胡克定律）',
        'E = ½kx²（弹性势能）',
        '劲度系数k的单位是N/m'
      ],
      keyPoints: [
        '弹力方向总是指向平衡位置',
        '劲度系数是弹簧的固有属性',
        '弹簧串联时：1/k = 1/k₁ + 1/k₂',
        '弹簧并联时：k = k₁ + k₂',
        '弹性范围内才遵循胡克定律'
      ]
    };
  }

  /**
   * 获取当前数据
   */
  getCurrentData() {
    const force = -this.params.springConstant * this.params.stretchDistance;
    const acceleration = force / this.params.mass;
    const elasticPotentialEnergy = 0.5 * this.params.springConstant * 
                                  this.params.stretchDistance * this.params.stretchDistance;
    
    return {
      spring_constant: validateAndFormatValue(this.params.springConstant, 3, { unit: 'N/m' }),
      stretch_distance: validateAndFormatValue(this.params.stretchDistance, 3, { unit: 'm' }),
      force: validateAndFormatValue(force, 3, { unit: 'N' }),
      acceleration: validateAndFormatValue(acceleration, 3, { unit: 'm/s²' }),
      elastic_potential_energy: validateAndFormatValue(elasticPotentialEnergy, 3, { unit: 'J' })
    };
  }
}

export default HookeLawSimulation;
