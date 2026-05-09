import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
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
  const posterRef = useRef<HTMLDivElement>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!posterRef.current || imgUrl) return;

    html2canvas(posterRef.current, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    }).then(canvas => {
      setImgUrl(canvas.toDataURL('image/png'));
    }).catch(() => {
      // fallback: show the HTML poster
    });
  }, [imgUrl]);

  if (!r) return null;

  const posterContent = (
    <div className="poster" ref={posterRef}>
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

      <div className="ps-court">
        <div className="ps-court-cn">"{r.courtMessage}"</div>
        <div className="ps-court-en">{r.courtMessageEn}</div>
      </div>

      <div className="ps-footer">
        <div className="ps-cta">我测出来是 {r.aiEstimatedLevel}，你觉得准吗？</div>
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
  );

  return (
    <div className="poster-page fade-in">
      <button className="ps-close" onClick={() => goTo('share')}>✕</button>

      {/* Hidden template for html2canvas — always rendered first */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        {posterContent}
      </div>

      {/* Display: image (long-press saveable) or fallback to HTML */}
      <div style={{ padding: '20px 0' }}>
        {imgUrl ? (
          <>
            <img
              src={imgUrl}
              alt="TennisLV 业余网球评级海报"
              style={{ width: 375, display: 'block', borderRadius: 8 }}
            />
            <div className="ps-save-hint">长按图片保存海报</div>
          </>
        ) : (
          <>
            {posterContent}
            <div className="ps-save-hint">长按或截图保存海报</div>
          </>
        )}
      </div>
    </div>
  );
}
