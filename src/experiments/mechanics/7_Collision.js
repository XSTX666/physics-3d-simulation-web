/**
 * 力学实验7：碰撞与动量守恒
 * 知识点：人教版高中物理必修2 第6章 动量与动能
 * 页码：第103-108页
 * 物理模型：p = mv, p总 = p1 + p2, Ek = ½mv²
 */

import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue } from '../../utils/validators';
import { PhysicsConstants } from '../../constants/PhysicsConstants';

export class CollisionSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    
    this.params = {
      mass1: 1,              // 物体1质量 (kg)
      mass2: 1,              // 物体2质量 (kg)
      velocity1: 5,          // 物体1初速度 (m/s)
      velocity2: -2,         // 物体2初速度 (m/s)
      elasticity: 0.8,       // 碰撞恢复系数 (0-1)
      collisionTime: 5       // 碰撞发生时间 (s)
    };

    this.object1 = null;
    this.object2 = null;
    this.collided = false;
    this.collisionPoint = null;
  }

  /**
   * 初始化场景
   */
  initScene() {
    // 创建物体1
    const geo1 = new THREE.SphereGeometry(0.8, 32, 32);
    const mat1 = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
    this.object1 = new THREE.Mesh(geo1, mat1);
    this.object1.position.set(-20, 0, 0);
    this.object1.castShadow = true;
    this.renderer.addMesh(this.object1);

    // 创建物体2
    const geo2 = new THREE.SphereGeometry(0.8, 32, 32);
    const mat2 = new THREE.MeshStandardMaterial({ color: 0x6b6bff });
    this.object2 = new THREE.Mesh(geo2, mat2);
    this.object2.position.set(20, 0, 0);
    this.object2.castShadow = true;
    this.renderer.addMesh(this.object2);
  }

  /**
   * 更新仿真
   */
  update() {
    // 运动方程
    const x1 = -20 + this.params.velocity1 * this.time;
    const x2 = 20 + this.params.velocity2 * this.time;

    // 碰撞检测
    const distance = Math.abs(x2 - x1);
    if (distance <= 1.6 && !this.collided && this.time < this.params.collisionTime + 0.5) {
      this.handleCollision();
      this.collided = true;
    }

    // 碰撞后运动
    if (this.collided) {
      const timeSinceCollision = this.time - this.params.collisionTime;
      const x1After = this.object1.position.x + this.velocityAfter1 * timeSinceCollision;
      const x2After = this.object2.position.x + this.velocityAfter2 * timeSinceCollision;
      
      this.object1.position.x = x1After;
      this.object2.position.x = x2After;
    } else {
      this.object1.position.x = x1;
      this.object2.position.x = x2;
    }

    // 记录数据
    this.recordData('time', this.time);
    this.recordData('position1', this.object1.position.x);
    this.recordData('position2', this.object2.position.x);
  }

  /**
   * 处理碰撞
   */
  handleCollision() {
    const m1 = this.params.mass1;
    const m2 = this.params.mass2;
    const v1 = this.params.velocity1;
    const v2 = this.params.velocity2;
    const e = this.params.elasticity;

    // 碰撞后速度公式
    // v1' = ((m1-e*m2)*v1 + (1+e)*m2*v2) / (m1+m2)
    // v2' = ((1+e)*m1*v1 + (m2-e*m1)*v2) / (m1+m2)
    
    const denom = m1 + m2;
    this.velocityAfter1 = ((m1 - e * m2) * v1 + (1 + e) * m2 * v2) / denom;
    this.velocityAfter2 = ((1 + e) * m1 * v1 + (m2 - e * m1) * v2) / denom;

    // 计算动量变化
    const momentumBefore = m1 * v1 + m2 * v2;
    const momentumAfter = m1 * this.velocityAfter1 + m2 * this.velocityAfter2;
    
    console.log(`碰撞：动量前=${momentumBefore.toFixed(3)}, 动量后=${momentumAfter.toFixed(3)}`);
  }

  /**
   * 设置参数
   */
  setParams(newParams) {
    Object.assign(this.params, newParams);
    this.collided = false;
  }

  /**
   * 获取知识点
   */
  getKnowledgePoints() {
    return {
      title: '碰撞与动量守恒',
      textbook: '人教版高中物理必修2',
      chapter: '第6章 动量与动能',
      pages: '第103-108页',
      formulas: [
        'p = mv（动量）',
        'Δp = FΔt（动量定理）',
        'p总守恒（在无外力或外力平衡时）',
        'Ek = ½mv²（动能）'
      ],
      keyPoints: [
        '动量守恒是普遍规律',
        '碰撞前后动量相等',
        '恢复系数e表示碰撞程度',
        '完全弹性碰撞：e=1',
        '完全非弹性碰撞：e=0'
      ]
    };
  }

  /**
   * 获取当前数据
   */
  getCurrentData() {
    const p1 = this.params.mass1 * this.params.velocity1;
    const p2 = this.params.mass2 * this.params.velocity2;
    const ptotal = p1 + p2;
    const ek1 = 0.5 * this.params.mass1 * this.params.velocity1 ** 2;
    const ek2 = 0.5 * this.params.mass2 * this.params.velocity2 ** 2;
    
    return {
      mass1: validateAndFormatValue(this.params.mass1, 3, { unit: 'kg' }),
      mass2: validateAndFormatValue(this.params.mass2, 3, { unit: 'kg' }),
      velocity1: validateAndFormatValue(this.params.velocity1, 3, { unit: 'm/s' }),
      velocity2: validateAndFormatValue(this.params.velocity2, 3, { unit: 'm/s' }),
      momentum1: validateAndFormatValue(p1, 3, { unit: 'kg·m/s' }),
      momentum2: validateAndFormatValue(p2, 3, { unit: 'kg·m/s' }),
      total_momentum: validateAndFormatValue(ptotal, 3, { unit: 'kg·m/s' }),
      kinetic_energy1: validateAndFormatValue(ek1, 3, { unit: 'J' }),
      kinetic_energy2: validateAndFormatValue(ek2, 3, { unit: 'J' })
    };
  }
}

export default CollisionSimulation;
