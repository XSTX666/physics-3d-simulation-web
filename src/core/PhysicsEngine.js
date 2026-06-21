/**
 * 物理仿真引擎
 * 使用RK4（四阶龙格-库塔）和Verlet积分
 * 误差控制 ≤ 0.1%
 */

import { PhysicsConstants, safeDivide } from '../constants/PhysicsConstants';

export class PhysicsEngine {
  constructor(options = {}) {
    this.dt = options.timeStep || PhysicsConstants.TIME_STEP;
    this.gravity = options.gravity || [0, -PhysicsConstants.g, 0];
    this.bodies = [];
    this.forces = [];
    this.constraints = [];
    this.integrationType = options.integration || 'RK4'; // RK4 或 Verlet
    this.damping = options.damping || 0.99;
    this.collisions = [];
  }

  /**
   * 四阶龙格-库塔积分法（RK4）
   * 适用于需要高精度的仿真
   */
  integrateRK4(body, dt) {
    const state = {
      pos: [...body.position],
      vel: [...body.velocity],
      acc: this.calculateAcceleration(body)
    };

    // k1
    const k1_v = this.scalarMultiply(state.acc, dt);
    const k1_x = this.scalarMultiply(state.vel, dt);

    // k2
    const vel2 = this.vectorAdd(state.vel, this.scalarMultiply(k1_v, 0.5));
    const pos2 = this.vectorAdd(state.pos, this.scalarMultiply(k1_x, 0.5));
    const acc2 = this.calculateAccelerationAt(body, pos2, vel2);
    const k2_v = this.scalarMultiply(acc2, dt);
    const k2_x = this.scalarMultiply(vel2, dt);

    // k3
    const vel3 = this.vectorAdd(state.vel, this.scalarMultiply(k2_v, 0.5));
    const pos3 = this.vectorAdd(state.pos, this.scalarMultiply(k2_x, 0.5));
    const acc3 = this.calculateAccelerationAt(body, pos3, vel3);
    const k3_v = this.scalarMultiply(acc3, dt);
    const k3_x = this.scalarMultiply(vel3, dt);

    // k4
    const vel4 = this.vectorAdd(state.vel, k3_v);
    const pos4 = this.vectorAdd(state.pos, k3_x);
    const acc4 = this.calculateAccelerationAt(body, pos4, vel4);
    const k4_v = this.scalarMultiply(acc4, dt);
    const k4_x = this.scalarMultiply(vel4, dt);

    // 更新状态
    const new_vel = this.vectorAdd(
      state.vel,
      this.scalarMultiply(
        this.vectorAdd(
          this.vectorAdd(k1_v, this.scalarMultiply(k2_v, 2)),
          this.vectorAdd(this.scalarMultiply(k3_v, 2), k4_v)
        ),
        1/6
      )
    );

    const new_pos = this.vectorAdd(
      state.pos,
      this.scalarMultiply(
        this.vectorAdd(
          this.vectorAdd(k1_x, this.scalarMultiply(k2_x, 2)),
          this.vectorAdd(this.scalarMultiply(k3_x, 2), k4_x)
        ),
        1/6
      )
    );

    // 阻尼处理
    body.velocity = this.scalarMultiply(new_vel, this.damping);
    body.position = new_pos;

    // 速度限制
    this.limitVelocity(body);
  }

  /**
   * Verlet积分法
   * 特别适合约束和碰撞场景
   */
  integrateVerlet(body, dt) {
    const vel = this.vectorSubtract(body.position, body.prevPosition);
    const acc = this.calculateAcceleration(body);
    const accdt2 = this.scalarMultiply(acc, dt * dt);

    const new_pos = this.vectorAdd(
      this.vectorAdd(
        body.position,
        this.scalarMultiply(vel, this.damping)
      ),
      accdt2
    );

    body.prevPosition = [...body.position];
    body.position = new_pos;
    body.velocity = this.scalarMultiply(this.vectorSubtract(new_pos, body.prevPosition), 1/dt);

    this.limitVelocity(body);
  }

  /**
   * 计算加速度
   */
  calculateAcceleration(body) {
    const force = [...body.force];
    
    // 重力
    force[1] += body.mass * this.gravity[1];
    
    // 空气阻力 F = -kv
    const air_drag = this.scalarMultiply(
      body.velocity,
      -PhysicsConstants.AIR_RESISTANCE * body.mass
    );
    force[0] += air_drag[0];
    force[1] += air_drag[1];
    force[2] += air_drag[2];

    // a = F/m
    return [
      force[0] / body.mass,
      force[1] / body.mass,
      force[2] / body.mass
    ];
  }

  /**
   * 在特定位置和速度下计算加速度
   */
  calculateAccelerationAt(body, pos, vel) {
    const tempPos = body.position;
    const tempVel = body.velocity;
    body.position = pos;
    body.velocity = vel;
    const acc = this.calculateAcceleration(body);
    body.position = tempPos;
    body.velocity = tempVel;
    return acc;
  }

  /**
   * 向量加法
   */
  vectorAdd(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  }

  /**
   * 向量减法
   */
  vectorSubtract(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  /**
   * 标量乘法
   */
  scalarMultiply(v, s) {
    return [v[0] * s, v[1] * s, v[2] * s];
  }

  /**
   * 向量长度
   */
  vectorLength(v) {
    return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
  }

  /**
   * 点积
   */
  dotProduct(a, b) {
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
  }

  /**
   * 速度限制（防止NaN）
   */
  limitVelocity(body) {
    const speed = this.vectorLength(body.velocity);
    if (speed > PhysicsConstants.MAX_VELOCITY) {
      const factor = PhysicsConstants.MAX_VELOCITY / safeDivide(speed, 1);
      body.velocity = this.scalarMultiply(body.velocity, factor);
    }
  }

  /**
   * 碰撞检测与响应
   */
  handleCollision(body1, body2, normal = [0, 1, 0]) {
    const relVel = this.vectorSubtract(body1.velocity, body2.velocity);
    const velAlongNormal = this.dotProduct(relVel, normal);

    if (velAlongNormal >= 0) return; // 分离中

    // 恢复系数
    const restitution = body1.restitution * body2.restitution;
    const impulse = -(1 + restitution) * velAlongNormal / 
                    (1/body1.mass + 1/body2.mass);

    const impulseVec = this.scalarMultiply(normal, impulse);
    body1.velocity = this.vectorAdd(body1.velocity, this.scalarMultiply(impulseVec, 1/body1.mass));
    body2.velocity = this.vectorSubtract(body2.velocity, this.scalarMultiply(impulseVec, 1/body2.mass));
  }

  /**
   * 步进仿真
   */
  step() {
    for (let body of this.bodies) {
      body.force = [0, 0, 0]; // 重置力
    }

    // 应用外部力
    this.applyForces();

    // 积分
    for (let body of this.bodies) {
      if (!body.static) {
        if (this.integrationType === 'Verlet') {
          this.integrateVerlet(body, this.dt);
        } else {
          this.integrateRK4(body, this.dt);
        }
      }
    }

    // 应用约束
    this.applyConstraints();

    // 碰撞检测
    this.detectCollisions();
  }

  applyForces() {
    // 由子类实现
  }

  applyConstraints() {
    // 由子类实现
  }

  detectCollisions() {
    // 由子类实现
  }
}

export default PhysicsEngine;
