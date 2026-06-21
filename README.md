# 人教版高中物理Web 3D仿真实验系统

## 项目概述

本项目是一个基于Three.js的高中物理交互式仿真实验平台，包含25~30个标准物理实验，涵盖五大模块。

### 📚 实验模块

1. **力学模块** (8个实验)
2. **电磁学模块** (8个实验)
3. **波动光学模块** (5个实验)
4. **热学模块** (4个实验)
5. **近代物理模块** (3个实验)

## 硬性标准

- 物理计算误差 ≤ 0.1%
- RK4/Verlet积分算法
- 三端性能：桌面≥55fps / 低配≥30fps / 手机≥25fps
- 内存检测：10次梯度≤5MB / 30min≤10MB
- 无内存泄漏

## 项目结构

```
src/
├── core/                     # 核心引擎
│   ├── PhysicsEngine.js      # 物理引擎（RK4/Verlet）
│   ├── Renderer3D.js         # Three.js渲染管理
│   └── SimulationBase.js     # 仿真基类
├── experiments/              # 25~30个实验
│   ├── mechanics/            # 力学
│   ├── electromagnetism/     # 电磁学
│   ├── waves-optics/         # 波动光学
│   ├── thermodynamics/       # 热学
│   └── modern-physics/       # 近代物理
├── ui/                       # UI组件
│   ├── ControlPanel.jsx      # 控制面板
│   ├── DataDisplay.jsx       # 数据显示
│   └── KnowledgePanel.jsx    # 知识点面板
├── ai/                       # AI功能
│   ├── AIAssistant.js        # 多模态问答
│   ├── KnowledgeSearch.js    # 百度知识搜索
│   └── WebSummary.js         # 网页总结
├── utils/                    # 工具函数
│   ├── constants.js          # 物理常量
│   ├── validators.js         # 数据验证
│   └── performance.js        # 性能监测
├── styles/                   # 样式文件
└── App.jsx                   # 主应用入口
```

## 快速开始

```bash
npm install
npm run dev
npm run build
```

## 质检标准

- 6项独立检测维度
- 缺陷分为P0/P1/P2三级
- 100%文档统一结构
- 人教版精确页码对应

## 文件清单

1. 分批次标准化检测报告
2. 物理全模块缺陷总台账
3. 交付清单与归档管控文档
4. 批量修复工单总表
5. 修复复测工作流程
6. UI横向校验汇总表
7. 跨批次缺陷对标表
8. 整体修复验收报告
