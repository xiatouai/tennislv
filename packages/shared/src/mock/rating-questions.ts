import type { RatingQuestion } from '../types/entities';

export const RATING_QUESTIONS: RatingQuestion[] = [
  // ── Q1: 整体能力画像 ──
  {
    id: 'q1',
    text: '哪一项最接近你目前的整体网球状态？',
    options: [
      {
        value: 'a',
        label: '刚开始学习',
        description: '几乎没有打过网球，正在学习规则、握拍和基本挥拍。',
        scoreValue: 1.0,
      },
      {
        value: 'b',
        label: '新手入门',
        description: '有过几次练习，对规则有初步概念；能偶尔把球打过网，但稳定性较差。',
        scoreValue: 1.5,
      },
      {
        value: 'c',
        label: '基础对打',
        description: '能进行基本对打，对站位和击球有初步概念；但控制节奏、击球选择和比赛稳定性仍需提高。',
        scoreValue: 2.0,
      },
      {
        value: 'd',
        label: '轻度来回',
        description: '已能稳定进行轻度底线来回，能维持短回合，开始理解比赛节奏。',
        scoreValue: 2.5,
      },
      {
        value: 'e',
        label: '稳定底线',
        description: '已能稳定进行底线来回，具备基本发球和比赛能力；但深度、落点和变化仍不够稳定。',
        scoreValue: 3.0,
      },
      {
        value: 'f',
        label: '多拍对抗',
        description: '技术基本成熟，能执行多种击球，开始使用简单战术，有一定对抗能力。',
        scoreValue: 3.5,
      },
      {
        value: 'g',
        label: '战术型打法',
        description: '能稳定且有计划地打出战术型网球，发球具备攻击性，能根据对手弱点调整策略。',
        scoreValue: 4.0,
      },
      {
        value: 'h',
        label: '高水平业余',
        description: '技术全面，体能良好，战术成熟，能在高水平业余比赛中形成竞争力。',
        scoreValue: 4.5,
      },
      {
        value: 'i',
        label: '准专业水平',
        description: '比赛经验丰富，技术、脚步和心理成熟，能稳定控制高强度比赛节奏。',
        scoreValue: 5.0,
      },
    ],
  },

  // ── Q2: 底线相持稳定性 ──
  {
    id: 'q2',
    text: '底线相持时，以下哪一项最接近你的真实表现？',
    options: [
      { value: 'a', label: '很少超过 3 拍', description: '经常在来回初期失误，主要目标是把球打过网。', scoreValue: 1 },
      { value: 'b', label: '能进行短回合', description: '偶尔能对打 5-8 拍，但方向和落点控制有限。', scoreValue: 2 },
      { value: 'c', label: '能稳定进入回合', description: '通常能对打 10 拍以上，能控制基本方向。', scoreValue: 3 },
      { value: 'd', label: '能主动控制落点', description: '能稳定对打 15 拍以上，并按意图控制落点。', scoreValue: 4 },
    ],
  },

  // ── Q3: 正手能力 ──
  {
    id: 'q3',
    text: '以下哪一项最接近你的正手表现？',
    options: [
      { value: 'a', label: '动作尚不固定', description: '击球点不稳定，正手失误较多。', scoreValue: 1 },
      { value: 'b', label: '基本固定', description: '能完成常规正手击球，但力量和方向控制有限。', scoreValue: 2 },
      { value: 'c', label: '动作稳定', description: '能主动发力并控制基本方向，正手具备一定攻击性。', scoreValue: 3 },
      { value: 'd', label: '技术成熟', description: '能打出不同旋转和线路，正手是得分武器。', scoreValue: 4 },
    ],
  },

  // ── Q4: 反手能力 ──
  {
    id: 'q4',
    text: '以下哪一项最接近你的反手表现？',
    options: [
      { value: 'a', label: '动作尚不固定', description: '反手经常失误，面对稍快来球难以处理。', scoreValue: 1 },
      { value: 'b', label: '基本固定', description: '能完成常规反手击球，但面对快球时容易被动。', scoreValue: 2 },
      { value: 'c', label: '动作稳定', description: '能应对大多数来球，反手具备一定防守能力。', scoreValue: 3 },
      { value: 'd', label: '技术成熟', description: '能主动发力并控制落点，反手也能得分。', scoreValue: 4 },
    ],
  },

  // ── Q5: 击球深度和落点控制 ──
  {
    id: 'q5',
    text: '击球时，你对深度和落点的控制能力如何？',
    options: [
      { value: 'a', label: '基本无法控制', description: '球落点随机，没有方向和深度概念。', scoreValue: 1 },
      { value: 'b', label: '大致控制方向', description: '能区分左右，但深度控制有限。', scoreValue: 2 },
      { value: 'c', label: '基本可控', description: '能有意识地打深或打浅，落点基本符合意图。', scoreValue: 3 },
      { value: 'd', label: '精确控制', description: '能精确控制深度和角度，主动调动对手跑动。', scoreValue: 4 },
    ],
  },

  // ── Q6: 旋转与变化能力 ──
  {
    id: 'q6',
    text: '以下哪一项最接近你的旋转和击球变化能力？',
    options: [
      { value: 'a', label: '只会平击', description: '没有上旋概念，击球缺乏旋转变化。', scoreValue: 1 },
      { value: 'b', label: '基础旋转', description: '能打出上旋，但旋转质量和一致性一般。', scoreValue: 2 },
      { value: 'c', label: '旋转稳定', description: '上旋稳定，能根据需要使用下旋或侧旋变化。', scoreValue: 3 },
      { value: 'd', label: '旋转丰富', description: '能根据战术选择不同旋转和节奏，变化多样。', scoreValue: 4 },
    ],
  },

  // ── Q7: 发球稳定性 ──
  {
    id: 'q7',
    text: '以下哪一项最接近你的发球表现？',
    options: [
      { value: 'a', label: '动作尚不稳定', description: '双误较多，发球动作还在练习中。', scoreValue: 1 },
      { value: 'b', label: '基本稳定', description: '一发成功率一般，二发以稳妥为主。', scoreValue: 2 },
      { value: 'c', label: '有一定威胁', description: '一发能制造压力，二发较稳定。', scoreValue: 3 },
      { value: 'd', label: '发球武器', description: '一发威力强，二发有旋转和落点变化。', scoreValue: 4 },
    ],
  },

  // ── Q8: 接发球能力 ──
  {
    id: 'q8',
    text: '以下哪一项最接近你的接发球能力？',
    options: [
      { value: 'a', label: '比较被动', description: '面对稍快的发球就难以处理，接发失误较多。', scoreValue: 1 },
      { value: 'b', label: '基本应对', description: '能接回中等速度发球，但回球质量有限。', scoreValue: 2 },
      { value: 'c', label: '稳定接发', description: '能稳定接回多数发球，有一定回球深度。', scoreValue: 3 },
      { value: 'd', label: '接发有攻击性', description: '能给发球方制造压力，回球落点有威胁。', scoreValue: 4 },
    ],
  },

  // ── Q9: 网前截击能力 ──
  {
    id: 'q9',
    text: '以下哪一项最接近你的网前截击能力？',
    options: [
      { value: 'a', label: '很少上网', description: '截击动作不熟练，基本不打网前球。', scoreValue: 1 },
      { value: 'b', label: '基础截击', description: '能完成简单截击，但面对快球时失误较多。', scoreValue: 2 },
      { value: 'c', label: '截击稳定', description: '截击动作稳定，能主动上网得分。', scoreValue: 3 },
      { value: 'd', label: '网前技术成熟', description: '截击落点精准，网前是得分手段。', scoreValue: 4 },
    ],
  },

  // ── Q10: 移动与站位 ──
  {
    id: 'q10',
    text: '以下哪一项最接近你在场上的移动能力？',
    options: [
      { value: 'a', label: '移动较慢', description: '经常跑不到位，击球后恢复慢。', scoreValue: 1 },
      { value: 'b', label: '基本能到位', description: '大部分球能跑到，但击球后恢复较慢。', scoreValue: 2 },
      { value: 'c', label: '移动较快', description: '能覆盖大部分场地，击球后能较快恢复站位。', scoreValue: 3 },
      { value: 'd', label: '脚步灵活', description: '能快速到位并迅速恢复，场上覆盖能力强。', scoreValue: 4 },
    ],
  },

  // ── Q11: 战术意识 ──
  {
    id: 'q11',
    text: '比赛中，以下哪一项最接近你的战术意识？',
    options: [
      { value: 'a', label: '没有战术概念', description: '只想着把球打过去，不考虑策略。', scoreValue: 1 },
      { value: 'b', label: '开始有意识', description: '会有意识打向对手弱侧，但执行不稳定。', scoreValue: 2 },
      { value: 'c', label: '有战术思路', description: '能根据对手特点调整击球选择，战术意图清晰。', scoreValue: 3 },
      { value: 'd', label: '战术成熟', description: '能主动控制比赛节奏，调动对手按自己节奏打。', scoreValue: 4 },
    ],
  },

  // ── Q12: 比赛稳定性 ──
  {
    id: 'q12',
    text: '以下哪一项最接近你在比赛中的表现稳定性？',
    options: [
      { value: 'a', label: '波动很大', description: '比赛中经常失误，表现起伏明显。', scoreValue: 1 },
      { value: 'b', label: '时有波动', description: '有稳定发挥的时候，但关键分容易紧张失误。', scoreValue: 2 },
      { value: 'c', label: '较为稳定', description: '大部分时间能保持稳定发挥，关键分处理较好。', scoreValue: 3 },
      { value: 'd', label: '比赛心理成熟', description: '能在压力下保持高水平发挥，越关键越稳。', scoreValue: 4 },
    ],
  },
];
