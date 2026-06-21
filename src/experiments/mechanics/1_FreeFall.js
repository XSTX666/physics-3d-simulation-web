/**
 * 力学实验1：自由落体运动
 * 知识点：人教版高中物理必修1 第2章 匀变速直线运动
 * 页码：第30-35页
 * 物理模型：h = 0.5*g*t^2, v = g*t
 */

import SimulationBase from '../../core/SimulationBase';
import * as THREE from 'three';
import { validateAndFormatValue, checkPhysicalValidity } from '../../utils/validators';
import { PhysicsConstants } from '../../constants/PhysicsConstants';

export class FreeFallSimulation extends SimulationBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    
    this.params = {
      height: 100,           // 下落高度 (m)
      initialVelocity: 0,    // 初速度 (m/s)
      groundLevel: 0,        // 地面高度 (m)
      mass: 1                // 物体质量 (kg)
    };

    this.ball = null;
    this.trajectory = null;
    this.ground = null;
  }

  /**
   * 初始化场景
   */
  initScene() {
    // 创建球体
    const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xff6b6b,
      roughness: 0.3,
      metalness: 0.2
    });
    this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
    this.ball.position.y = this.params.height;
    this.ball.castShadow = true;
    this.ball.receiveShadow = true;
    this.renderer.addMesh(this.ball);

    // 创建地面
    const groundGeometry = new THREE.PlaneGeometry(50, 1);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8b4513,
      roughness: 0.8
    });
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = this.params.groundLevel - 0.5;
    this.ground.receiveShadow = true;
    this.renderer.addMesh(this.ground);

    // 创建轨迹线
    this.trajectory = this.renderer.createTrajectory([], 0x00ff00, 2);

    // 创建物理体
    const body = {
      position: [0, this.params.height, 0],
      prevPosition: [0, this.params.height, 0],
      velocity: [0, this.params.initialVelocity, 0],
      force: [0, 0, 0],
      mass: this.params.mass,
      static: false,
      restitution: 0.5,
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
    
    // 更新球体位置
    this.ball.position.set(body.position[0], body.position[1], body.position[2]);
    
    // 记录轨迹
    this.renderer.updateTrajectory(this.trajectory, new THREE.Vector3(...body.position));
    
    // 碰撞检测
    if (body.position[1] <= this.params.groundLevel + body.radius) {
      body.position[1] = this.params.groundLevel + body.radius;
      body.velocity[1] = -body.velocity[1] * body.restitution;
      
      // 速度足够小时停止
      if (Math.abs(body.velocity[1]) < 0.1) {
        body.velocity[1] = 0;
      }
    }
    
    // 记录数据
    this.recordData('time', this.time);
    this.recordData('position', body.position[1]);
    this.recordData('velocity', body.velocity[1]);
    
    // 计算理论值
    const theoreticalHeight = Math.max(
      this.params.height - 0.5 * PhysicsConstants.g * this.time * this.time,
      this.params.groundLevel
    );
    this.recordData('theoretical_height', theoreticalHeight);
  }

  /**
   * 设置参数
   */
  setParams(newParams) {
    Object.assign(this.params, newParams);
    this.params.height = checkPhysicalValidity(this.params.height, 'height', false);
    this.params.initialVelocity = this.params.initialVelocity; // 允许向上初速度
    this.params.mass = checkPhysicalValidity(this.params.mass, 'mass', false);
  }

  /**
   * 获取知识点
   */
  getKnowledgePoints() {
    return {
      title: '自由落体运动',
      textbook: '人教版高中物理必修1',
      chapter: '第2章 匀变速直线运动',
      pages: '第30-35页',
      formulas: [
        'h = h₀ + v₀t - ½gt²',
        'v = v₀ - gt',
        'v² - v₀² = -2g(h - h₀)'
      ],
      keyPoints: [
        '忽略空气阻力',
        '重力加速度g ≈ 9.8 m/s²',
        '竖直向下为正方向',
        '自由落体是匀加速直线运动'
      ]
    };
  }

  /**
   * 获取当前数据
   */
  getCurrentData() {
    const body = this.engine.bodies[0];
    if (!body) return {};
    
    const height = body.position[1];
    const velocity = body.velocity[1];
    const theoreticalHeight = Math.max(
      this.params.height - 0.5 * PhysicsConstants.g * this.time * this.time,
      0
    );
    
    return {
      time: validateAndFormatValue(this.time, 3, { unit: 's' }),
      height: validateAndFormatValue(height, 3, { unit: 'm', min: 0 }),
      velocity: validateAndFormatValue(velocity, 3, { unit: 'm/s' }),
      theoreticalHeight: validateAndFormatValue(theoreticalHeight, 3, { unit: 'm' }),
      error: validateAndFormatValue(
        Math.abs(height - theoreticalHeight) / Math.max(theoreticalHeight, 1) * 100,
        3,
        { unit: '%' }
      )
    };
  }
}

export default FreeFallSimulation;
