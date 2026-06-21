/**
 * Three.js 3D渲染管理器
 * 负责场景、相机、渲染器的统一管理
 * 内存泄漏防护、性能监测
 */

import * as THREE from 'three';

export class Renderer3D {
  constructor(container, width = 1920, height = 1080) {
    this.container = container;
    this.width = width;
    this.height = height;
    this.trackables = []; // 追踪需要释放的资源
    this.animationId = null;

    // 场景初始化
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
    this.scene.fog = new THREE.Fog(0xf0f0f0, 100, 1000);

    // 相机初始化
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      10000
    );
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);

    // 渲染器初始化
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      precision: 'highp',
      preserveDrawingBuffer: false
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    container.appendChild(this.renderer.domElement);

    // 灯光设置
    this.setupLights();

    // 性能监测
    this.stats = {
      fps: 0,
      frameCount: 0,
      lastTime: Date.now(),
      drawCalls: 0,
      memoryUsage: 0
    };
  }

  /**
   * 设置灯光
   */
  setupLights() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    this.trackables.push(ambientLight);

    // 方向光（投影）
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    this.scene.add(dirLight);
    this.trackables.push(dirLight);

    // 点光源
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-10, 10, 10);
    this.scene.add(pointLight);
    this.trackables.push(pointLight);
  }

  /**
   * 添加几��体到场景
   */
  addMesh(mesh) {
    if (!mesh) return;
    this.scene.add(mesh);
    this.trackables.push(mesh);
    return mesh;
  }

  /**
   * 移除几何体
   */
  removeMesh(mesh) {
    if (!mesh) return;
    this.scene.remove(mesh);
    
    // 回收资源
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(m => m.dispose());
      } else {
        mesh.material.dispose();
      }
    }

    // 从追踪列表删除
    const index = this.trackables.indexOf(mesh);
    if (index > -1) {
      this.trackables.splice(index, 1);
    }
  }

  /**
   * 创建物体轨迹线
   */
  createTrajectory(points = [], color = 0x00ff00, lineWidth = 2) {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({
      color: color,
      linewidth: lineWidth,
      fog: false
    });

    const trajectory = new THREE.Line(geometry, material);
    trajectory.points = [];
    trajectory.maxPoints = 5000; // 限制轨迹长度

    this.addMesh(trajectory);
    return trajectory;
  }

  /**
   * 更新轨迹
   */
  updateTrajectory(trajectory, point) {
    if (trajectory.points.length >= trajectory.maxPoints) {
      trajectory.points.shift(); // 删除最早的点
    }
    trajectory.points.push(point);

    const geometry = trajectory.geometry;
    geometry.dispose();
    const newGeometry = new THREE.BufferGeometry();
    newGeometry.setFromPoints(trajectory.points);
    trajectory.geometry = newGeometry;
  }

  /**
   * 创建箭头表示向量
   */
  createArrow(origin, direction, length = 1, color = 0xff0000, headLength = 0.2) {
    const arrowHelper = new THREE.ArrowHelper(
      new THREE.Vector3(...direction).normalize(),
      new THREE.Vector3(...origin),
      length,
      color,
      headLength * length,
      headLength * length * 0.5
    );
    this.addMesh(arrowHelper);
    return arrowHelper;
  }

  /**
   * 清空场景中的箭头
   */
  clearArrows() {
    this.scene.children = this.scene.children.filter(child => {
      if (child instanceof THREE.ArrowHelper) {
        child.geometry?.dispose();
        child.material?.dispose();
        return false;
      }
      return true;
    });
  }

  /**
   * 渲染帧
   */
  render() {
    this.renderer.render(this.scene, this.camera);
    this.updateStats();
  }

  /**
   * 更新性能统计
   */
  updateStats() {
    this.stats.frameCount++;
    const now = Date.now();
    const deltaTime = now - this.stats.lastTime;

    if (deltaTime >= 1000) {
      this.stats.fps = Math.round(this.stats.frameCount * 1000 / deltaTime);
      this.stats.frameCount = 0;
      this.stats.lastTime = now;

      if (performance.memory) {
        this.stats.memoryUsage = performance.memory.usedJSHeapSize / 1048576; // MB
      }
    }
  }

  /**
   * 设置相机位置
   */
  setCameraPosition(x, y, z) {
    this.camera.position.set(x, y, z);
    this.camera.updateProjectionMatrix();
  }

  /**
   * 调整窗口大小
   */
  onWindowResize(width, height) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * 完全清理资源
   */
  dispose() {
    // 取消动画
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // 释放所有几何体和材质
    this.trackables.forEach(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
      if (obj.dispose) obj.dispose();
    });

    // 清空场景
    this.scene.clear();
    this.trackables = [];

    // 释放渲染器
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}

export default Renderer3D;
