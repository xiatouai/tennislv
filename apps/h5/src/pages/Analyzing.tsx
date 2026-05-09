import { useEffect, useState } from 'react';

const STEPS = ['分析能力画像', '匹配 NTRP 维度', '计算综合评级', '生成评级卡'];
const STATUSES = ['分析能力画像...', '匹配 NTRP 维度...', '计算综合评级...', '生成评级卡...'];

export function Analyzing() {
  const [done, setDone] = useState(0);

  useEffect(() => {
    setDone(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, i) => {
      if (i > 0) {
        timers.push(setTimeout(() => setDone(i), (i - 1) * 500 + 300));
      }
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const title = '正在生成你的业余网球评级';

  return (
    <div className="page fade-in">
      <div className="az-area">
        <div className="az-spinner" />
        <div className="az-title">{title}</div>
        <div className="az-sub">{STATUSES[done] || '评级完成'}</div>
      </div>
      <ul className="az-steps">
        {STEPS.map((s, i) => (
          <li key={i} className={`az-step${i <= done ? ' done' : ''}`}>
            <span className="az-dot" />
            {s}
          </li>
        ))}
      </ul>

      <div className="home-footer" style={{ marginTop: 24 }}>
        本评级参考 NTRP 能力描述生成，不等同于 USTA 官方 NTRP、UTR 或赛事评级。
      </div>
    </div>
  );
}
