import { useApp } from '../store';

function QRCode() {
  return (
    <svg viewBox="0 0 56 56" width="44" height="44">
      <rect width="56" height="56" fill="#fff" />
      <rect x="5" y="5" width="18" height="18" rx="2" fill="#333" />
      <rect x="8" y="8" width="12" height="12" rx="1" fill="#fff" />
      <rect x="11" y="11" width="6" height="6" fill="#333" />
      <rect x="33" y="5" width="18" height="18" rx="2" fill="#333" />
      <rect x="36" y="8" width="12" height="12" rx="1" fill="#fff" />
      <rect x="39" y="11" width="6" height="6" fill="#333" />
      <rect x="5" y="33" width="18" height="18" rx="2" fill="#333" />
      <rect x="8" y="36" width="12" height="12" rx="1" fill="#fff" />
      <rect x="11" y="39" width="6" height="6" fill="#333" />
      <circle cx="28" cy="28" r="3" fill="#333" />
    </svg>
  );
}

export function Poster() {
  const { state, goTo } = useApp();
  const r = state.ratingResult;
  if (!r) return null;

  return (
    <div className="poster-page fade-in">
      <button className="ps-close" onClick={() => goTo('share')}>✕</button>

      <div className="poster">
        <div className="ps-top">
          <div className="ps-brand">TennisLV</div>
          <div className="ps-cn">业余网球评级</div>
        </div>

        <div className="ps-level-area">
          <div className="ps-level">{r.aiEstimatedLevel}</div>
          <div className="ps-nickname">{r.nickname}</div>
          <div className="ps-ntrp-label">参考 NTRP 风格等级</div>
          <div className="ps-range">适合约球：{r.suitableRange}</div>
        </div>

        <div className="ps-tags">
          {r.styleTags.map(t => (
            <span key={t} className="ps-tag">{t}</span>
          ))}
        </div>

        <div className="ps-comment">{r.socialComment}</div>

        <div className="ps-footer">
          <div className="ps-cta">你也来测测你是几级网球选手？</div>
          <div className="ps-url">tennislv.app</div>
          <div className="ps-qr-area">
            <div className="ps-qr"><QRCode /></div>
            <span className="ps-qr-hint">扫码生成你的业余网球评级卡</span>
          </div>
        </div>

        <div className="ps-disclaimer">
          本评级参考 NTRP 能力描述生成，不等同于 USTA 官方 NTRP、UTR 或赛事评级。
        </div>
      </div>

      <div className="ps-save-hint">长按或截图保存海报</div>
    </div>
  );
}
