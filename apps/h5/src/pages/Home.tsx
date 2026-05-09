import { useApp } from '../store';

export function Home() {
  const { startRating, goTo } = useApp();

  return (
    <div className="page fade-in">
      <div className="home-hero">
        <div className="home-brand-en">TennisLV</div>
        <div className="home-brand-cn">业余网球评级</div>
        <div className="home-title">测一测你的网球水平</div>
        <div className="home-subtitle">参考 NTRP 能力描述，看看你是 2.5、3.0 还是 3.5。</div>
        <div className="home-desc">
          完成 12 道题，可选上传视频，生成你的 AI 预估业余网球评级。
        </div>

        <div className="home-preview">
          <div className="home-pv-label">示例评级卡</div>
          <div className="home-pv-level">3.0</div>
          <div className="home-pv-nickname">业余中级球友</div>
          <div className="home-pv-range">参考 NTRP 风格等级 · 适合约球：2.5-3.5</div>
          <div className="home-pv-tags">
            <span className="home-pv-tag">底线型</span>
            <span className="home-pv-tag">正手优先</span>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <button className="btn btn-primary" onClick={startRating}>
            开始评级
          </button>
          <div className="helper-text" style={{ marginTop: 12 }}>
            测完生成评级卡，发给球友认证：偏低 / 准 / 偏高
          </div>
        </div>
      </div>

      <div className="home-footer">
        当前为 TennisLV 内测版，评级结果仅供约球和社交参考。
      </div>

      <div style={{ textAlign: 'center', padding: '4px 0 16px' }}>
        <span className="text-link" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => goTo('standard')}>评级标准</span>
        <span className="text-link" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => goTo('privacy')}>隐私政策</span>
        <span className="text-link" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => goTo('terms')}>服务条款</span>
        <span className="text-link" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => goTo('disclaimer')}>免责声明</span>
      </div>
    </div>
  );
}
