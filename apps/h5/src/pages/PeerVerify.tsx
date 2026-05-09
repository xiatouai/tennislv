import { useState } from 'react';
import type { PeerVote } from '@tennis/shared';
import { useApp } from '../store';

const LABELS: Record<string, string> = { agree: '偏低', overrated: '差不多', underrated: '偏高' };
const EMOJIS: Record<string, string> = { agree: '👍', overrated: '📈', underrated: '📉' };

export function PeerVerify() {
  const { state, goTo, setHasPlayed, castVote, toast } = useApp();
  const r = state.ratingResult;
  const [selectedVote, setSelectedVote] = useState<PeerVote | null>(null);

  if (!r) return null;

  const handleVote = (vote: PeerVote) => {
    if (state.hasPlayed === null) {
      toast('请先选择是否和 TA 打过球');
      return;
    }
    setSelectedVote(vote);
    castVote(vote);
  };

  return (
    <div className="page page-safe fade-in">
      <div className="pv-card">
        <div className="pv-title">帮 TA 看看这个评级准不准</div>
        <div className="pv-sub">把这个页面发给和你打过球的球友</div>

        <div className="pv-ratee-info">
          <div className="pv-ratee-nickname">{r.nickname}</div>
          <div className="pv-ratee-level">
            NTRP {r.aiEstimatedLevel} · {r.levelName}
          </div>
          <div className="pv-ratee-range">适合约球：{r.suitableRange}</div>
          <div className="pv-ratee-tags">
            {r.styleTags.map(t => (
              <span key={t} className="pv-ratee-tag">{t}</span>
            ))}
          </div>
        </div>

        <div className="pv-played-q">你和 TA 打过球吗？</div>
        <div className="pv-played-btns">
          <button
            className={`pv-played-btn${state.hasPlayed === true ? ' selected' : ''}`}
            onClick={() => setHasPlayed(true)}
          >
            打过
          </button>
          <button
            className={`pv-played-btn${state.hasPlayed === false ? ' selected' : ''}`}
            onClick={() => setHasPlayed(false)}
          >
            没打过
          </button>
        </div>

        <div className="pv-votes" style={{ display: state.hasPlayed !== null ? 'flex' : 'none' }}>
          {(['agree', 'overrated', 'underrated'] as PeerVote[]).map(vote => (
            <button
              key={vote}
              className={`pv-vote${selectedVote === vote ? ' selected' : ''}`}
              disabled={selectedVote !== null}
              data-vote={vote}
              onClick={() => handleVote(vote)}
            >
              <span className="pv-emoji">{EMOJIS[vote]}</span>
              {LABELS[vote]}
            </button>
          ))}
        </div>

        {selectedVote && (
          <div className="pv-post-msg" style={{ display: 'block' }}>
            <div style={{ marginBottom: 12 }}>已记录你的认证。<br />你也来测测自己的业余网球等级？</div>
            <button className="btn btn-primary" onClick={() => goTo('home')}>
              开始评级
            </button>
          </div>
        )}

        <div className="pv-list">
          {state.peerVotes.length === 0 ? (
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--t3)', padding: '12px 0' }}>
              还没有球友认证，快来邀请吧
            </div>
          ) : (
            state.peerVotes.map(v => (
              <div key={v.id} className="pv-item">
                <span>{v.voterNickname}</span>
                <span>{EMOJIS[v.vote]} {LABELS[v.vote]}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="text-link" onClick={() => goTo('result')}>
        ← 返回评级结果
      </div>

      <div className="home-footer" style={{ marginTop: 16 }}>
        本评级参考 NTRP 能力描述生成，不等同于 USTA 官方 NTRP、UTR 或赛事评级。
      </div>
    </div>
  );
}
