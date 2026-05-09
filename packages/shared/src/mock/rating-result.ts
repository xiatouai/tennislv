import type { RatingResult, RatingAnswer, PlayStyleTag, DimensionScore, RatingType, LevelName } from '../types/entities';
import { RATING_QUESTIONS } from './rating-questions';
import { getNtrpLevel } from '../ntrp';

// ── Generic scoreValue lookup ──

function getScore(questionId: string, answers: RatingAnswer[]): number {
  const answer = answers.find(a => a.questionId === questionId);
  if (!answer) return 2;
  const question = RATING_QUESTIONS.find(q => q.id === questionId);
  const option = question?.options.find(o => o.value === answer.value);
  return option?.scoreValue ?? 2;
}

// ── Technology skill average (Q2-Q12, each 1-4 scale) ──

function getTechAverage(answers: RatingAnswer[]): number {
  const qids = ['q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12'];
  let sum = 0;
  for (const qid of qids) sum += getScore(qid, answers);
  return sum / qids.length;
}

// ── NTRP level calculation ──

function snapToHalfLevel(value: number): string {
  const clamped = Math.max(1.0, Math.min(7.0, value));
  // Find the nearest 0.5 increment
  const snapped = Math.round(clamped * 2) / 2;
  return snapped.toFixed(1);
}

function calculateFinalLevel(answers: RatingAnswer[]): number {
  const q1Anchor = getScore('q1', answers); // 1.0-5.0
  const techAvg = getTechAverage(answers);  // 1-4 scale

  // Normalize Q1 anchor to 1-4 scale: map 1.0→1, 5.0→4
  const q1Norm = 1 + ((q1Anchor - 1.0) / 4.0) * 3;

  // Adjust anchor based on tech skill deviation
  const diff = techAvg - q1Norm;
  return q1Anchor + diff * 0.4;
}

const LEVEL_NAME_MAP: Record<string, LevelName> = {
  '1.0': '初学入门', '1.5': '基础练习',
  '2.0': '基础建立期', '2.5': '初级进阶级',
  '3.0': '中级', '3.5': '中级稳定',
  '4.0': '中高级', '4.5': '高级入门',
  '5.0': '高级', '5.5': '准专业级',
  '6.0': '专业级', '6.5': '专业高级', '7.0': '精英级',
};

const LEVEL_NICKNAME_MAP: Record<string, string> = {
  '1.0': '刚上场的新手', '1.5': '练习入门者',
  '2.0': '基础练习型', '2.5': '稳定练习型',
  '3.0': '业余中级球友', '3.5': '多拍对抗型',
  '4.0': '战术型球员', '4.5': '高水平业余强手',
  '5.0': '资深赛事型', '5.5': '准专业选手',
  '6.0': '专业级选手', '6.5': '专业高级选手', '7.0': '精英级选手',
};

function getLevelName(level: string): LevelName {
  return LEVEL_NAME_MAP[level] || '中级';
}

function getLevelNickname(level: string): string {
  return LEVEL_NICKNAME_MAP[level] || '业余球友';
}

function getSocialComment(level: string, _dims: DimensionScore[]): string {
  const levelNum = parseFloat(level) || 3.0;

  if (levelNum <= 2.0) {
    return '你正在建立网球基础，这个阶段最重要的是享受打球、感受进步。';
  }
  if (levelNum <= 2.5) {
    return '你已经具备基本对打能力，是典型的练习阶段球友，多和不同风格的球友过招会进步很快。';
  }
  if (levelNum <= 3.0) {
    return '你已经具备稳定底线来回和基本比赛能力，是典型的业余中级选手。适合和水平相近的球友组局练习或双打。';
  }
  if (levelNum <= 3.5) {
    return '你的多拍对抗能力扎实，已经进入中级稳定阶段。你目前更像"稳定底线型"球友，发球和网前还有提升空间。';
  }
  if (levelNum <= 4.0) {
    return '你能打出有战术意图的网球，在业余球友中属于中上水平。你的比赛阅读能力是你最大的武器。';
  }
  return '你的网球技术全面、战术成熟，在业余球友中很有竞争力。继续保持，享受高水平对抗的乐趣。';
}

function getStrengths(dims: DimensionScore[]): string[] {
  const sorted = [...dims].sort((a, b) => b.score - a.score);
  const strengths: string[] = [];
  if (sorted[0]) strengths.push(`${sorted[0].label}是你的最强项`);
  if (sorted[1] && sorted[1].score >= 45) strengths.push(`${sorted[1].label}也表现不错`);
  if (strengths.length < 2 && sorted[2]) strengths.push(`${sorted[2].label}有提升潜力`);
  return strengths.slice(0, 2);
}

