import { useApp } from '../store';

export function Feedback() {
  const { goTo } = useApp();

  return (
    <div className="page page-safe fade-in">
      <div className="page-title" style={{ marginBottom: 4 }}>内测反馈</div>
      <div className="helper-text" style={{ marginBottom: 20 }}>
        感谢参与 TennisLV 内测。请复制以下问题，通过微信或群聊发送给我。
      </div>

      <div className="card" style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 2 }}>
        <div style={{ fontWeight: 600, color: 'var(--t)', marginBottom: 8 }}>反馈问题：</div>
        <p>1. 你测出来的评级是多少？符合你的预期吗？</p>
        <p>2. 有没有哪道题不好判断或犹豫？（如 Q3 正手）</p>
        <p>3. 结果偏高、偏低，还是差不多？</p>
        <p>4. 是否愿意用这个等级约球？</p>
        <p>5. 是否愿意把评级卡发给球友看看？</p>
        <p>6. 其他建议或意见。</p>
      </div>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 4 }}>微信/群聊发送给开发者</div>
      </div>

      <div style={{ marginTop: 16 }}>
        <button className="btn btn-outline" onClick={() => goTo('result')}>
          返回评级结果
        </button>
      </div>

      <div className="text-link" onClick={() => goTo('home')}>
        ← 返回首页
      </div>
    </div>
  );
}
