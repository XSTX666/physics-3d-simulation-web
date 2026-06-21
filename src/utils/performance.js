/**
 * 性能监测工具
 */

export class PerformanceMonitor {
  constructor(sampleSize = 10) {
    this.sampleSize = sampleSize;
    this.samples = [];
    this.memorySnapshots = [];
    this.frameMetrics = [];
  }

  /**
   * 记录帧时间
   */
  recordFrame(deltaTime) {
    this.samples.push(deltaTime);
    if (this.samples.length > this.sampleSize * 2) {
      this.samples.shift();
    }
  }

  /**
   * 获取平均FPS
   */
  getAverageFPS() {
    if (this.samples.length === 0) return 0;
    const avgDeltaTime = this.samples.reduce((a, b) => a + b) / this.samples.length;
    return 1000 / avgDeltaTime;
  }

  /**
   * 获取最小FPS
   */
  getMinFPS() {
    if (this.samples.length === 0) return 0;
    const maxDeltaTime = Math.max(...this.samples);
    return 1000 / maxDeltaTime;
  }

  /**
   * 记录内存快照
   */
  recordMemorySnapshot() {
    if (performance.memory) {
      this.memorySnapshots.push({
        timestamp: Date.now(),
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      });

      // 保留最近300条快照（约5分钟）
      if (this.memorySnapshots.length > 300) {
        this.memorySnapshots.shift();
      }
    }
  }

  /**
   * 检查内存增长
   * @param {number} samples - 检查的快照数量
   * @returns {object} {initial, current, increase, increasePercent}
   */
  checkMemoryGrowth(samples = 10) {
    if (this.memorySnapshots.length < samples) {
      return {
        status: '快照数量不足',
        increasePercent: 0
      };
    }

    const startIdx = this.memorySnapshots.length - samples;
    const initialMemory = this.memorySnapshots[startIdx].used;
    const currentMemory = this.memorySnapshots[this.memorySnapshots.length - 1].used;
    const increase = (currentMemory - initialMemory) / 1048576; // 转换为MB
    const increasePercent = (increase / (initialMemory / 1048576)) * 100;

    return {
      initialMB: (initialMemory / 1048576).toFixed(2),
      currentMB: (currentMemory / 1048576).toFixed(2),
      increaseMB: increase.toFixed(2),
      increasePercent: increasePercent.toFixed(2),
      status: increase <= 5 ? '✓ 正常' : '✗ 超标'
    };
  }

  /**
   * 获取监测报告
   */
  getReport() {
    return {
      averageFPS: this.getAverageFPS().toFixed(2),
      minFPS: this.getMinFPS().toFixed(2),
      memoryGrowth: this.checkMemoryGrowth(10),
      sampleCount: this.samples.length,
      memorySnapshots: this.memorySnapshots.length
    };
  }
}

export default PerformanceMonitor;
