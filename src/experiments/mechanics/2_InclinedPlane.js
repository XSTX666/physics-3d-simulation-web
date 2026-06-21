/**
 * 力学实验2：斜面运动
 * 知识点：人教版高中物理必修1 第3章 相互作用
 * 页码：第47-52页
 * 物理模型：a = g*sin(θ) - μ*g*cos(θ)
 */

import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue, checkPhysicalValidity } from '../../utils/validators';
import { PhysicsConstants, safeDivide } from '../../constants/PhysicsConstants';

export class InclinedPlaneSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    
    this.params = {
      angle: 30,             // 斜面角度 (度)
      height: 50,            // 斜面高度 (m)
      friction: 0.1,         // 摩擦系数
      mass: 1,               // 物体质量 (kg)
      length: 0              // 斜面长度（计算值）
    };

    this.box = null;
    this.incline = null;
    this.trajectory = null;
    this.normalForce = 0;
    this.frictionForce = 0;
  }

  /**
   * 初始化场景
   */
  initScene() {
    // 计算斜面长度
    const angleRad = (this.params.angle * Math.PI) / 180;
    this.params.length = this.params.height / Math.sin(angleRad);

    // 创建斜面
    const inclineGeometry = new THREE.BoxGeometry(this.params.length + 5, 1, 10);
    const inclineMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x808080,
      roughness: 0.7
    });
    this.incline = new THREE.Mesh(inclineGeometry, inclineMaterial);
    this.incline.rotation.z = angleRad;
    this.incline.position.set(
      this.params.length / 2 * Math.cos(angleRad),
      this.params.height / 2 - 10,
      0
    );
    this.incline.receiveShadow = true;
    this.renderer.addMesh(this.incline);

    // 创建物体（立方体）
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff6b6b,
      roughness: 0.4
    });
    this.box = new THREE.Mesh(boxGeometry, boxMaterial);
    this.box.position.set(0, this.params.height + 5, 0);
    this.box.castShadow = true;
    this.box.receiveShadow = true;
    this.renderer.addMesh(this.box);

    // 创建轨迹
    this.trajectory = this.renderer.createTrajectory([], 0x00ff00, 2);

    // 创建物理体
    const body = {
      position: [0, this.params.height + 5, 0],
      prevPosition: [0, this.params.height + 5, 0],
      velocity: [0, 0, 0],
      force: [0, 0, 0],
      mass: this.params.mass,
      static: false,
      restitution: 0.3,
      radius: 0.5
    };
    this.engine.bodies.push(body);
  }

  /**
   * 更新仿真
   */
  update() {
    if (!this.engine.bodies[0]) return;
    
    const body = this.engine.bodies[0];
    const angleRad = (this.params.angle * Math.PI) / 180;
    
    // 沿斜面方向的加速度
    // a = g*sin(θ) - μ*g*cos(θ)
    this.normalForce = body.mass * PhysicsConstants.g * Math.cos(angleRad);
    this.frictionForce = this.params.friction * this.normalForce;
    
    const accelDown = PhysicsConstants.g * Math.sin(angleRad);
    const accelFriction = this.frictionForce / body.mass;
    const netAccel = Math.max(0, accelDown - accelFriction);
    
    // 沿斜面方向的速度和位移
    const distanceDown = 0.5 * netAccel * this.time * this.time;
    
    if (distanceDown <= this.params.length) {
      // 位移分解为x, y坐标
      body.position[0] = distanceDown * Math.cos(angleRad);
      body.position[1] = this.params.height + 5 - distanceDown * Math.sin(angleRad);
      body.velocity[0] = netAccel * this.time * Math.cos(angleRad);
      body.velocity[1] = -netAccel * this.time * Math.sin(angleRad);
    } else {
      // 到达底部
      body.position[0] = this.params.length * Math.cos(angleRad);
      body.position[1] = 5;
      body.velocity = [0, 0, 0];
    }
    
    this.box.position.set(body.position[0], body.position[1], body.position[2]);
    this.renderer.updateTrajectory(this.trajectory, new THREE.Vector3(...body.position));
    
    // 记录数据
    this.recordData('time', this.time);
    this.recordData('distance', distanceDown);
    this.recordData('velocity', Math.sqrt(body.velocity[0]**2 + body.velocity[1]**2));
    this.recordData('normal_force', this.normalForce);
    this.recordData('friction_force', this.frictionForce);
  }

  /**
   * 设置参数
   */
  setParams(newParams) {
    Object.assign(this.params, newParams);
    this.params.angle = Math.max(1, Math.min(89, this.params.angle));
    this.params.friction = checkPhysicalValidity(this.params.friction, 'friction', false);
  }

  /**
   * 获取知识点
   */
  getKnowledgePoints() {
    return {
      title: '斜面运动',
      textbook: '人教版高中物理必修1',
      chapter: '第3章 相互作用',
      pages: '第47-52页',
      formulas: [
        'N = mg·cos(θ)',
        'f = μN = μ·mg·cos(θ)',
        'a = g·sin(θ) - μ·g·cos(θ)',
        's = ½at²'
      ],
      keyPoints: [
        '正压力垂直于斜面',
        '摩擦力沿斜面向上',
        '合力沿斜面向下',
        '临界角：tan(θ)=μ'
      ]
    };
  }

  /**
   * 获取当前数据
   */
  getCurrentData() {
    const body = this.engine.bodies[0];
    if (!body) return {};
    
    const angleRad = (this.params.angle * Math.PI) / 180;
    const accelDown = PhysicsConstants.g * Math.sin(angleRad);
    const accelFriction = this.frictionForce / this.params.mass;
    const netAccel = Math.max(0, accelDown - accelFriction);
    const distanceDown = 0.5 * netAccel * this.time * this.time;
    const velocity = Math.sqrt(body.velocity[0]**2 + body.velocity[1]**2);
    
    return {
      angle: validateAndFormatValue(this.params.angle, 1, { unit: '°' }),
      distance: validateAndFormatValue(distanceDown, 3, { unit: 'm' }),
      velocity: validateAndFormatValue(velocity, 3, { unit: 'm/s' }),
      normal_force: validateAndFormatValue(this.normalForce, 3, { unit: 'N' }),
      friction_force: validateAndFormatValue(this.frictionForce, 3, { unit: 'N' }),
      net_force: validateAndFormatValue(this.normalForce * Math.sin(angleRad) - this.frictionForce, 3, { unit: 'N' })
    };
  }
}

export default InclinedPlaneSimulation;
