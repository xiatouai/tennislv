import { useApp } from '../store';

export function ShareCard() {
  const { state, goTo } = useApp();
  const r = state.ratingResult;
  if (!r) return null;

  return (
    <div className="page page-safe fade-in" style={{ paddingBottom: 40 }}>
      {/* 身份卡 */}
      <div className="sc-card">
        {/* Header */}
        <div className="sc-header">
          <div className="sc-brand">TennisLV</div>
          <div className="sc-badge">业余网球评级卡</div>
          <div className="sc-subtitle">我的业余网球评级</div>
        </div>

        {/* Level */}
        <div className="sc-level-row">
          <div className="sc-level">{r.aiEstimatedLevel}</div>
          <div className="sc-nickname">{r.nickname}</div>
          <div className="sc-ntrp-label">参考 NTRP 风格等级</div>
        </div>

        {/* 适合约球 */}
        <div className="sc-range-row">
          <span className="sc-range-label">适合约球</span>
          <span className="sc-range-value">{r.suitableRange}</span>
        </div>

        {/* 球场寄语 */}
        <div className="sc-court">
          <div className="sc-court-cn">"{r.courtMessage}"</div>
          <div className="sc-court-en">{r.courtMessageEn}</div>
        </div>

        {/* CTA */}
        <div className="sc-cta">我测出来是 {r.aiEstimatedLevel}，你觉得准吗？</div>
        <div className="sc-domain">tennislv.app</div>
      </div>

      <div className="r-actions" style={{ marginTop: 12 }}>
        <div className="helper-text" style={{ textAlign: 'center', marginBottom: 10 }}>
          点击右上角 ··· 分享给球友或朋友圈
        </div>
        <button className="btn btn-primary" onClick={() => goTo('poster')}>
          分享海报
        </button>
        <button className="btn btn-outline" onClick={() => goTo('verify')} style={{ marginTop: 8 }}>
          邀请球友认证
        </button>
        <div className="text-link" onClick={() => goTo('result')}>
          ← 返回评级结果
        </div>
      </div>
    </div>
  );
}