function getFocusArea(dims: DimensionScore[], level: string): string {
  const sorted = [...dims].sort((a, b) => a.score - b.score);
  const weakest = sorted[0];
  const nextLevel = (parseFloat(level) + 0.5).toFixed(1);

  const adviceMap: Record<string, string> = {
    videoPerformance: `想从 ${level} 迈向 ${nextLevel}，优先提升底线稳定性和击球一致性，减少非受迫性失误。`,
    consistency: `想从 ${level} 迈向 ${nextLevel}，优先提升发球攻击性、接发质量和发球后衔接能力。`,
    serve: `想从 ${level} 迈向 ${nextLevel}，优先提升网前截击技术和上网时机的判断。`,
    matchExperience: `想从 ${level} 迈向 ${nextLevel}，优先提升战术执行力和关键分稳定性。`,
  };

  return adviceMap[weakest.dimension] || `想从 ${level} 迈向 ${nextLevel}，建议持续提升各项技术和比赛能力。`;
}

function getSuitableRange(level: string): string {
  const base = parseFloat(level) || 3.0;
  const low = Math.max(1.0, base - 0.5);
  const high = Math.min(7.0, base + 0.5);
  return `${low.toFixed(1)}-${high.toFixed(1)}`;
}

function getConfidenceLabel(confidence: number): string {
  if (confidence >= 90) return '高';
  if (confidence >= 80) return '较高';
  if (confidence >= 65) return '中';
  return '低';
}

// ── Self-assessment comparison (Q1 anchor vs tech skills) ──

function getSelfAssessmentComparison(_level: number, answers: RatingAnswer[]): string {
  const q1Anchor = getScore('q1', answers);
  const techAvg = getTechAverage(answers);
  const techNorm = 1 + ((techAvg - 1) / 3) * 4; // map 1-4 back to 1-5 scale

  const diff = q1Anchor - techNorm;
  if (Math.abs(diff) <= 0.3) {
    return '你的整体能力画像与技术能力表现基本一致。';
  } else if (diff > 0) {
    return '你的整体能力画像略高于技术细节表现，系统已综合两项给出预估。上传视频可获得更精准的评级。';
  } else {
    return '你的技术细节表现略高于整体画像，建议在下一题中更自信地评估。上传视频可辅助校准。';
  }
}

// ── Dimension scores (from question groupings) ──

function getDimensions(answers: RatingAnswer[]): DimensionScore[] {
  // Group questions into dimensions
  const baseline = avg(answers, ['q2', 'q3', 'q4']);       // 底线稳定性
  const serve = avg(answers, ['q7', 'q8']);                 // 发球+接发
  const net = getScore('q9', answers);                       // 网前
  const match = avg(answers, ['q11', 'q12']);               // 战术+比赛

  // Convert 1-4 scale to 0-100 with per-dimension offsets
  const adjustments: Record<string, number> = {
    videoPerformance: 11,
    consistency: -3,
    serve: -9,
    matchExperience: 5,
  };
  const comments: Record<string, (s: number) => string> = {
    videoPerformance: (s) => s >= 65 ? '良好：底线对拉动作稳定，击球点一致性较好。' : s >= 50 ? '一般：对拉中偶尔出现动作变形，需加强基本功。' : '有待提升：底线稳定性不足，建议多练习对墙击球。',
    consistency: (s) => s >= 65 ? '良好：一发有威胁，接发稳定。' : s >= 50 ? '一般：二发稳定性和接发深度是提升空间最大的环节。' : '有待提升：发球双误率偏高，建议重点练习发球和接发。',
    serve: (s) => s >= 65 ? '良好：能主动上网得分，截击落点精准。' : s >= 50 ? '一般：网前技术有待加强，建议增加网前训练。' : '有待提升：网前截击失误较多，建议从基础截击动作练起。',
    matchExperience: (s) => s >= 65 ? '具备一定战术意识和实战能力，关键分处理较好。' : s >= 50 ? '战术执行和比赛稳定性有待积累，建议多参加约球和比赛。' : '比赛经验不足，建议从练习赛开始积累战术意识。',
  };

  return [
    {
      dimension: 'videoPerformance',
      label: '底线稳定性',
      score: Math.min(100, Math.max(10, Math.round(10 + baseline * 18 + adjustments.videoPerformance))),
      comment: comments.videoPerformance(Math.round(10 + baseline * 18 + adjustments.videoPerformance)),
    },
    {
      dimension: 'consistency',
      label: '发球与接发',
      score: Math.min(100, Math.max(10, Math.round(10 + serve * 18 + adjustments.consistency))),
      comment: comments.consistency(Math.round(10 + serve * 18 + adjustments.consistency)),
    },
    {
      dimension: 'serve',
      label: '网前与截击',
      score: Math.min(100, Math.max(10, Math.round(10 + net * 18 + adjustments.serve))),
      comment: comments.serve(Math.round(10 + net * 18 + adjustments.serve)),
    },
    {
      dimension: 'matchExperience',
      label: '战术与比赛',
      score: Math.min(100, Math.max(10, Math.round(10 + match * 18 + adjustments.matchExperience))),
      comment: comments.matchExperience(Math.round(10 + match * 18 + adjustments.matchExperience)),
    },
  ];
}

