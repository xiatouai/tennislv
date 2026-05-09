import type { TrainingTemplate } from '../types/entities';

/**
 * Local training suggestion templates keyed by problem code.
 */
export const MOCK_TEMPLATES: TrainingTemplate[] = [
  {
    id: 'tpl-001',
    problemCode: 'P001',
    strokeType: 'forehand',
    title: '准备姿势不正确',
    description: '击球前身体重心偏高，膝盖弯曲不足，影响发力效率。',
    suggestions: [
      '击球前主动降低重心，膝盖弯曲约 120°',
      '每天练习 50 次屈膝准备动作',
      '使用镜子或录像自我检查姿势',
    ],
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tpl-002',
    problemCode: 'P002',
    strokeType: 'forehand',
    title: '挥拍轨迹偏移',
    description: '击球时拍头轨迹偏离最佳路径，导致击球点不稳定。',
    suggestions: [
      '练习由低到高的挥拍轨迹',
      '使用标志桶辅助定位击球点',
      '对墙慢速练习，专注轨迹控制',
    ],
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tpl-003',
    problemCode: 'P003',
    strokeType: 'forehand',
    title: '随挥不完整',
    description: '击球后手臂过早停止，影响力量和旋转。',
    suggestions: [
      '要求随挥结束时拍柄指向目标方向',
      '完成一次完整挥拍后保持姿势 2 秒',
      '对墙练习完整的随挥动作',
    ],
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tpl-004',
    problemCode: 'P004',
    strokeType: 'backhand',
    title: '引拍幅度过大',
    description: '反手引拍时手臂过度后伸，导致击球时机延迟。',
    suggestions: [
      '将引拍幅度控制在身体侧面以内',
      '练习紧凑的短引拍动作',
      '使用节奏训练辅助把握击球时机',
    ],
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tpl-005',
    problemCode: 'P005',
    strokeType: 'backhand',
    title: '转体不充分',
    description: '击球时肩部转动不足，主要依靠手臂发力。',
    suggestions: [
      '击球前确保肩膀转过 90°',
      '练习转体带动手臂的协调动作',
      '核心力量训练：俄罗斯转体 3x20',
    ],
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tpl-006',
    problemCode: 'P006',
    strokeType: 'backhand',
    title: '击球点过近',
    description: '击球点距离身体过近，导致手臂弯曲无法发力。',
    suggestions: [
      '提前移动，保持击球点在身体前方',
      '练习脚步移动以调整站位',
      '使用锥桶标记最佳击球区域',
    ],
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tpl-007',
    problemCode: 'P007',
    strokeType: 'serve',
    title: '抛球不稳定',
    description: '发球时抛球位置和高度不一致，影响击球节奏。',
    suggestions: [
      '练习单人抛球 100 次，确保每次落点一致',
      '抛球时手臂伸直，用手指推送而非手腕',
      '在墙上标记目标抛球高度辅助练习',
    ],
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tpl-008',
    problemCode: 'P008',
    strokeType: 'serve',
    title: '发力链断裂',
    description: '腿部发力未能有效传递至上肢和球拍。',
    suggestions: [
      '练习由腿部→躯干→手臂→手腕的连贯发力',
      '慢动作分解练习各环节的衔接',
      '药球抛掷训练强化动力链 3x15',
    ],
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tpl-009',
    problemCode: 'P009',
    strokeType: 'serve',
    title: '落地脚位置不当',
    description: '发球后落地脚踩线或过早进入场内。',
    suggestions: [
      '发球后保持双脚离地再落地的节奏',
      '单腿平衡训练强化落地稳定性',
      '地面上标记落地区域辅助练习',
    ],
    createdAt: '2026-01-01T00:00:00Z',
  },
];
