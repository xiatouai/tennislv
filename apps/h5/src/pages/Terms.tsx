import { useApp } from '../store';

export function Terms() {
  const { goTo } = useApp();

  return (
    <div className="page page-safe fade-in">
      <div className="page-title" style={{ marginBottom: 4 }}>服务条款</div>
      <div className="helper-text" style={{ marginBottom: 20 }}>最后更新日期：2026 年 5 月</div>

      <div className="card" style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.8 }}>
        <p style={{ marginBottom: 12 }}>欢迎使用 TennisLV（以下简称"本服务"）。使用本服务即表示你同意以下条款。如果你不同意这些条款，请勿使用本服务。</p>

        <div style={{ fontWeight: 600, color: 'var(--t)', margin: '12px 0 4px' }}>一、服务说明</div>
        <p>TennisLV 提供基于问卷和视频分析的业余网球水平评级服务。评级结果仅供参考，不等同于 USTA 官方 NTRP、UTR 或任何赛事评级。</p>

        <div style={{ fontWeight: 600, color: 'var(--t)', margin: '12px 0 4px' }}>二、用户责任</div>
        <p>· 你应如实填写问卷，提供真实的网球能力信息</p>
        <p>· 你上传的视频应符合内容规范，不得包含违法或不当内容</p>
        <p>· 你应妥善保管你的评级卡和分享链接</p>

        <div style={{ fontWeight: 600, color: 'var(--t)', margin: '12px 0 4px' }}>三、免责声明</div>
        <p>· 本服务的评级结果由算法生成，可能存在偏差</p>
        <p>· 我们不保证评级结果在任何场景下的准确性和适用性</p>
        <p>· 本服务不对因使用评级结果而产生的任何争议或损失承担责任</p>

        <div style={{ fontWeight: 600, color: 'var(--t)', margin: '12px 0 4px' }}>四、服务变更与终止</div>
        <p>我们保留随时修改或终止服务的权利，重要变更将在应用内通知。</p>

        <div style={{ fontWeight: 600, color: 'var(--t)', margin: '12px 0 4px' }}>五、知识产权</div>
        <p>TennisLV 的名称、标识、评级算法和相关技术均为我们的知识产权。用户生成的评级卡可供个人分享使用。</p>
      </div>

      <div className="text-link" onClick={() => goTo('home')}>
        ← 返回首页
      </div>
    </div>
  );
}
