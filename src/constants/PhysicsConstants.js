/**
 * 物理常量 - 人教版标准科学数值
 * 所有计算严格按此常量执行
 * 参考：人教版高中物理教材
 */

export const PhysicsConstants = {
  // 基础常数
  G: 6.67430e-11,              // 万有引力常数 (m^3·kg^-1·s^-2)
  g: 9.80,                     // 重力加速度 (m/s^2) - 标准地球
  PI: Math.PI,
  e: 2.71828,

  // 力学常数
  DEFAULT_MASS: 1.0,           // 默认质量 (kg)
  DEFAULT_FRICTION: 0.05,      // 默认摩擦系数
  RESTITUTION_COEFF: 0.8,      // 默认恢复系数 (反弹)
  AIR_RESISTANCE: 0.001,       // 空气阻力系数

  // 电学常数
  k_e: 8.9875517923e9,         // 库伦常数 (N·m^2·C^-2)
  e_charge: 1.602176634e-19,   // 基本电荷 (C)
  epsilon_0: 8.8541878128e-12, // 真空介电常数 (F/m)
  mu_0: 1.25663706212e-6,      // 真空磁导率 (H/m)

  // 光学常数
  c: 299792458,                // 光速 (m/s)
  h: 6.62607015e-34,           // 普朗克常数 (J·s)
  h_bar: 1.054571817e-34,      // 约化普朗克常数 (J·s)
  lambda_visible_min: 380e-9,  // 可见光最小波长 (m)
  lambda_visible_max: 780e-9,  // 可见光最大波长 (m)

  // 热学常数
  k_B: 1.380649e-23,           // 玻尔兹曼常数 (J·K^-1)
  N_A: 6.02214076e23,          // 阿伏伽德罗常数 (mol^-1)
  R_gas: 8.314462618,          // 气体常数 (J·mol^-1·K^-1)
  stefan_boltzmann: 5.670374419e-8, // 斯特凡-玻尔兹曼常数 (W·m^-2·K^-4)

  // 近代物理常数
  m_e: 9.1093837015e-31,       // 电子质量 (kg)
  m_p: 1.67262192369e-27,      // 质子质量 (kg)
  m_n: 1.67492749804e-27,      // 中子质量 (kg)
  c_squared: 8.98755178736e16, // 光速平方 (m^2/s^2)

  // 计算参数
  TIME_STEP: 1/60,             // 时间步长 (s) - 60fps
  MAX_VELOCITY: 100,           // 最大速度限制 (m/s) - 防护
  MIN_VELOCITY: 1e-10,         // 最小速度阈值 (m/s)
  COLLISION_THRESHOLD: 0.01,   // 碰撞检测阈值 (m)
  INTEGRATION_ERROR_THRESHOLD: 0.001, // 积分误差阈值 0.1%

  // UI参数
  DECIMAL_PLACES: 3,           // 默认小数位数
  ARRAY_MAX_LENGTH: 5000,      // 轨迹/波形数组最大长度
  MEMORY_CHECK_INTERVAL: 10000, // 内存检查间隔 (ms)
};

/**
 * 计算误差检查
 * @param {number} calculated - 计算值
 * @param {number} theoretical - 理论值
 * @returns {number} 误差百分比
 */
export function calculateErrorPercentage(calculated, theoretical) {
  if (Math.abs(theoretical) < 1e-10) return 0;
  return Math.abs((calculated - theoretical) / theoretical * 100);
}

/**
 * 验证数值范围
 * @param {number} value - 值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {string} varName - 变量名称
 * @returns {boolean} 是否合法
 */
export function validateValueRange(value, min, max, varName = '') {
  if (value < min || value > max) {
    console.warn(`[警告] ${varName} 超出范围 [${min}, ${max}]，当前值: ${value}`);
    return false;
  }
  return true;
}

/**
 * 防除零处理
 * @param {number} divisor - 除数
 * @param {number} fallback - 回退值
 * @returns {number}
 */
export function safeDivide(divisor, fallback = 0) {
  if (Math.abs(divisor) < 1e-10) {
    console.warn(`[警告] 检测到除零，使用回退值: ${fallback}`);
    return fallback;
  }
  return divisor;
}

export default PhysicsConstants;
