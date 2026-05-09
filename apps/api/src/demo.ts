import Fastify from 'fastify';
import cors from '@fastify/cors';
import { RATING_QUESTIONS, mockRatingResult, NTRP_LEVELS } from '@tennis/shared';
import type { RatingResult, RatingAnswer, RatingMode, RatingType, PeerVote, PeerVerification } from '@tennis/shared';

const genId = () => Math.random().toString(36).slice(2, 10);
let H: string;

const PORT = parseInt(process.env.PORT || '3456', 10);

const ratingStore = new Map<string, { result: RatingResult; answers: RatingAnswer[]; mode: RatingMode }>();
const voteStore = new Map<string, PeerVerification[]>();

async function main() {
  const server = Fastify({ logger: false });
  await server.register(cors);

  server.get('/', async (_req, reply) => {
    reply.header('Content-Type', 'text/html; charset=utf-8');
    reply.send(H);
  });

  server.get('/api/v1/rating-questions', async () => ({ questions: RATING_QUESTIONS }));

  server.get('/api/v1/ntrp-levels', async () => ({ levels: NTRP_LEVELS }));

  server.post('/api/v1/ratings', async (req) => {
    const { ratingType, answers } = (req.body ?? {}) as {
      ratingType?: RatingType; answers?: RatingAnswer[];
    };
    const result = mockRatingResult(answers || [], ratingType || 'questionnaire_estimate');
    const id = genId();
    ratingStore.set(id, { result, answers: answers || [], mode: 'quick' });
    return { id, result };
  });

  server.get<{ Params: { id: string } }>('/api/v1/ratings/:id', async (req) => {
    const data = ratingStore.get(req.params.id);
    if (!data) return { error: 'not found' };
    const votes = voteStore.get(req.params.id) || [];
    return { id: req.params.id, ...data, peerVotes: votes };
  });

  server.post<{ Params: { id: string } }>('/api/v1/ratings/:id/verify', async (req) => {
    const { vote, comment, hasPlayed } = (req.body ?? {}) as {
      vote?: PeerVote; comment?: string; hasPlayed?: boolean;
    };
    if (!vote) return { error: 'missing vote' };
    const v: PeerVerification = {
      id: genId(),
      ratingId: req.params.id,
      voterNickname: `球友${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
      vote,
      comment: comment || '',
      createdAt: new Date().toISOString(),
    };
    const votes = voteStore.get(req.params.id) || [];
    votes.push(v);
    voteStore.set(req.params.id, votes);

    const stored = ratingStore.get(req.params.id);
    let upgraded = false;
    if (stored && votes.length >= 2 && stored.result.ratingType === 'questionnaire_estimate') {
      stored.result.ratingType = 'peer_verified';
      stored.result.confidence = 78;
      stored.result.confidenceLabel = '中';
      ratingStore.set(req.params.id, stored);
      upgraded = true;
    }

    return { success: true, peerVotes: votes, upgraded };
  });

  try {
    await server.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`[demo] TennisLV NTRP → http://localhost:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[demo] Fatal:', err);
  process.exit(1);
});

// ═══════════════════════════════════════════════════════════
// CSS
// ═══════════════════════════════════════════════════════════

const C = `
:root{--g:#07c160;--gl:#e8f7ee;--r:#e74c3c;--o:#f0ad4e;--bg:#f6f6f6;--card:#fff;--t:#222;--t2:#666;--t3:#999;--ra:14px}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif;background:var(--bg);color:var(--t);max-width:480px;margin:0 auto;min-height:100vh;line-height:1.6;-webkit-font-smoothing:antialiased}
.page{display:none;padding:0 16px 32px;min-height:100vh}
.page.active{display:block}
.btn{display:block;width:100%;padding:15px;border-radius:12px;font-size:16px;font-weight:600;text-align:center;cursor:pointer;border:none;outline:none;transition:opacity .15s,transform .1s}
.btn:active{opacity:.85;transform:scale(.98)}
.btn-primary{background:var(--g);color:#fff}
.btn-outline{background:var(--card);color:var(--g);border:1.5px solid var(--g)}
.btn:disabled{opacity:.4;pointer-events:none}
.text-link{text-align:center;color:var(--t3);font-size:13px;padding:14px 0;cursor:pointer}
.text-link:active{color:var(--g)}
.section-title{font-size:15px;font-weight:600;color:var(--t);margin:20px 0 10px}
.card{background:var(--card);border-radius:var(--ra);padding:16px;margin-bottom:12px}

/* Home */
.home-hero{text-align:center;padding:32px 0 24px}
.home-brand-en{font-size:30px;font-weight:800;color:var(--t);letter-spacing:-.5px;margin-bottom:2px}
.home-brand-cn{font-size:15px;color:var(--g);font-weight:600;letter-spacing:2px;margin-bottom:16px}
.home-title{font-size:22px;font-weight:700;color:var(--t);margin-bottom:6px}
.home-subtitle{font-size:14px;color:var(--t2);line-height:1.6;margin-bottom:8px}
.home-desc{font-size:12px;color:var(--t3);line-height:1.6;margin-bottom:20px}
.home-preview{background:var(--card);border-radius:var(--ra);padding:16px 20px;margin:0 0 20px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,.06)}
.home-pv-label{font-size:12px;color:var(--t3);margin-bottom:6px}
.home-pv-level{font-size:40px;font-weight:800;color:var(--g);line-height:1}
.home-pv-name{font-size:14px;color:var(--t2);margin-top:2px}
.home-pv-range{font-size:13px;color:var(--t2);margin-top:2px}
.home-pv-tags{display:flex;justify-content:center;gap:6px;margin-top:8px;flex-wrap:wrap}
.home-pv-tag{background:var(--gl);color:var(--g);padding:2px 10px;border-radius:12px;font-size:12px}
.home-footer{text-align:center;font-size:11px;color:var(--t3);padding:8px 0;line-height:1.5}

/* Questionnaire */
.q-progress{height:4px;background:#eee;border-radius:2px;margin-bottom:20px;overflow:hidden}
.q-progress-bar{height:100%;background:var(--g);border-radius:2px;transition:width .3s}
.q-counter{text-align:center;font-size:12px;color:var(--t3);margin-bottom:16px}
.q-card{background:var(--card);border-radius:var(--ra);padding:20px 16px;margin-bottom:12px}
.q-text{font-size:17px;font-weight:600;color:var(--t);margin-bottom:16px;line-height:1.5}
.q-option{display:block;width:100%;padding:14px 16px;margin-bottom:8px;background:#f9f9f9;border:1.5px solid transparent;border-radius:10px;font-size:15px;color:var(--t);cursor:pointer;text-align:left;transition:border .15s,background .15s}
.q-option:active{background:#f0f0f0}
.q-option.selected{border-color:var(--g);background:var(--gl);font-weight:500}
.q-nav{display:flex;gap:10px;margin-top:16px}
.q-nav button{flex:1}

/* Video */
.v-zone{background:var(--card);border-radius:var(--ra);padding:40px 20px;text-align:center;border:2px dashed #ddd;cursor:pointer;margin:16px 0}
.v-zone:active{border-color:var(--g)}
.v-icon{font-size:40px;margin-bottom:10px;display:block}
.v-text{font-size:14px;color:var(--t3)}
.v-skip{text-align:center;padding:20px 0;font-size:14px;color:var(--t3);cursor:pointer}
.v-enhance-box{background:var(--card);border-radius:var(--ra);padding:20px 16px;margin:16px 0;text-align:center;border:2px solid var(--g)}
.v-enhance-title{font-size:16px;font-weight:600;color:var(--t);margin-bottom:6px}
.v-enhance-sub{font-size:13px;color:var(--t2);margin-bottom:14px;line-height:1.5}
.v-enhance-note{font-size:11px;color:var(--t3);margin-top:10px}
.v-status-ok{text-align:center;font-size:14px;color:var(--g);padding:10px 0}

/* Analyzing */
.az-area{text-align:center;padding:60px 0 30px}
.az-spinner{width:64px;height:64px;border:4px solid #eee;border-top-color:var(--g);border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 20px}
@keyframes spin{to{transform:rotate(360deg)}}
.az-title{font-size:18px;font-weight:600;margin-bottom:6px}
.az-sub{font-size:13px;color:var(--t3);margin-bottom:4px}
.az-steps{list-style:none;padding:0 16px}
.az-step{display:flex;align-items:center;gap:10px;padding:10px 0;font-size:14px;color:var(--t3)}
.az-step.done{color:var(--g)}
.az-step .az-dot{width:8px;height:8px;border-radius:50%;background:#ddd;flex-shrink:0}
.az-step.done .az-dot{background:var(--g)}

/* Result */
.r-hero{background:linear-gradient(135deg,#07c160,#059a4c);border-radius:var(--ra);padding:24px 20px 20px;color:#fff;text-align:center;margin-top:12px}
.r-type-badge{display:inline-block;background:rgba(255,255,255,.22);padding:3px 12px;border-radius:12px;font-size:12px;margin-bottom:10px}
.r-level{font-size:56px;font-weight:800;line-height:1;letter-spacing:-2px}
.r-level-name{font-size:16px;opacity:.85;margin-top:4px}
.r-ntrp-label{font-size:12px;opacity:.7;margin-top:2px}
.r-range{display:inline-block;background:rgba(255,255,255,.2);border-radius:20px;padding:4px 16px;margin-top:10px;font-size:14px}
.r-meta{display:flex;justify-content:center;gap:20px;margin-top:10px;font-size:13px;opacity:.8}
.r-tags{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}
.r-tag{background:var(--gl);color:var(--g);padding:4px 12px;border-radius:20px;font-size:13px;font-weight:500}

/* Why this level */
.r-why{background:var(--card);border-radius:var(--ra);padding:16px;margin-bottom:12px}
.r-why-title{font-size:14px;font-weight:600;color:var(--t);margin-bottom:8px}
.r-why-summary{font-size:13px;color:var(--t2);line-height:1.6;margin-bottom:10px}
.r-why-item{display:flex;align-items:flex-start;gap:6px;padding:4px 0;font-size:12px;color:var(--t2);line-height:1.5}
.r-why-dot{color:var(--g);font-weight:700;flex-shrink:0}

/* Characteristics */
.r-chars{background:var(--card);border-radius:var(--ra);padding:16px;margin-bottom:12px}
.r-chars-title{font-size:14px;font-weight:600;color:var(--t);margin-bottom:8px}
.r-char-row{display:flex;padding:5px 0;font-size:12px;color:var(--t2);line-height:1.5;border-bottom:1px solid #fafafa}
.r-char-label{flex-shrink:0;width:60px;font-weight:500;color:var(--t)}

/* Self-assessment */
.r-compare{background:#fafafa;border-radius:10px;padding:14px 16px;margin-bottom:12px;font-size:13px;color:var(--t2);line-height:1.6;text-align:center}

/* Next level */
.r-next{background:var(--card);border-radius:var(--ra);padding:16px;margin:12px 0}
.r-next-title{font-size:14px;font-weight:600;margin-bottom:4px}
.r-next-text{font-size:13px;color:var(--t2);line-height:1.5}

/* Dimensions */
.r-dim{background:var(--card);border-radius:var(--ra);padding:16px;margin-bottom:8px}
.r-dim-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.r-dim-label{font-size:14px;font-weight:600}
.r-dim-score{font-size:13px;font-weight:600}
.r-dim-score.strong{color:var(--g)}
.r-dim-score.mid{color:#4a90d9}
.r-dim-score.basic{color:var(--o)}
.r-dim-score.entry{color:var(--t3)}
.r-dim-bar{height:6px;background:#eee;border-radius:3px;overflow:hidden}
.r-dim-bar-fill{height:100%;background:var(--g);border-radius:3px}
.r-dim-comment{font-size:13px;color:var(--t2);margin-top:6px;line-height:1.5}

/* Rating type description */
.r-rating-desc{font-size:11px;color:var(--t3);text-align:center;padding:8px 0;line-height:1.7}

.r-actions .btn+.btn,.r-actions .text-link+.text-link{margin-top:8px}

/* Share Card */
.sc-card{background:var(--card);border-radius:var(--ra);padding:24px 20px 20px;margin:16px 0;box-shadow:0 4px 20px rgba(0,0,0,.08)}
.sc-header{text-align:center;padding-bottom:10px;border-bottom:1px solid #f2f2f2}
.sc-brand{font-size:18px;font-weight:700;color:var(--t)}
.sc-badge{display:inline-block;padding:3px 10px;border-radius:10px;font-size:11px;margin-top:4px;font-weight:500}
.sc-badge.qe{background:var(--gl);color:var(--g)}
.sc-badge.ve{background:#e3f0ff;color:#4a90d9}
.sc-badge.pv{background:#fff3e0;color:var(--o)}
.sc-badge.cv{background:#fce4ec;color:var(--r)}
.sc-level-row{text-align:center;padding:14px 0}
.sc-level{font-size:48px;font-weight:800;color:var(--g);line-height:1}
.sc-level-sub{font-size:15px;color:var(--t);font-weight:600;margin-top:4px}
.sc-ntrp-label{font-size:12px;color:var(--t3);margin-top:2px}
.sc-persona{font-size:13px;color:var(--t2);padding:8px 12px;line-height:1.5;text-align:center;background:#fafafa;border-radius:8px;margin:8px 0}
.sc-info{font-size:14px;color:var(--t);padding:10px 0}
.sc-info-row{display:flex;justify-content:space-between;padding:8px 0;border-top:1px solid #f8f8f8}
.sc-info-label{color:var(--t2)}
.sc-tags{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
.sc-tag{background:#f5f5f5;padding:3px 10px;border-radius:12px;font-size:12px;color:var(--t2)}
.sc-cta{text-align:center;font-size:13px;color:var(--t2);padding:12px 0 4px;border-top:1px solid #f2f2f2;margin-top:8px;font-weight:500}
.sc-qr{text-align:center;padding:8px 0 2px}
.sc-qr-hint{font-size:11px;color:var(--t3);display:block;margin-top:4px}
.sc-footer{text-align:center;font-size:11px;color:#ccc;padding-top:8px;line-height:1.5}

/* Peer Verify */
.pv-card{background:var(--card);border-radius:var(--ra);padding:20px 16px;margin:16px 0;text-align:center}
.pv-title{font-size:17px;font-weight:600;margin-bottom:4px}
.pv-sub{font-size:13px;color:var(--t2);margin-bottom:10px}
.pv-ratee-info{background:#fafafa;border-radius:10px;padding:12px;margin:12px 0;text-align:center}
.pv-ratee-level{font-size:28px;font-weight:700;color:var(--g)}
.pv-ratee-range{font-size:12px;color:var(--t2);margin-top:2px}
.pv-ratee-tags{display:flex;justify-content:center;gap:4px;margin-top:6px;flex-wrap:wrap}
.pv-ratee-tag{background:var(--gl);color:var(--g);padding:1px 8px;border-radius:10px;font-size:11px}
.pv-played-q{font-size:14px;font-weight:500;color:var(--t);margin:14px 0 8px}
.pv-played-btns{display:flex;gap:8px;justify-content:center;margin-bottom:14px}
.pv-played-btn{flex:1;max-width:120px;padding:10px;border-radius:10px;border:1.5px solid #e8e8e8;background:#fff;cursor:pointer;font-size:14px;text-align:center;transition:all .15s}
.pv-played-btn:active{transform:scale(.96)}
.pv-played-btn.selected{border-color:var(--g);background:var(--gl);font-weight:500}
.pv-votes{display:flex;gap:10px}
.pv-vote{flex:1;padding:14px 8px;border-radius:10px;border:1.5px solid #e8e8e8;background:#fff;cursor:pointer;font-size:14px;font-weight:500;text-align:center;transition:all .15s}
.pv-vote:active{transform:scale(.96)}
.pv-vote.selected{border-color:var(--g);background:var(--gl)}
.pv-vote:disabled{opacity:.4;pointer-events:none}
.pv-vote .pv-emoji{font-size:24px;display:block;margin-bottom:4px}
.pv-list{margin-top:16px}
.pv-item{display:flex;justify-content:space-between;align-items:center;padding:8px 0;font-size:13px;color:var(--t2);border-top:1px solid #f5f5f5}
.pv-post-msg{text-align:center;font-size:13px;color:var(--g);padding:12px 0;line-height:1.6;display:none}

.toast{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,.75);color:#fff;padding:12px 24px;border-radius:8px;font-size:14px;z-index:999;pointer-events:none;opacity:0;transition:opacity .3s}
.toast.show{opacity:1}
.fade-in{animation:fadeIn .3s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

/* Poster */
.poster-page{background:#111;padding:0;display:flex;align-items:center;justify-content:center}
.poster{width:375px;background:linear-gradient(180deg,#07c160 0%,#059a4c 100%);color:#fff;padding:32px 24px 24px;border-radius:0;overflow:hidden;position:relative}
.poster::before{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;background:rgba(255,255,255,.06);border-radius:50%}
.poster::after{content:'';position:absolute;bottom:-30px;left:-30px;width:100px;height:100px;background:rgba(255,255,255,.04);border-radius:50%}
.ps-top{text-align:center;position:relative;z-index:1}
.ps-brand{font-size:18px;font-weight:700;opacity:.95;letter-spacing:1px}
.ps-cn{font-size:12px;opacity:.7;margin-top:2px;letter-spacing:2px}
.ps-type-badge{display:inline-block;background:rgba(255,255,255,.2);padding:2px 10px;border-radius:10px;font-size:11px;margin-top:6px}
.ps-level-area{text-align:center;padding:18px 0 14px;position:relative;z-index:1}
.ps-level{font-size:72px;font-weight:800;line-height:1;letter-spacing:-3px}
.ps-level-name{font-size:16px;opacity:.85;margin-top:4px}
.ps-ntrp-label{font-size:11px;opacity:.6;margin-top:2px}
.ps-range{display:inline-block;background:rgba(255,255,255,.18);padding:6px 18px;border-radius:20px;font-size:14px;margin-top:8px}
.ps-tags{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:0 0 12px;position:relative;z-index:1}
.ps-tag{background:rgba(255,255,255,.15);padding:4px 14px;border-radius:14px;font-size:13px}
.ps-persona{font-size:12px;opacity:.75;text-align:center;padding:0 8px 12px;line-height:1.5;position:relative;z-index:1}
.ps-divider{height:1px;background:rgba(255,255,255,.15);margin:0 0 16px;position:relative;z-index:1}
.ps-dims{position:relative;z-index:1}
.ps-dim{display:flex;justify-content:space-between;align-items:center;padding:8px 0;font-size:14px}
.ps-dim-label{opacity:.8}
.ps-dim-score{font-weight:600}
.ps-dim-bar{height:4px;background:rgba(255,255,255,.2);border-radius:2px;margin:4px 0 10px;overflow:hidden;position:relative;z-index:1}
.ps-dim-bar-fill{height:100%;background:#fff;border-radius:2px}
.ps-footer{text-align:center;padding:14px 0 4px;position:relative;z-index:1}
.ps-cta{font-size:13px;opacity:.8;margin-bottom:6px}
.ps-url{font-size:11px;opacity:.6;margin-bottom:10px}
.ps-qr-area{display:flex;justify-content:center;align-items:center;gap:8px}
.ps-qr{width:56px;height:56px;background:#fff;border-radius:6px;display:flex;align-items:center;justify-content:center}
.ps-qr-hint{font-size:11px;opacity:.6}
.ps-disclaimer{text-align:center;font-size:10px;opacity:.5;padding:10px 0 0;line-height:1.5}
.ps-close{position:fixed;top:16px;right:16px;z-index:10;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.2);border:none;color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.ps-save-hint{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:10;background:rgba(0,0,0,.6);color:#fff;padding:8px 20px;border-radius:20px;font-size:13px;pointer-events:none}
`;

// ═══════════ PAGES ═══════════

function P_Home() {
  return `<div class="page active fade-in" id="page-home">
    <div class="home-hero">
      <div class="home-brand-en">TennisLV</div>
      <div class="home-brand-cn">业余网球评级</div>
      <div class="home-title">参考 NTRP 等级描述，测一测你的网球水平</div>
      <div class="home-subtitle">看看你是 2.5、3.0 还是 3.5。</div>
      <div class="home-desc">完成问卷，可选上传视频，生成你的 AI 预估网球评级。<br>适合约球、组局、俱乐部分级和球友认证参考。</div>
      <div class="home-preview">
        <div class="home-pv-label">示例评级卡</div>
        <div class="home-pv-level">3.0</div>
        <div class="home-pv-name">中级</div>
        <div class="home-pv-range">NTRP 风格等级 · 适合约球：2.5-3.5</div>
        <div class="home-pv-tags">
          <span class="home-pv-tag">底线型</span><span class="home-pv-tag">正手优先</span>
        </div>
      </div>
      <div style="margin-top:20px">
        <button class="btn btn-primary" onclick="App.startRating()">开始评级</button>
      </div>
    </div>
    <div class="home-footer">本评级参考 NTRP 能力描述生成，不等同于 USTA 官方 NTRP、UTR 或赛事评级。</div>
  </div>`;
}

function P_Questionnaire() {
  return `<div class="page" id="page-questionnaire">
    <div class="q-progress"><div class="q-progress-bar" id="q-bar" style="width:0%"></div></div>
    <div class="q-counter"><span id="q-cur">1</span> / <span id="q-total">${RATING_QUESTIONS.length}</span></div>
    <div class="q-card" id="q-card"></div>
    <div class="q-nav">
      <button class="btn btn-outline" id="q-prev" disabled onclick="App.prevQ()">上一题</button>
      <button class="btn btn-primary" id="q-next" onclick="App.nextQ()">下一题</button>
    </div>
  </div>`;
}

function P_Video() {
  return `<div class="page" id="page-video">
    <div class="section-title">上传打球视频（可选）</div>
    <div class="v-zone" id="v-zone" onclick="App.uploadVideo()">
      <span class="v-icon">📹</span>
      <span class="v-text">点击上传视频，支持 MP4 / MOV，最长 30 秒</span>
    </div>
    <div id="v-status" style="display:none"></div>
    <div id="v-enhance" style="display:none">
      <div class="v-enhance-box">
        <div class="v-enhance-title">视频已上传</div>
        <div class="v-enhance-sub">上传视频不等于自动分析。<br>点击下方按钮进行视频增强评级，AI 将参考你的视频动作给出更准确的 NTRP 风格等级。</div>
        <button class="btn btn-primary" onclick="App.videoEnhance()">开始视频增强评级</button>
        <div class="v-enhance-note">Demo 阶段为模拟分析，不会调用真实大模型</div>
      </div>
    </div>
    <div class="section-title">拍摄建议</div>
    <div class="card" style="font-size:13px;color:var(--t2);line-height:1.8">
      · 保证全身入镜，动作清晰可见<br>
      · 侧面拍摄效果最佳<br>
      · 选择光线充足的环境<br>
      · 单人拍摄，避免多人同框
    </div>
    <div style="margin-top:20px">
      <button class="btn btn-primary" id="btn-submit" onclick="App.submitRating()">生成问卷预估评级</button>
    </div>
    <div class="v-skip" onclick="App.submitRating()">跳过上传，直接评级 →</div>
  </div>`;
}

function P_Analyzing() {
  return `<div class="page" id="page-analyzing">
    <div class="az-area">
      <div class="az-spinner"></div>
      <div class="az-title" id="az-title">AI 正在分析中...</div>
      <div class="az-sub" id="az-status">正在评估你的技术水平</div>
    </div>
    <ul class="az-steps" id="az-steps">
      <li class="az-step" id="az-s-0"><span class="az-dot"></span>分析问卷回答</li>
      <li class="az-step" id="az-s-1"><span class="az-dot"></span>匹配 NTRP 能力维度</li>
      <li class="az-step" id="az-s-2"><span class="az-dot"></span>计算综合评级</li>
      <li class="az-step" id="az-s-3"><span class="az-dot"></span>生成评级卡</li>
    </ul>
  </div>`;
}

function P_Result() {
  return `<div class="page" id="page-result">
    <div class="r-hero" id="r-hero"></div>
    <div class="r-tags" id="r-tags"></div>
    <div class="r-compare" id="r-compare"></div>
    <div class="r-why" id="r-why"></div>
    <div class="r-chars" id="r-chars"></div>
    <div style="padding:0 2px">
      <div class="section-title">各维度评分</div>
      <div id="r-dims"></div>
    </div>
    <div class="r-next" id="r-next"></div>
    <div class="r-rating-desc">本评级参考 NTRP 能力描述生成，不等同于 USTA 官方 NTRP、UTR 或赛事评级。</div>
    <div class="r-actions">
      <button class="btn btn-primary" onclick="App.showShare()">生成评级卡</button>
      <button class="btn btn-outline" onclick="App.showVerify()">邀请球友认证</button>
      <div class="text-link" onclick="App.resetAll()">重新评级</div>
    </div>
  </div>`;
}

function P_ShareCard() {
  return `<div class="page" id="page-share">
    <div class="sc-card" id="sc-card"></div>
    <div class="r-actions" style="margin-top:12px">
      <button class="btn btn-primary" onclick="App.showPoster()">分享海报</button>
      <button class="btn btn-outline" onclick="App.showVerify()" style="margin-top:8px">邀请球友认证</button>
      <div class="text-link" onclick="App.goResult()">← 返回评级结果</div>
    </div>
  </div>`;
}

function P_PeerVerify() {
  return `<div class="page" id="page-verify">
    <div class="pv-card">
      <div class="pv-title">邀请球友认证你的水平</div>
      <div class="pv-sub">把这个页面发给和你打过球的球友</div>
      <div class="pv-ratee-info" id="pv-ratee-info"></div>
      <div class="pv-played-q">你和 TA 打过球吗？</div>
      <div class="pv-played-btns" id="pv-played-btns">
        <button class="pv-played-btn" data-played="1" onclick="App.setHasPlayed(true,this)">打过</button>
        <button class="pv-played-btn" data-played="0" onclick="App.setHasPlayed(false,this)">没打过</button>
      </div>
      <div class="pv-votes" id="pv-buttons" style="display:none">
        <div class="pv-vote" data-vote="agree" onclick="App.castVote('agree')">
          <span class="pv-emoji">👍</span>偏低
        </div>
        <div class="pv-vote" data-vote="overrated" onclick="App.castVote('overrated')">
          <span class="pv-emoji">📈</span>差不多
        </div>
        <div class="pv-vote" data-vote="underrated" onclick="App.castVote('underrated')">
          <span class="pv-emoji">📉</span>偏高
        </div>
      </div>
      <div class="pv-post-msg" id="pv-post-msg">已记录你的认证。<br>你也来测测自己的业余网球等级？</div>
      <div class="pv-list" id="pv-list"></div>
    </div>
    <div class="text-link" onclick="App.goResult()">← 返回评级结果</div>
  </div>`;
}

function P_Poster() {
  return `<div class="page poster-page" id="page-poster">
    <button class="ps-close" onclick="App.closePoster()">✕</button>
    <div class="poster" id="poster-card"></div>
    <div class="ps-save-hint">长按或截图保存海报</div>
  </div>`;
}

function E_Toast() {
  return `<div class="toast" id="toast"></div>`;
}

// ═══════════ JS ═══════════

const JS = `
const RATING_QUESTIONS = ${JSON.stringify(RATING_QUESTIONS)};
const NTRP_LEVELS = ${JSON.stringify(NTRP_LEVELS)};

const App = {
  mode: 'quick',
  ratingType: 'questionnaire_estimate',
  answers: [],
  currentQ: 0,
  hasVideo: false,
  hasPlayed: null,
  ratingId: null,
  ratingResult: null,
  peerVotes: [],

  init() {
    const hash = window.location.hash.slice(1);
    if (hash && hash.startsWith('rating-')) {
      this.loadSharedRating(hash.replace('rating-', ''));
    }
  },

  async loadSharedRating(id) {
    try {
      const res = await fetch('/api/v1/ratings/' + id);
      const data = await res.json();
      if (data.error) return;
      this.ratingId = id;
      this.ratingResult = data.result;
      this.ratingType = data.result.ratingType || 'questionnaire_estimate';
      this.peerVotes = data.peerVotes || [];
      this.renderResult();
      this.showPage('result');
    } catch(e) {}
  },

  startRating() {
    this.answers = [];
    this.currentQ = 0;
    this.hasVideo = false;
    this.ratingType = 'questionnaire_estimate';
    this.renderQ();
    this.showPage('questionnaire');
  },

  // ── Questionnaire ──
  renderQ() {
    const q = RATING_QUESTIONS[this.currentQ];
    const prev = this.answers.find(a => a.questionId === q.id);

    let html = '<div class="q-text">' + (this.currentQ + 1) + '. ' + q.text + '</div>';
    html += q.options.map(o => {
      const isSelected = prev && prev.value === o.value;
      return '<button class="q-option' + (isSelected ? ' selected' : '') + '" ' +
        'onclick="App.selectQ(\\'' + q.id + '\\',\\'' + o.value + '\\',this)">' + o.label + '</button>';
    }).join('');

    document.getElementById('q-card').innerHTML = html;
    document.getElementById('q-bar').style.width = ((this.currentQ / RATING_QUESTIONS.length) * 100) + '%';
    document.getElementById('q-cur').textContent = this.currentQ + 1;
    document.getElementById('q-prev').disabled = this.currentQ === 0;
    const nextBtn = document.getElementById('q-next');
    nextBtn.textContent = this.currentQ === RATING_QUESTIONS.length - 1 ? '完成问卷' : '下一题';
  },

  selectQ(qid, val, el) {
    const idx = this.answers.findIndex(a => a.questionId === qid);
    if (idx >= 0) this.answers[idx].value = val;
    else this.answers.push({ questionId: qid, value: val });
    el.parentElement.querySelectorAll('.q-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
  },

  nextQ() {
    const q = RATING_QUESTIONS[this.currentQ];
    if (!this.answers.find(a => a.questionId === q.id)) {
      this.toast('请先选择一个选项');
      return;
    }
    if (this.currentQ < RATING_QUESTIONS.length - 1) {
      this.currentQ++;
      this.renderQ();
    } else {
      this.showPage('video');
    }
  },

  prevQ() {
    if (this.currentQ > 0) { this.currentQ--; this.renderQ(); }
  },

  // ── Video ──
  uploadVideo() {
    this.hasVideo = true;
    document.getElementById('v-zone').style.display = 'none';
    const statusEl = document.getElementById('v-status');
    statusEl.style.display = 'block';
    statusEl.innerHTML = '<div class="v-status-ok">✓ 视频上传完成 (mock)</div>';
    document.getElementById('v-enhance').style.display = 'block';
    document.getElementById('btn-submit').textContent = '跳过视频分析，生成问卷预估评级';
  },

  async videoEnhance() {
    this.showPage('analyzing');
    document.getElementById('az-title').textContent = 'AI 视频增强分析中...';
    this.runAnalyzeSteps(['分析视频动作', '匹配 NTRP 能力维度', '计算综合评级', '生成增强评级卡']);

    try {
      const res = await fetch('/api/v1/ratings', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ ratingType: 'video_enhanced', answers: this.answers }),
      });
      const data = await res.json();
      this.ratingId = data.id;
      this.ratingResult = data.result;
      this.ratingType = 'video_enhanced';
      this.peerVotes = [];
      window.location.hash = 'rating-' + data.id;

      setTimeout(() => {
        this.completeSteps();
        setTimeout(() => this.renderResult(), 500);
      }, 1600);
    } catch(e) {
      this.toast('分析失败，请重试');
    }
  },

  async submitRating() {
    this.showPage('analyzing');
    document.getElementById('az-title').textContent = 'AI 正在分析中...';
    this.runAnalyzeSteps(['分析问卷回答', '匹配 NTRP 能力维度', '计算综合评级', '生成评级卡']);

    try {
      const res = await fetch('/api/v1/ratings', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ ratingType: 'questionnaire_estimate', answers: this.answers }),
      });
      const data = await res.json();
      this.ratingId = data.id;
      this.ratingResult = data.result;
      this.ratingType = 'questionnaire_estimate';
      this.peerVotes = [];
      window.location.hash = 'rating-' + data.id;

      setTimeout(() => {
        this.completeSteps();
        setTimeout(() => this.renderResult(), 500);
      }, 1200);
    } catch(e) {
      this.toast('分析失败，请重试');
    }
  },

  runAnalyzeSteps(labels) {
    const container = document.getElementById('az-steps');
    container.innerHTML = labels.map((l, i) =>
      '<li class="az-step' + (i === 0 ? ' done' : '') + '" id="az-s-' + i + '">' +
      '<span class="az-dot"></span>' + l + '</li>'
    ).join('');
    let i = 1;
    this._stepTimer = setInterval(() => {
      if (i >= labels.length) { clearInterval(this._stepTimer); return; }
      const el = document.getElementById('az-s-' + i);
      if (el) el.classList.add('done');
      document.getElementById('az-status').textContent =
        ['正在分析...','匹配 NTRP 维度...','计算综合评级...','生成评级卡...'][i] || '';
      i++;
    }, 500);
  },

  completeSteps() {
    clearInterval(this._stepTimer);
    document.querySelectorAll('.az-step').forEach(s => s.classList.add('done'));
    document.getElementById('az-status').textContent = '评级完成';
  },

  // ── Render Result ──
  renderResult() {
    const r = this.ratingResult;
    const ntrpData = NTRP_LEVELS.find(l => l.level === r.aiEstimatedLevel);

    // Hero
    const typeLabels = {
      questionnaire_estimate: '问卷预估',
      video_enhanced: '视频增强',
      peer_verified: '球友认证',
      coach_verified: '教练认证',
    };
    document.getElementById('r-hero').innerHTML =
      '<div class="r-type-badge">' + (typeLabels[r.ratingType] || '问卷预估') + '</div>' +
      '<div class="r-level">' + r.aiEstimatedLevel + '</div>' +
      '<div class="r-level-name">' + r.levelName + '</div>' +
      '<div class="r-ntrp-label">NTRP 风格等级</div>' +
      '<div class="r-range">适合约球范围：' + r.suitableRange + '</div>' +
      '<div class="r-meta"><span>置信度：' + r.confidenceLabel + '</span></div>';

    // Tags
    document.getElementById('r-tags').innerHTML = r.styleTags.map(t => '<span class="r-tag">' + t + '</span>').join('');

    // Self-assessment comparison
    document.getElementById('r-compare').innerHTML = '<strong>与自评对比：</strong>' + r.selfAssessmentComparison;

    // Why this level
    this.renderWhy(r, ntrpData);

    // Characteristics
    if (ntrpData) {
      const c = ntrpData.characteristics;
      document.getElementById('r-chars').innerHTML =
        '<div class="r-chars-title">当前等级典型特征</div>' +
        '<div class="r-char-row"><span class="r-char-label">整体</span>' + c.overall + '</div>' +
        '<div class="r-char-row"><span class="r-char-label">底线</span>' + c.groundstroke + '</div>' +
        '<div class="r-char-row"><span class="r-char-label">发球</span>' + c.serve + '</div>' +
        '<div class="r-char-row"><span class="r-char-label">网前</span>' + c.net + '</div>' +
        '<div class="r-char-row"><span class="r-char-label">脚步</span>' + c.footwork + '</div>' +
        '<div class="r-char-row"><span class="r-char-label">战术</span>' + c.tactics + '</div>' +
        '<div class="r-char-row"><span class="r-char-label">比赛</span>' + c.match + '</div>';
    }

    // Dimensions
    const scoreLabelFn = (s) => {
      if (s >= 85) return { label: '较强', cls: 'strong' };
      if (s >= 70) return { label: '中级', cls: 'mid' };
      if (s >= 50) return { label: '初级', cls: 'basic' };
      return { label: '入门', cls: 'entry' };
    };
    document.getElementById('r-dims').innerHTML = r.dimensions.map(d => {
      const sl = scoreLabelFn(d.score);
      return '<div class="r-dim"><div class="r-dim-header">' +
        '<span class="r-dim-label">' + d.label + '</span>' +
        '<span class="r-dim-score ' + sl.cls + '">' + d.score + '/100 ' + sl.label + '</span>' +
        '</div><div class="r-dim-bar"><div class="r-dim-bar-fill" style="width:' + d.score + '%"></div></div>' +
        '<div class="r-dim-comment">' + d.comment + '</div></div>';
    }).join('');

    // Next level
    const nextData = NTRP_LEVELS.find(l => l.level === r.nextLevelTarget);
    document.getElementById('r-next').innerHTML =
      '<div class="r-next-title">下一等级目标：NTRP ' + r.nextLevelTarget +
      (nextData ? '（' + nextData.label + '）' : '') + '</div>' +
      '<div class="r-next-text">' + r.nextLevelAdvice + '</div>';

    this.showPage('result');
  },

  renderWhy(r, ntrpData) {
    const dims = r.dimensions;
    const strong = [...dims].sort((a,b) => b.score - a.score)[0];
    const weak = [...dims].sort((a,b) => a.score - b.score)[0];

    let summary = '';
    if (strong && weak && strong.score >= 70 && weak.score < 60) {
      summary = '你的' + strong.label + '已达到或接近 ' + r.aiEstimatedLevel + ' 水平，但' + weak.label + '仍不足以支撑更高等级，因此本次预估为 <strong>' + r.aiEstimatedLevel + '</strong>。';
    } else if (strong && strong.score >= 70) {
      summary = '你的各项能力较为均衡，' + strong.label + '表现最突出，综合评估接近 <strong>' + r.aiEstimatedLevel + '</strong> 水平。';
    } else {
      summary = '综合 8 项问卷回答，加权计算各维度得分后，系统预估你的 NTRP 风格等级为 <strong>' + r.aiEstimatedLevel + '</strong>。';
    }

    document.getElementById('r-why').innerHTML =
      '<div class="r-why-title">为什么是这个等级？</div>' +
      '<div class="r-why-summary">' + summary + '</div>' +
      dims.map(d => '<div class="r-why-item"><span class="r-why-dot">•</span>' +
        d.label + '：' + d.score + '/100 — ' + d.comment + '</div>').join('');
  },

  // ── Share Card ──
  showShare() {
    const r = this.ratingResult;
    const typeLabels = {
      questionnaire_estimate: '问卷预估',
      video_enhanced: '视频增强',
      peer_verified: '球友认证',
      coach_verified: '教练认证',
    };
    const typeLabel = typeLabels[r.ratingType] || '问卷预估';
    const typeCls = { questionnaire_estimate:'qe', video_enhanced:'ve', peer_verified:'pv', coach_verified:'cv' }[r.ratingType] || 'qe';

    const ntrpData = NTRP_LEVELS.find(l => l.level === r.aiEstimatedLevel);
    const shortDesc = ntrpData ? ntrpData.shortDescription : '';

    document.getElementById('sc-card').innerHTML =
      '<div class="sc-header"><div class="sc-brand">TennisLV</div>' +
      '<div class="sc-badge ' + typeCls + '">业余网球评级卡</div></div>' +
      '<div class="sc-level-row"><div class="sc-level">' + r.aiEstimatedLevel + '</div>' +
      '<div class="sc-level-sub">' + r.levelName + '</div>' +
      '<div class="sc-ntrp-label">我的 NTRP 风格等级</div></div>' +
      '<div class="sc-persona">典型特征：' + shortDesc + '</div>' +
      '<div class="sc-info">' +
      '<div class="sc-info-row"><span class="sc-info-label">适合约球</span><span>' + r.suitableRange + '</span></div>' +
      '<div class="sc-info-row"><span class="sc-info-label">评级类型</span><span>' + typeLabel + '</span></div>' +
      '<div class="sc-info-row"><span class="sc-info-label">置信度</span><span>' + r.confidenceLabel + '</span></div>' +
      '<div class="sc-info-row"><span class="sc-info-label">打法标签</span><span>' + r.styleTags.join(' / ') + '</span></div>' +
      '</div>' +
      '<div class="sc-tags">' + r.styleTags.map(t => '<span class="sc-tag">' + t + '</span>').join('') + '</div>' +
      '<div class="sc-cta">你也来测测：你是几级网球选手？</div>' +
      '<div class="sc-qr"><svg viewBox="0 0 80 80" width="72" height="72"><rect width="80" height="80" fill="#f5f5f5"/><rect x="8" y="8" width="24" height="24" rx="2" fill="#333"/><rect x="12" y="12" width="16" height="16" rx="1" fill="#fff"/><rect x="16" y="16" width="8" height="8" fill="#333"/><rect x="48" y="8" width="24" height="24" rx="2" fill="#333"/><rect x="52" y="12" width="16" height="16" rx="1" fill="#fff"/><rect x="56" y="16" width="8" height="8" fill="#333"/><rect x="8" y="48" width="24" height="24" rx="2" fill="#333"/><rect x="12" y="52" width="16" height="16" rx="1" fill="#fff"/><rect x="16" y="56" width="8" height="8" fill="#333"/><circle cx="40" cy="40" r="4" fill="#333"/></svg></div>' +
      '<span class="sc-qr-hint">扫码生成你的业余网球评级卡</span>' +
      '<div class="sc-footer">tennislv.app<br>AI 预估评级，非官方 NTRP / UTR 评级</div>';

    this.showPage('share');
  },

  // ── Peer Verify ──
  showVerify() {
    const r = this.ratingResult;
    if (r) {
      document.getElementById('pv-ratee-info').innerHTML =
        '<div class="pv-ratee-level">NTRP ' + r.aiEstimatedLevel + ' · ' + r.levelName + '</div>' +
        '<div class="pv-ratee-range">适合约球：' + r.suitableRange + '</div>' +
        '<div class="pv-ratee-tags">' + r.styleTags.map(t => '<span class="pv-ratee-tag">' + t + '</span>').join('') + '</div>';
    }
    this.hasPlayed = null;
    document.querySelectorAll('#pv-played-btns .pv-played-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('pv-buttons').style.display = 'none';
    document.getElementById('pv-post-msg').style.display = 'none';
    document.querySelectorAll('.pv-vote').forEach(el => { el.classList.remove('selected'); el.disabled = false; });
    this.renderVotes();
    this.showPage('verify');
  },

  setHasPlayed(val, el) {
    this.hasPlayed = val;
    document.querySelectorAll('#pv-played-btns .pv-played-btn').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById('pv-buttons').style.display = 'flex';
  },

  async castVote(vote) {
    if (!this.ratingId) return;
    if (this.hasPlayed === null) {
      this.toast('请先选择是否和 TA 打过球');
      return;
    }
    try {
      const res = await fetch('/api/v1/ratings/' + this.ratingId + '/verify', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ vote, hasPlayed: this.hasPlayed }),
      });
      const data = await res.json();
      this.peerVotes = data.peerVotes || [];
      if (data.upgraded) {
        this.ratingResult.ratingType = 'peer_verified';
        this.ratingResult.confidence = 78;
        this.ratingResult.confidenceLabel = '中';
      }
      this.renderVotes();
      document.querySelectorAll('.pv-vote').forEach(el => {
        el.classList.toggle('selected', el.dataset.vote === vote);
        el.disabled = true;
      });
      document.getElementById('pv-post-msg').style.display = 'block';
      document.getElementById('pv-buttons').style.display = 'none';
      const label = vote === 'agree' ? '偏低' : vote === 'overrated' ? '差不多' : '偏高';
      this.toast('已提交：' + label);
    } catch(e) {}
  },

  renderVotes() {
    const list = document.getElementById('pv-list');
    if (this.peerVotes.length === 0) {
      list.innerHTML = '<div style="text-align:center;font-size:13px;color:var(--t3);padding:12px 0">还没有球友认证，快来邀请吧</div>';
      return;
    }
    const labels = { agree:'偏低', overrated:'差不多', underrated:'偏高' };
    const emojis = { agree:'👍', overrated:'📈', underrated:'📉' };
    list.innerHTML = this.peerVotes.map(v =>
      '<div class="pv-item"><span>' + v.voterNickname + '</span>' +
      '<span>' + (emojis[v.vote]||'') + ' ' + (labels[v.vote]||v.vote) + '</span></div>'
    ).join('');
  },

  // ── Navigation ──
  showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById('page-' + name);
    if (page) { page.classList.add('active'); page.classList.add('fade-in'); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  goResult() { this.showPage('result'); },

  resetAll() {
    clearInterval(this._stepTimer);
    this.answers = [];
    this.currentQ = 0;
    this.hasVideo = false;
    this.hasPlayed = null;
    this.ratingId = null;
    this.ratingResult = null;
    this.ratingType = 'questionnaire_estimate';
    this.peerVotes = [];
    window.location.hash = '';
    this.showPage('home');
  },

  // ── Poster ──
  showPoster() {
    const r = this.ratingResult;
    if (!r) return;
    const typeLabels = {
      questionnaire_estimate: '问卷预估',
      video_enhanced: '视频增强',
      peer_verified: '球友认证',
      coach_verified: '教练认证',
    };
    const ntrpData = NTRP_LEVELS.find(l => l.level === r.aiEstimatedLevel);
    const shortDesc = ntrpData ? ntrpData.shortDescription : '';

    document.getElementById('poster-card').innerHTML =
      '<div class="ps-top"><div class="ps-brand">TennisLV</div>' +
      '<div class="ps-cn">业余网球评级</div>' +
      '<div class="ps-type-badge">' + (typeLabels[r.ratingType] || '问卷预估') + '</div></div>' +
      '<div class="ps-level-area"><div class="ps-level">' + r.aiEstimatedLevel + '</div>' +
      '<div class="ps-level-name">' + r.levelName + '</div>' +
      '<div class="ps-ntrp-label">NTRP 风格等级</div>' +
      '<div class="ps-range">适合约球范围：' + r.suitableRange + '</div></div>' +
      '<div class="ps-tags">' + r.styleTags.map(t => '<span class="ps-tag">' + t + '</span>').join('') + '</div>' +
      '<div class="ps-persona">' + shortDesc + '</div>' +
      '<div class="ps-divider"></div>' +
      '<div class="ps-dims">' + r.dimensions.map(d =>
        '<div><div class="ps-dim"><span class="ps-dim-label">' + d.label + '</span><span class="ps-dim-score">' + d.score + '/100</span></div>' +
        '<div class="ps-dim-bar"><div class="ps-dim-bar-fill" style="width:' + d.score + '%"></div></div></div>'
      ).join('') + '</div>' +
      '<div class="ps-footer"><div class="ps-cta">你也来测测：你是几级网球选手？</div>' +
      '<div class="ps-url">tennislv.app</div>' +
      '<div class="ps-qr-area"><div class="ps-qr"><svg viewBox="0 0 56 56" width="48" height="48"><rect width="56" height="56" fill="#fff"/><rect x="5" y="5" width="18" height="18" rx="2" fill="#333"/><rect x="8" y="8" width="12" height="12" rx="1" fill="#fff"/><rect x="11" y="11" width="6" height="6" fill="#333"/><rect x="33" y="5" width="18" height="18" rx="2" fill="#333"/><rect x="36" y="8" width="12" height="12" rx="1" fill="#fff"/><rect x="39" y="11" width="6" height="6" fill="#333"/><rect x="5" y="33" width="18" height="18" rx="2" fill="#333"/><rect x="8" y="36" width="12" height="12" rx="1" fill="#fff"/><rect x="11" y="39" width="6" height="6" fill="#333"/><circle cx="28" cy="28" r="3" fill="#333"/></svg></div>' +
      '<span class="ps-qr-hint">扫码生成你的业余网球评级卡</span></div></div>' +
      '<div class="ps-disclaimer">本评级参考 NTRP 能力描述生成，<br>不等同于 USTA 官方 NTRP、UTR 或赛事评级。</div>';
    this.showPage('poster');
  },

  closePoster() {
    this.showPage('share');
  },

  toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
`;

H = `<!DOCTYPE html><html lang="zh-CN"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>TennisLV 业余网球评级 — NTRP 风格等级</title>
<style>${C}</style></head><body>

<div id="app">
  ${P_Home()} ${P_Questionnaire()} ${P_Video()} ${P_Analyzing()} ${P_Result()} ${P_ShareCard()} ${P_PeerVerify()} ${P_Poster()}
  ${E_Toast()}
</div>

<script>${JS}</script></body></html>`;
