import { useApp } from '../store';

export function Privacy() {
  const { goTo } = useApp();

  return (
    <div className="page page-safe fade-in">
      <div className="page-title" style={{ marginBottom: 4 }}>隐私政策</div>
      <div className="helper-text" style={{ marginBottom: 20 }}>最后更新日期：2026 年 5 月</div>

      <div className="card" style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.8 }}>
        <p style={{ marginBottom: 12 }}>TennisLV（以下简称"我们"）重视你的隐私。本隐私政策说明我们如何收集、使用和保护你的个人信息。</p>

        <div style={{ fontWeight: 600, color: 'var(--t)', margin: '12px 0 4px' }}>一、我们收集的信息</div>
        <p>· 你在问卷中填写的网球能力自评数据</p>
        <p>· 你上传的视频文件（如选择上传）</p>
        <p>· 设备基础信息（浏览器类型、屏幕分辨率等）</p>

        <div style={{ fontWeight: 600, color: 'var(--t)', margin: '12px 0 4px' }}>二、信息的使用</div>
        <p>· 生成你的业余网球评级结果</p>
        <p>· 优化和改进评级算法</p>
        <p>· 内测阶段，数据仅用于产品改进，不会对外公开</p>

        <div style={{ fontWeight: 600, color: 'var(--t)', margin: '12px 0 4px' }}>三、信息的存储与安全</div>
        <p>· 你的数据存储于安全的云服务器</p>
        <p>· 我们采取合理的技术手段保护你的数据安全</p>
        <p>· 视频文件经处理后将在合理期限内删除</p>

        <div style={{ fontWeight: 600, color: 'var(--t)', margin: '12px 0 4px' }}>四、你的权利</div>
        <p>· 你可以随时请求删除你的个人数据</p>
        <p>· 如有隐私相关问题，可通过应用内渠道联系我们</p>

        <div style={{ fontWeight: 600, color: 'var(--t)', margin: '12px 0 4px' }}>五、政策更新</div>
        <p>我们可能会不定期更新本隐私政策，更新后的政策将在应用内公布。</p>
      </div>

      <div className="text-link" onClick={() => goTo('home')}>
        ← 返回首页
      </div>
    </div>
  );
}
