import { useApp } from '../store';

export function Disclaimer() {
  const { goTo } = useApp();

  return (
    <div className="page page-safe fade-in">
      <div className="page-title" style={{ marginBottom: 4 }}>免责声明</div>
      <div className="helper-text" style={{ marginBottom: 20 }}>请仔细阅读以下声明</div>

      <div className="card" style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.8 }}>
        <div style={{ fontWeight: 600, color: 'var(--t)', margin: '0 0 4px' }}>一、评级性质</div>
        <p style={{ marginBottom: 12 }}>
          TennisLV 提供的业余网球评级是基于用户自评问卷和（如提供）视频分析的 AI 预估结果。该评级<strong>不等同于</strong> USTA 官方 NTRP（National Tennis Rating Program）、UTR（Universal Tennis Rating）或任何赛事组织发布的官方评级。
        </p>

        <div style={{ fontWeight: 600, color: 'var(--t)', margin: '12px 0 4px' }}>二、评级准确性</div>
        <p style={{ marginBottom: 12 }}>
          评级结果依赖用户自评的准确性。如果用户在问卷中提供的信息与实际情况存在偏差，评级结果可能偏高或偏低。本服务不对评级结果的准确性、可靠性或适用性作任何明示或暗示的保证。
        </p>

        <div style={{ fontWeight: 600, color: 'var(--t)', margin: '12px 0 4px' }}>三、使用限制</div>
        <p style={{ marginBottom: 12 }}>
          本评级仅供个人参考和娱乐用途。请勿将本评级作为以下用途的依据：
        </p>
        <p>· 赛事报名或资格认定</p>
        <p>· 教练评级或资质评定</p>
        <p>· 任何涉及排名、选拔或竞技资格的场合</p>

        <div style={{ fontWeight: 600, color: 'var(--t)', margin: '12px 0 4px' }}>四、责任限制</div>
        <p style={{ marginBottom: 12 }}>
          在适用法律允许的最大范围内，TennisLV 及其开发者不对因使用或依赖本评级结果而产生的任何直接或间接损失承担责任，包括但不限于因约球、比赛或社交活动产生的争议或损失。
        </p>

        <div style={{ fontWeight: 600, color: 'var(--t)', margin: '12px 0 4px' }}>五、第三方参考</div>
        <p style={{ marginBottom: 12 }}>
          本服务引用的 NTRP 能力描述来自公开信息，仅供学习参考。USTA 和 NTRP 为美国网球协会的注册商标。TennisLV 与 USTA 无任何关联、认可或赞助关系。
        </p>

        <div style={{ fontWeight: 600, color: 'var(--t)', margin: '12px 0 4px' }}>六、内测阶段说明</div>
        <p style={{ marginBottom: 12 }}>
          当前 TennisLV 处于内测阶段（v0.1）。视频增强评级为演示功能，评级算法仍在持续优化中。内测期间的数据将用于产品改进。
        </p>
      </div>

      <div className="text-link" onClick={() => goTo('home')}>
        ← 返回首页
      </div>
    </div>
  );
}
