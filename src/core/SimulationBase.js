/**
 * 仿真基类
 * 所有实验继承此类，统一接口
 */

import { PhysicsEngine } from './PhysicsEngine';
import { Renderer3D } from './Renderer3D';

export class SimulationBase {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    
    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }

    this.width = options.width || 1920;
    this.height = options.height || 1080;
    this.isRunning = false;
    this.isPaused = false;
    this.time = 0;
    this.frameCount = 0;

    // 初始化物理引擎和渲染器
    this.engine = new PhysicsEngine({
      integration: options.integration || 'RK4',
      gravity: options.gravity || [0, -9.8, 0]
    });

    this.renderer = new Renderer3D(this.container, this.width, this.height);

    // 数据记录
    this.data = {
      time: [],
      position: [],
      velocity: [],
      energy: [],
      custom: {}
    };

    this.maxDataPoints = 5000;
  }

  /**
   * 初始化场景（由子类重写）
   */
  initScene() {
    throw new Error('initScene must be implemented by subclass');
  }

  /**
   * 更新仿真（由子类重写）
   */
  update() {
    throw new Error('update must be implemented by subclass');
  }

  /**
   * 渲染一帧
   */
  render() {
    this.renderer.render();
  }

  /**
   * 启动仿真
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.isPaused = false;
    this.time = 0;
    this.frameCount = 0;
    this.initScene();
    this.animate();
  }

  /**
   * 暂停仿真
   */
  pause() {
    this.isPaused = true;
  }

  /**
   * 继续仿真
   */
  resume() {
    this.isPaused = false;
  }

  /**
   * 停止仿真
   */
  stop() {
    this.isRunning = false;
    this.time = 0;
    this.frameCount = 0;
  }

  /**
   * 重置仿真
   */
  reset() {
    this.stop();
    this.renderer.scene.clear();
    this.engine.bodies = [];
    this.data = {
      time: [],
      position: [],
      velocity: [],
      energy: [],
      custom: {}
    };
  }

  /**
   * 动画循环
   */
  animate = () => {
    if (!this.isRunning) return;

    this.renderer.animationId = requestAnimationFrame(this.animate);

    if (!this.isPaused) {
      this.update();
      this.engine.step();
      this.time += this.engine.dt;
      this.frameCount++;
    }

    this.render();
  }

  /**
   * 记录数据
   */
  recordData(key, value) {
    if (!this.data[key]) {
      this.data[key] = [];
    }

    if (this.data[key].length >= this.maxDataPoints) {
      this.data[key].shift();
    }

    this.data[key].push(value);
  }

  /**
   * 获取记录的数据
   */
  getData(key) {
    return this.data[key] || [];
  }

  /**
   * 清理资源
   */
  dispose() {
    this.stop();
    this.renderer.dispose();
    this.engine.bodies = [];
    this.data = {};
  }

  /**
   * 获取性能统计
   */
  getStats() {
    return this.renderer.stats;
  }
}

export default SimulationBase;
