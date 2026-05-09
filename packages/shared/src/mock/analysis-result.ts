import type { AnalysisResult } from '../types/entities';

interface RichProblem {
  code: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  observation: string;
  impact: string;
  correction: string;
  trainingTask: string;
}

const PROBLEMS_BY_STROKE: Record<string, { problems: RichProblem[]; overallScore: number; confidence: number; summary: string; priorityFix: string }> = {
  forehand: {
    problems: [
      {
        code: 'P001',
        severity: 'high',
        title: '准备姿势重心偏高',
        description: '击球前身体重心偏高，膝盖弯曲不足，影响发力效率。',
        observation: '从关键帧可以看到，你在准备击球时膝盖弯曲角度约 150°，而理想的准备姿势膝盖应弯曲至约 120°。重心偏高导致你无法充分利用腿部力量。',
        impact: '重心偏高会直接导致发力不充分，击球力量不足，且在高强度对拉中容易失去平衡。这是你正手动作中最优先需要改正的问题。',
        correction: '击球前主动降低重心，膝盖弯曲至约 120°。注意重心下降后身体仍要保持稳定，不要前倾或后仰。',
        trainingTask: '每天练习 50 次屈膝准备动作：面对镜子，模拟来球时主动屈膝降低重心，保持 2 秒后恢复。连续 3 天完成可进阶。',
      },
      {
        code: 'P002',
        severity: 'medium',
        title: '挥拍轨迹明显偏移',
        description: '击球时拍头轨迹偏离最佳路径，导致击球点不稳定。',
        observation: '关键帧对比显示，你的拍头在击球前有明显的外侧偏移，出拍角度约偏离最佳轨迹 15°。这导致击球点不够稳定，每次击球位置存在差异。',
        impact: '挥拍轨迹不稳定会导致击球一致性下降，失误率上升。长期可能形成错误的肌肉记忆，影响正手技术进阶。',
        correction: '练习由低到高的挥拍轨迹，想象拍头从球的 6 点钟方向刷到 12 点钟方向。使用标志桶辅助定位正确的击球点。',
        trainingTask: '对墙慢速练习，每次 20 球一组，共 3 组。专注拍头轨迹的一贯性，不求力量。完成后用手机录像自查轨迹。',
      },
      {
        code: 'P003',
        severity: 'medium',
        title: '随挥动作不完整',
        description: '击球后手臂过早停止，损失旋转和力量。',
        observation: '高速关键帧显示，你在球离开拍面后约 0.2 秒就停止了手臂运动。完整的随挥应该持续到拍柄指向目标方向。',
        impact: '随挥不完整会损失球的旋转和穿透力，且增加了手臂刹车带来的冲击负荷，长期可能增加肘关节受伤风险。',
        correction: '击球后让手臂自然完成整个随挥动作，结束时拍柄应指向目标方向。不要有意识地"停"住球拍，让它自然减速。',
        trainingTask: '完成完整挥拍后保持结束姿势 2 秒再放下。每天对墙练习 2 组，每组 15 球，专注于完成后保持姿势。',
      },
    ],
    overallScore: 72,
    confidence: 89,
    summary: '正手动作整体评估：发现 3 个主要问题。准备姿势重心偏高是最优先需要改进的环节，建议从下肢稳定性开始针对性训练。预计坚持训练 2-4 周可见明显改善。',
    priorityFix: '准备姿势重心偏高',
  },
  backhand: {
    problems: [
      {
        code: 'P004',
        severity: 'high',
        title: '引拍幅度过大',
        description: '反手引拍时手臂过度后伸，导致击球时机延迟。',
        observation: '关键帧显示你的引拍幅度超出了身体侧面约 30cm，相比标准引拍多出近一倍的幅度。这导致你从引拍到击球的转换时间延长，容易被来球挤压。',
        impact: '引拍过大会显著延迟击球时机，在面对快球时尤其被动。同时增加了手臂的负担，导致动作一致性和耐力下降。',
        correction: '将引拍幅度控制在身体侧面以内，想象手肘轻触身体侧面的感觉。引拍时保持手臂与身体的距离感，不求大幅度。',
        trainingTask: '练习紧凑短引拍：站在离墙 30cm 处挥拍，确保引拍过程中球拍不触碰墙壁。每天 3 组，每组 20 次。',
      },
      {
        code: 'P005',
        severity: 'medium',
        title: '转体不充分',
        description: '击球时肩部转动不足，手臂发力占比过高。',
        observation: '你的肩部转动角度约为 60°，而标准反手应达到约 90° 的转体。由于转体不足，你过度依赖手臂发力，这在第 4-5 帧中尤为明显。',
        impact: '转体不足导致发力主要来自手臂而非核心肌群，力量受限且稳定性差。长时间依赖手臂发力会增加肩部和肘部受伤风险。',
        correction: '击球前确保肩膀转过 90°，用核心肌群带动手臂而非手臂单独发力。引拍时想象用后背朝向对手的感觉。',
        trainingTask: '核心力量训练：俄罗斯转体 3 组 x 20 次。结合反手挥拍，每次挥拍时有意识地感受核心带动。',
      },
      {
        code: 'P006',
        severity: 'low',
        title: '击球点距离身体过近',
        description: '击球点距离身体过近，手臂弯曲无法充分发力。',
        observation: '击球瞬间你的手臂弯曲角度约 120°，而理想的反手击球手臂应接近伸直（约 160°-170°）。击球点偏近身体约 15-20cm。',
        impact: '击球点过近会压缩发力空间，导致力量输出不足，同时在面对深球时缺少调整余地。虽然当前影响较小，但长期不纠正会形成习惯。',
        correction: '提前移动，保持击球点在身体前方。用脚步调整站位，在球到达之前预留出足够的挥拍空间。',
        trainingTask: '使用锥桶标记最佳击球区域，每次练习时确保击球点在标记区域前方。连续 5 次正确后休息。',
      },
    ],
    overallScore: 68,
    confidence: 85,
    summary: '反手动作整体评估：发现 3 个主要问题。引拍幅度过大是最大的问题，导致整个击球节奏受影响。建议优先解决引拍问题，预计 3-5 周可见改善。',
    priorityFix: '引拍幅度过大',
  },
  serve: {
    problems: [
      {
        code: 'P007',
        severity: 'high',
        title: '抛球位置不稳定',
        description: '发球时抛球位置和高度不一致，影响击球节奏。',
        observation: '通过对比多次抛球的关键帧发现，你的抛球横向偏差约 15-25cm，高度波动范围约 30cm。这在 6 帧抽帧数据中有 4 帧显示明显的抛球不一致。',
        impact: '抛球不稳定是所有发球技术问题的根源。不一致的抛球导致击球点每次都在变化，进而影响整个发力链，使发球命中率和威力大幅下降。',
        correction: '抛球时手臂伸直，用手指推送而非手腕发力。想象将球"放"到目标位置而非"抛"上去。在室内练习时可对墙面标记目标点。',
        trainingTask: '单人抛球练习：在墙上标记目标抛球高度，每天练习 100 次抛球（不击球），确保每次球落回手中同一位置。',
      },
      {
        code: 'P008',
        severity: 'medium',
        title: '发力链断裂',
        description: '腿部发力未能有效传递至上肢和球拍。',
        observation: '关键帧分析显示，你的腿部发力与手臂挥拍之间存在明显的时间断层。腿部蹬地后约 0.3 秒力量才传递到手臂，导致上下半身发力脱节。',
        impact: '发力链断裂意味着你无法充分利用全身力量来发球，发球速度受限。同时不协调的发力模式会增加肩部和腰部受伤风险。',
        correction: '练习由腿部→躯干→手臂→手腕的连贯发力顺序。可以先慢动作分解练习各环节的衔接，逐步加快节奏。',
        trainingTask: '药球抛掷训练 3 组 x 15 次，强化核心到上肢的动力传导。配合慢动作发球练习，专注于力量从下至上的传递感。',
      },
      {
        code: 'P009',
        severity: 'low',
        title: '落地脚位置不当',
        description: '发球后落地脚踩线或过早进入场内。',
        observation: '发球后你的左脚下落位置经常在中线附近，且落地时机偏早——在球尚未过网之前身体已经进入场内约 30cm，这在发球规则中属于违规。',
        impact: '落地脚踩线会导致发球犯规，在正式比赛中直接失分。过早进入场内也说明发球后的平衡控制需要改善。',
        correction: '发球后保持双脚离地自然落地的节奏，不要主动跳进场内。将注意力放在完成完整的发球动作，而非急于进入下一板。',
        trainingTask: '单腿平衡训练：每次发球后在落地位置保持单腿站立 3 秒。地面上标记理想落地区域，每次练习检验落地位置。',
      },
    ],
    overallScore: 65,
    confidence: 82,
    summary: '发球动作整体评估：发现 3 个主要问题。抛球稳定性是所有发球技术的基础，需要优先解决。建议首先投入 1 周时间专门练习抛球，再陆续解决发力链和落地问题。',
    priorityFix: '抛球位置不稳定',
  },
};

export function mockAnalysisResult(strokeType: string): AnalysisResult {
  const r = PROBLEMS_BY_STROKE[strokeType] ?? PROBLEMS_BY_STROKE.forehand;
  return {
    problems: r.problems,
    overallScore: r.overallScore,
    confidence: r.confidence,
    summary: r.summary,
    priorityFix: r.priorityFix,
  };
}

export { PROBLEMS_BY_STROKE };
