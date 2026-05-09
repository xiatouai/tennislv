import { useApp } from '../store';

export function Video() {
  const { state, uploadVideo, submitRating, videoEnhance } = useApp();

  return (
    <div className="page fade-in">
      <div className="page-title" style={{ textAlign: 'center' }}>上传视频增强评级</div>
      <div className="helper-text" style={{ textAlign: 'center', marginTop: 6 }}>
        上传视频后，可进行视频增强评级，系统会参考动作稳定性、击球节奏和移动表现。
      </div>

      {!state.hasVideo ? (
        <div className="v-zone" onClick={uploadVideo}>
          <span className="v-icon">📹</span>
          <span className="v-text">点击上传视频</span>
          <span style={{ display: 'block', fontSize: 12, color: 'var(--t4)', marginTop: 4 }}>支持 MP4 / MOV，最长 30 秒</span>
        </div>
      ) : (
        <>
          <div className="v-status-ok">✓ 视频上传完成</div>
          <div className="v-enhance-box">
            <div className="v-enhance-title">视频已上传</div>
            <div className="v-enhance-sub">
              当前内测阶段，视频增强评级为演示功能，正式版将基于视频抽帧和模型分析生成。
            </div>
            <button className="btn btn-primary" onClick={videoEnhance}>
              上传视频增强评级
            </button>
          </div>
        </>
      )}

      <div className="section-title">视频要求</div>
      <div className="card" style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.8 }}>
        · 格式：MP4 或 MOV，时长 5-30 秒，大小不超过 100MB<br />
        · 保证全身入镜，动作清晰可见<br />
        · 侧面拍摄效果最佳<br />
        · 选择光线充足的环境<br />
        · 单人拍摄，避免多人同框
      </div>

      <div style={{ marginTop: 16 }}>
        <button className="btn btn-primary" onClick={submitRating}>
          先看问卷评级
        </button>
      </div>

      {!state.hasVideo && (
        <div className="v-skip" onClick={submitRating}>
          先看问卷评级 →
        </div>
      )}

      <div className="home-footer" style={{ marginTop: 16 }}>
        本评级参考 NTRP 能力描述生成，不等同于 USTA 官方 NTRP、UTR 或赛事评级。
      </div>
    </div>
  );
}
