import { useApp } from '../store';

function shareLink() {
  if (navigator.share) {
    navigator.share({
      title: 'TennisLV｜业余网球评级',
      text: '测一测你的网球水平，看看你是 2.5、3.0 还是 3.5',
      url: 'https://tennislv.app',
    }).catch(() => { /* user cancelled */ });
  } else {
    // Fallback for WeChat: prompt user to tap the ··· menu
    alert('请点击右上角 ··· 分享给好友');
  }
}

export function ShareCard() {
  const { state, goTo, resetAll } = useApp();
  const r = state.ratingResult;
  if (!r) return null;

  return (
    <div className="page page-safe fade-in" style={{ paddingBottom: 40 }}>
      {/* 身份卡预览 */}
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
          <div className="sc-court-cn">「{r.courtMessage}」</div>
          <div className="sc-court-en">{r.courtMessageEn}</div>
        </div>

        {/* CTA */}
        <div className="sc-cta">发给球友认证：偏低 / 准 / 偏高</div>
        <div className="sc-domain">tennislv.app</div>
      </div>

      {/* Share actions */}
      <div className="r-actions" style={{ marginTop: 12 }}>
        <button className="btn btn-primary" onClick={shareLink}>
          分享链接给好友
        </button>
        <div className="share-action-desc">
          好友点击链接可直接打开 TennisLV 测试页面。
        </div>

        <button className="btn btn-outline" onClick={() => goTo('poster')} style={{ marginTop: 12 }}>
          生成分享海报
        </button>
        <div className="share-action-desc">
          适合保存图片后发朋友圈或微信群；海报中会显示 tennislv.app 和二维码入口。
        </div>

        <div className="share-wechat-hint">
          微信右上角分享会发送链接卡片；如需发图，请使用「生成分享海报」。
        </div>
      </div>

      {/* Secondary actions */}
      <div style={{ marginTop: 16 }}>
        <button className="btn btn-outline" onClick={() => goTo('verify')}>
          球友认证
        </button>
        <div className="text-link" onClick={resetAll}>
          重新测一次
        </div>
        <div className="text-link" onClick={() => goTo('result')}>
          ← 返回评级结果
        </div>
      </div>
    </div>
  );
}
