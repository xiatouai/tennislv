import { useApp } from '../store';

function QRCode() {
  return (
    <svg viewBox="0 0 80 80" width="64" height="64">
      <rect width="80" height="80" fill="#f5f5f5" />
      <rect x="8" y="8" width="24" height="24" rx="2" fill="#333" />
      <rect x="12" y="12" width="16" height="16" rx="1" fill="#fff" />
      <rect x="16" y="16" width="8" height="8" fill="#333" />
      <rect x="48" y="8" width="24" height="24" rx="2" fill="#333" />
      <rect x="52" y="12" width="16" height="16" rx="1" fill="#fff" />
      <rect x="56" y="16" width="8" height="8" fill="#333" />
      <rect x="8" y="48" width="24" height="24" rx="2" fill="#333" />
      <rect x="12" y="52" width="16" height="16" rx="1" fill="#fff" />
      <rect x="16" y="56" width="8" height="8" fill="#333" />
      <circle cx="40" cy="40" r="4" fill="#333" />
    </svg>
  );
}

export function ShareCard() {
  const { state, goTo } = useApp();
  const r = state.ratingResult;
  if (!r) return null;

  return (
    <div className="page page-safe fade-in" style={{ paddingBottom: 40 }}>
      {/* 身份卡 */}
      <div className="sc-card">
        <div className="sc-header">
          <div className="sc-brand">TennisLV</div>
          <div className="sc-badge">业余网球评级卡</div>
          <div style={{ fontSize: 13, color: 'var(--t3)', marginTop: 4 }}>我的业余网球评级</div>
        </div>

        <div className="sc-level-row">
          <div className="sc-level">{r.aiEstimatedLevel}</div>
          <div className="sc-nickname">{r.nickname}</div>
          <div className="sc-ntrp-label">参考 NTRP 风格等级</div>
        </div>

        <div className="sc-comment">{r.socialComment}</div>

        <div className="sc-info">
          <div className="sc-info-row">
            <span className="sc-info-label">适合约球</span>
            <span>{r.suitableRange}</span>
          </div>
          <div className="sc-info-row">
            <span className="sc-info-label">球风标签</span>
            <span>{r.styleTags.join(' / ')}</span>
          </div>
        </div>

        <div className="sc-tags">
          {r.styleTags.map(t => (
            <span key={t} className="sc-tag">{t}</span>
          ))}
        </div>

        <div className="sc-cta">你也来测测你是几级网球选手？</div>
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--t2)', padding: '6px 0 2px' }}>
          发给球友认证：偏低 / 准 / 偏高
        </div>

        <div className="sc-qr">
          <QRCode />
          <span className="sc-qr-hint">扫码生成你的业余网球评级卡</span>
        </div>

        <div className="sc-footer">
          tennislv.app · AI 预估评级，非官方 NTRP / UTR 评级
        </div>
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
