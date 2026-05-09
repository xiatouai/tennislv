import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import QRCodeLib from 'qrcode';
import { useApp } from '../store';

function QRCodeImg({ onLoad }: { onLoad: () => void }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    QRCodeLib.toDataURL('https://tennislv.app', {
      width: 120,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    }).then(url => {
      setSrc(url);
      // onLoad called after React commits the img to DOM
      setTimeout(onLoad, 100);
    }).catch(() => { /* fallback */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!src) return null;
  return <img src={src} width="52" height="52" alt="扫码测测你的业余网球评级" crossOrigin="anonymous" />;
}

export function Poster() {
  const { state, goTo } = useApp();
  const r = state.ratingResult;
  const posterRef = useRef<HTMLDivElement>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [qrReady, setQrReady] = useState(false);

  useEffect(() => {
    if (!posterRef.current || !qrReady || imgUrl) return;

    html2canvas(posterRef.current, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    }).then(canvas => {
      setImgUrl(canvas.toDataURL('image/png'));
    }).catch(() => {
      // fallback: show the HTML poster
    });
  }, [qrReady, imgUrl]);

  if (!r) return null;

  const posterContent = (
    <div className="poster" ref={posterRef}>
      {/* Decorative circles */}
      <div className="ps-deco ps-deco-1" />
      <div className="ps-deco ps-deco-2" />

      {/* Brand header */}
      <div className="ps-top">
        <div className="ps-brand">TennisLV</div>
        <div className="ps-badge">业余网球评级卡</div>
      </div>

      {/* Level — the dominant visual element */}
      <div className="ps-level-area">
        <div className="ps-level">{r.aiEstimatedLevel}</div>
        <div className="ps-nickname">{r.nickname}</div>
        <div className="ps-ntrp-label">参考 NTRP 风格等级</div>
        <div className="ps-range">适合约球：{r.suitableRange}</div>
      </div>

      {/* 球场寄语 — serif fonts, main emotional element */}
      <div className="ps-court">
        <div className="ps-court-cn">「{r.courtMessage}」</div>
        <div className="ps-court-en">{r.courtMessageEn}</div>
      </div>

      {/* Footer */}
      <div className="ps-footer">
        <div className="ps-qr-area">
          <div className="ps-qr"><QRCodeImg onLoad={() => setQrReady(true)} /></div>
          <span className="ps-qr-hint">扫码测测你的<br/>业余网球评级</span>
        </div>
        <div className="ps-url">tennislv.app</div>
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
