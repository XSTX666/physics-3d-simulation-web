/**
 * 数据验证和格式化工具
 */

import { PhysicsConstants, calculateErrorPercentage, validateValueRange } from '../constants/PhysicsConstants';

/**
 * 验证并格式化数值
 * @param {number} value - 原始值
 * @param {number} places - 小数位数
 * @param {object} constraints - 约束条件 {min, max, unit}
 * @returns {object} {value, formatted, valid, error}
 */
export function validateAndFormatValue(value, places = 3, constraints = {}) {
  const result = {
    value: value,
    formatted: '',
    valid: true,
    error: null,
    unit: constraints.unit || ''
  };

  // 检查NaN
  if (isNaN(value)) {
    result.valid = false;
    result.error = '计算结果为NaN';
    result.formatted = '错误';
    return result;
  }

  // 检查无穷大
  if (!isFinite(value)) {
    result.valid = false;
    result.error = '计算结果为无穷大';
    result.formatted = '∞';
    return result;
  }

  // 范围检查
  if (constraints.min !== undefined || constraints.max !== undefined) {
    const min = constraints.min ?? -Infinity;
    const max = constraints.max ?? Infinity;
    if (!validateValueRange(value, min, max, constraints.name || '')) {
      result.valid = false;
      result.error = `超出范围 [${min}, ${max}]`;
    }
  }

  // 格式化
  result.formatted = value.toFixed(places);
  if (constraints.unit) {
    result.formatted += ` ${constraints.unit}`;
  }

  return result;
}

/**
 * 计算相对误差
 * @param {number} calculated - 计算值
 * @param {number} theoretical - 理论值
 * @returns {object} {errorPercent, status}
 */
export function calculateRelativeError(calculated, theoretical) {
  const errorPercent = calculateErrorPercentage(calculated, theoretical);
  const status = errorPercent <= 0.1 ? '✓ 合格' : '✗ 超差';
  return {
    errorPercent: errorPercent.toFixed(4),
    status: status,
    threshold: PhysicsConstants.INTEGRATION_ERROR_THRESHOLD * 100
  };
}

/**
 * 验证物理单位
 */
export const PhysicsUnits = {
  LENGTH: 'm',
  MASS: 'kg',
  TIME: 's',
  VELOCITY: 'm/s',
  ACCELERATION: 'm/s²',
  FORCE: 'N',
  ENERGY: 'J',
  POWER: 'W',
  CHARGE: 'C',
  ELECTRIC_FIELD: 'N/C',
  MAGNETIC_FIELD: 'T',
  FREQUENCY: 'Hz',
  WAVELENGTH: 'm',
  TEMPERATURE: 'K',
  PRESSURE: 'Pa'
};

/**
 * 检查数值是否为负（物理约束）
 */
export function checkPhysicalValidity(value, varName, allowNegative = false) {
  if (value < 0 && !allowNegative) {
    console.warn(`[物理约束违规] ${varName} 为负值: ${value}，将被置为0`);
    return 0;
  }
  return value;
}

/**
 * 格式化科学计数法
 */
export function formatScientific(value, places = 2) {
  return value.toExponential(places);
}

export default {
  validateAndFormatValue,
  calculateRelativeError,
  PhysicsUnits,
  checkPhysicalValidity,
  formatScientific
};
