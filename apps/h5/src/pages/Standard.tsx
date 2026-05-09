import { useApp } from '../store';

const STANDARDS = [
  {
    level: '1.0-1.5',
    label: '初学入门 / 基础练习',
    traits: '正在学习基本规则、握拍和挥拍动作；能偶尔把球打过网，对打稳定性较弱。',
    serve: '发球动作尚在建立中，双误较多。',
    rally: '很少能连续对打超过 3 拍。',
    match: '尚未具备比赛能力，主要以练习为主。',
  },
  {
    level: '2.0-2.5',
    label: '基础建立期 / 初级进阶级',
    traits: '能进行基本对打，开始理解站位和击球选择；已能维持短回合，但控制节奏、深度和落点的能力有限。',
    serve: '一发成功率一般，二发以稳妥为主。',
    rally: '偶尔能对打 5-8 拍，方向和落点控制有限。',
    match: '开始接触简单比赛，但战术意识较薄弱。',
  },
  {
    level: '3.0-3.5',
    label: '中级 / 中级稳定',
    traits: '能稳定进行底线来回，具备基本发球和比赛能力；技术基本成熟，能执行多种击球，开始使用简单战术。',
    serve: '一发有一定威胁，二发较稳定。',
    rally: '通常能对打 10 拍以上，能控制基本方向。',
    match: '具备基本比赛能力，关键分处理仍在提升中。',
  },
  {
    level: '4.0-4.5',
    label: '中高级 / 高级入门',
    traits: '能打出有战术意图的网球；技术全面，体能良好，战术成熟，能在中高水平业余比赛中形成竞争力。',
    serve: '一发威力强，二发有旋转和落点变化。',
    rally: '能稳定对打 15 拍以上，按意图控制落点。',
    match: '战术执行较稳定，能根据对手弱点调整策略。',
  },
  {
    level: '5.0-5.5',
    label: '高级 / 准专业级',
    traits: '技术、脚步和心理成熟，比赛经验丰富，能稳定控制高强度比赛节奏。',
    serve: '发球是得分武器，一发和二发都有多样性。',
    rally: '多拍对抗中能主导节奏，控制比赛走向。',
    match: '战术成熟，能在压力下保持高水平发挥。',
  },
  {
    level: '6.0-7.0',
    label: '专业级 / 专业高级 / 精英级',
    traits: '具备专业级竞技水平，技术完备，体能卓越；在业余赛事中极具竞争力，接近或达到专业选手水平。',
    serve: '发球全面且稳定，具备职业级发球能力。',
    rally: '能在高速对抗中保持落点精准和战术执行。',
    match: '比赛阅读能力强，心理素质过硬。',
  },
];

export function Standard() {
  const { goTo } = useApp();

  return (
    <div className="page page-safe fade-in">
      <div className="page-title" style={{ marginBottom: 4 }}>NTRP 风格评级标准</div>
      <div className="helper-text" style={{ marginBottom: 20 }}>
        TennisLV 评级参考 NTRP（National Tennis Rating Program）能力描述生成，将网球水平划分为 1.0-7.0 共 13 个半级。
        以下为各等级的核心参考标准。
      </div>

      {STANDARDS.map(s => (
        <div key={s.level} className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--g)', marginBottom: 2 }}>
            {s.level}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t)', marginBottom: 8 }}>
            {s.label}
          </div>
          <div style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.6, marginBottom: 8 }}>
            {s.traits}
          </div>
          <div style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.6 }}>
            <div>发球：{s.serve}</div>
            <div>相持：{s.rally}</div>
            <div>比赛：{s.match}</div>
          </div>
        </div>
      ))}

      <div className="home-footer" style={{ marginTop: 16 }}>
        本评级参考 NTRP 能力描述生成，不等同于 USTA 官方 NTRP、UTR 或赛事评级。
      </div>

      <div className="text-link" onClick={() => goTo('home')}>
        ← 返回首页
      </div>
    </div>
  );
}
