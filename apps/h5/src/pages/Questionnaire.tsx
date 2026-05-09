import { RATING_QUESTIONS } from '@tennis/shared';
import { useApp } from '../store';

export function Questionnaire() {
  const { state, setAnswer, nextQ, prevQ, goTo, toast } = useApp();
  const q = RATING_QUESTIONS[state.currentQ];
  const prev = state.answers.find(a => a.questionId === q.id);
  const isLast = state.currentQ === RATING_QUESTIONS.length - 1;
  const isFirst = state.currentQ === 0;
  const answeredCount = state.answers.length;
  const totalCount = RATING_QUESTIONS.length;
  const progressPct = ((state.currentQ + 1) / totalCount) * 100;
  const hasSelected = !!prev;

  const handleNext = () => {
    if (!hasSelected) {
      toast('请先选择一个选项');
      return;
    }
    if (isLast) {
      goTo('choose');
    } else {
      nextQ();
    }
  };

  return (
    <div className="page fade-in">
      {/* Page title */}
      <div className="page-title" style={{ textAlign: 'center', marginBottom: 8 }}>技术能力问卷</div>

      {/* Progress */}
      <div className="q-progress-wrap">
        <div className="q-progress-bar-wrap">
          <div className="q-progress-bar" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="q-progress-text">
          <span>第 {state.currentQ + 1} 题 / 共 {totalCount} 题</span>
          <span>{answeredCount} 题已答</span>
        </div>
      </div>

      {/* Intro on first question */}
      {isFirst && (
        <div className="q-intro">
          请根据你的真实技术表现选择最接近的一项。<br />
          系统会根据 12 项能力表现生成业余网球评级。
        </div>
      )}

      {/* Scrollable content with bottom padding to clear sticky button */}
      <div className="q-scroll-area">
        {/* Question card */}
        <div className="q-card">
          <div className="q-text">{state.currentQ + 1}. {q.text}</div>

          {q.options.map(o => (
            <button
              key={o.value}
              className={`q-option${prev && prev.value === o.value ? ' selected' : ''}${o.description ? ' has-desc' : ''}`}
              onClick={() => setAnswer(q.id, o.value)}
            >
              <span className="q-opt-label">
                {o.label}
                <span className="q-check">✓</span>
              </span>
              {o.description && (
                <span className="q-opt-desc">{o.description}</span>
              )}
            </button>
          ))}

          <div className="q-hint">请选择最接近你真实表现的一项</div>
        </div>

        {/* Disclaimer */}
        <div className="home-footer">
          本评级参考 NTRP 能力描述生成，不等同于 USTA 官方 NTRP、UTR 或赛事评级。
        </div>
      </div>

      {/* Fixed bottom navigation */}
      <div className="q-fixed-nav">
        <button
          className="btn btn-outline"
          disabled={isFirst}
          onClick={prevQ}
        >
          上一题
        </button>
        <button
          className={`btn btn-primary${!hasSelected ? ' q-btn-disabled' : ''}`}
          onClick={handleNext}
        >
          {hasSelected ? (isLast ? '查看结果' : '下一题') : '请选择一项'}
        </button>
      </div>
    </div>
  );
}