function avg(answers: RatingAnswer[], qids: string[]): number {
  let sum = 0;
  for (const qid of qids) sum += getScore(qid, answers);
  return sum / qids.length;
}

// ── Style tags ──

function getStyleTags(answers: RatingAnswer[]): PlayStyleTag[] {
  const forehand = getScore('q3', answers);
  const backhand = getScore('q4', answers);
  const serve = getScore('q7', answers);
  const netPlay = getScore('q9', answers);
  const movement = getScore('q10', answers);
  const tactics = getScore('q11', answers);

  const candidates: { tag: PlayStyleTag; score: number }[] = [];

  if (forehand >= 3 && backhand >= 3) candidates.push({ tag: '底线型', score: (forehand + backhand) / 2 });
  if (forehand >= 3) candidates.push({ tag: '正手优先', score: forehand });
  if (backhand >= 3) candidates.push({ tag: '反手稳定', score: backhand });
  if (serve >= 3) candidates.push({ tag: '发球优先', score: serve });
  if (netPlay >= 3) candidates.push({ tag: '上网型', score: netPlay });
  if (serve >= 3 && netPlay >= 3) candidates.push({ tag: '发球上网型', score: (serve + netPlay) / 2 });
  if (movement >= 3) candidates.push({ tag: '防守型', score: movement });
  if (forehand >= 3 && backhand >= 3 && serve >= 3 && netPlay >= 3 && movement >= 3 && tactics >= 3) {
    candidates.push({ tag: '全面型', score: (forehand + backhand + serve + netPlay + movement + tactics) / 6 });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, 3).map(c => c.tag);
}

// ── Main export ──

export function mockRatingResult(
  answers: RatingAnswer[],
  ratingType: RatingType = 'questionnaire_estimate',
): RatingResult {
  const rawLevel = calculateFinalLevel(answers);
  const level = snapToHalfLevel(rawLevel);

  // Confidence: based on rating type + answer consistency
  const techAvg = getTechAverage(answers);
  const answerVariance = (() => {
    const qids = ['q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12'];
    let sumSq = 0;
    for (const qid of qids) {
      const s = getScore(qid, answers);
      sumSq += (s - techAvg) ** 2;
    }
    return Math.sqrt(sumSq / qids.length); // 0-1.5 range
  })();
  // More consistent answers = higher confidence
  const consistencyBonus = Math.round((1.5 - answerVariance) * 4);

  const baseConfidence: Record<RatingType, number> = {
    questionnaire_estimate: 67,
    video_enhanced: 82,
    peer_verified: 78,
    coach_verified: 92,
  };
  const confidence = Math.min(95, baseConfidence[ratingType] + consistencyBonus);

  const ntrpData = getNtrpLevel(level);
  const persona = ntrpData
    ? `${ntrpData.label}：${ntrpData.shortDescription} ${ntrpData.characteristics.overall}`
    : `${getLevelName(level)}，${getSuitableRange(level)}区间选手。`;

  const nextLevel = Math.min(7.0, parseFloat(level) + 0.5).toFixed(1);
  const nextData = getNtrpLevel(nextLevel);

  const dimsResult = getDimensions(answers);

  const result: RatingResult = {
    ratingType,
    aiEstimatedLevel: level,
    levelName: getLevelName(level),
    suitableRange: getSuitableRange(level),
    confidence,
    confidenceLabel: getConfidenceLabel(confidence),
    styleTags: getStyleTags(answers),
    dimensions: dimsResult,
    nextLevelTarget: nextLevel,
    nextLevelAdvice: nextData ? nextData.nextGoal : `向参考 NTRP ${nextLevel} 迈进，持续提升各项技术。`,
    persona,
    selfAssessmentComparison: getSelfAssessmentComparison(rawLevel, answers),
    nickname: getLevelNickname(level),
    socialComment: getSocialComment(level, dimsResult),
    strengths: getStrengths(dimsResult),
    focusArea: getFocusArea(dimsResult, level),
    generatedAt: new Date().toISOString(),
  };

  if (ratingType === 'video_enhanced') {
    const qRawLevel = calculateQuestionnaireOnlyLevel(answers);
    const qLevel = snapToHalfLevel(qRawLevel);
    result.questionnaireLevel = qLevel;
    result.adjustmentReason = '当前内测阶段，视频增强评级为演示功能，正式版将基于视频抽帧和模型分析生成。';
  }

  return result;
}

function calculateQuestionnaireOnlyLevel(answers: RatingAnswer[]): number {
  return calculateFinalLevel(answers);
}

// Re-export for demo use
export { getScore, getTechAverage, calculateFinalLevel };
