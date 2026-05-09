import { useState } from 'react';
import { NTRP_LEVELS } from '@tennis/shared';
import { useApp } from '../store';

const TYPE_LABELS: Record<string, string> = {
  questionnaire_estimate: '问卷预估',
  video_enhanced: '视频增强',
  peer_verified: '球友认证',
  coach_verified: '教练认证',
};

const DESC_MAP: Record<string, string> = {
  questionnaire_estimate:
    '本评级为 TennisLV 基于问卷生成的 AI 预估等级，不等同于 USTA 官方 NTRP、UTR 或赛事评级。上传视频可获得更准确的视频增强评级。',
  video_enhanced:
    '本评级为 TennisLV 基于问卷和视频分析生成的 AI 预估等级，不等同于 USTA 官方 NTRP、UTR 或赛事评级。邀请球友认证可进一步提升可信度。',
  peer_verified:
    '本评级已获得球友认证，结合问卷和球友反馈生成，不等同于 USTA 官方 NTRP、UTR 或赛事评级。',
  coach_verified:
    '本评级已获教练认证，不等同于 USTA 官方 NTRP、UTR 或赛事评级。',
};

function scoreLabel(s: number): { label: string; cls: string } {
  if (s >= 85) return { label: '较强', cls: 'strong' };
  if (s >= 70) return { label: '中级', cls: 'mid' };
  if (s >= 50) return { label: '初级', cls: 'basic' };
  return { label: '入门', cls: 'entry' };
}

export function Result() {
  const { state, goTo, resetAll } = useApp();
  const r = state.ratingResult;
  const [showDetail, setShowDetail] = useState(false);
  if (!r) return null;

  const nextData = NTRP_LEVELS.find(l => l.level === r.nextLevelTarget);

  return (
    <div className="page page-safe fade-in">
      {/* Hero — 评级卡 */}
      <div className="r-hero">
        <div className="r-type-badge">{TYPE_LABELS[r.ratingType] || '问卷预估'}</div>
        <div className="r-ntrp-label">你的业余网球评级</div>
        <div className="r-level">{r.aiEstimatedLevel}</div>
        <div className="r-nickname">{r.nickname}</div>
        <div className="r-ntrp-label">参考 NTRP 风格等级</div>
        <div className="r-range">适合约球范围：{r.suitableRange}</div>
      </div>

      {/* 一句话点评 */}
      <div className="r-social">{r.socialComment}</div>

      {/* 球风标签 */}
      <div className="r-tags">
        {r.styleTags.map(t => (
          <span key={t} className="r-tag">{t}</span>
        ))}
      </div>

      {/* 你的优势 */}
      {r.strengths.length > 0 && (
        <div className="r-strength">
          <div className="r-strength-label">你的优势</div>
          {r.strengths.map((s, i) => (
            <div key={i} className="r-strength-item">{s}</div>
          ))}
        </div>
      )}

      {/* 当前提升重点 */}
      <div className="r-focus">
        <div className="r-focus-label">当前提升重点</div>
        <div className="r-focus-text">{r.focusArea}</div>
      </div>

      {/* 下一等级目标 */}
      <div className="r-next">
        <div className="r-next-title">
          下一等级目标：参考 NTRP {r.nextLevelTarget}
          {nextData ? `（${nextData.label}）` : ''}
        </div>
        <div className="r-next-text">{r.nextLevelAdvice}</div>
      </div>

      {/* 视频增强对比 */}
      {r.ratingType === 'video_enhanced' && r.questionnaireLevel && (
        <div className="card" style={{ marginTop: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>问卷预估 vs 视频增强</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--t3)' }}>问卷预估</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--t2)' }}>{r.questionnaireLevel}</div>
            </div>
            <div style={{ color: 'var(--g)', fontSize: 20, lineHeight: '56px' }}>→</div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--g)' }}>视频增强</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--g)' }}>{r.aiEstimatedLevel}</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.5 }}>{r.adjustmentReason}</div>
        </div>
      )}

      {/* 置信度提示 */}
      {r.ratingType === 'questionnaire_estimate' && (
        <div className="r-conf-hint">
          上传视频或邀请球友认证后，可提升评级置信度。
        </div>
      )}

      {/* 查看详细技术分析 */}
      <button
        className="r-detail-toggle"
        onClick={() => setShowDetail(!showDetail)}
      >
        查看详细技术分析
        <span className={`r-detail-arrow${showDetail ? ' open' : ''}`}>▾</span>
      </button>

      <div className={`r-detail${showDetail ? ' open' : ''}`}>
        {r.dimensions.map(d => {
          const sl = scoreLabel(d.score);
          return (
            <div key={d.dimension} className="r-dim">
              <div className="r-dim-header">
                <span className="r-dim-label">{d.label}</span>
                <span className={`r-dim-score ${sl.cls}`}>{d.score}/100 {sl.label}</span>
              </div>
              <div className="r-dim-bar">
                <div className="r-dim-bar-fill" style={{ width: `${d.score}%` }} />
              </div>
              <div className="r-dim-comment">{d.comment}</div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="r-rating-desc">
        {DESC_MAP[r.ratingType] || DESC_MAP.questionnaire_estimate}
      </div>

      {/* Actions */}
      <div className="r-actions">
        <button className="btn btn-primary" onClick={() => goTo('share')}>
          生成分享卡
        </button>
        <button className="btn btn-outline" onClick={() => goTo('verify')}>
          邀请球友认证
        </button>
        {r.ratingType === 'questionnaire_estimate' && (
          <div className="text-link" onClick={() => goTo('video')}>
            上传视频提升置信度
          </div>
        )}
        <div className="text-link" onClick={resetAll}>
          重新评级
        </div>
        <div className="text-link" onClick={() => goTo('feedback')}>
          反馈评级是否准确
        </div>
      </div>
    </div>
  );
}
