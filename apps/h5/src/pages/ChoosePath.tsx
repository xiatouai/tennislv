import { useApp } from '../store';

export function ChoosePath() {
  const { submitRating, goTo } = useApp();

  return (
    <div className="page page-safe fade-in">
      <div className="page-title" style={{ textAlign: 'center', marginBottom: 4 }}>选择评级方式</div>
      <div className="helper-text" style={{ textAlign: 'center', marginBottom: 24 }}>
        问卷已完成，选择一种方式生成你的业余网球评级
      </div>

      <button className="btn btn-primary" style={{ marginBottom: 12 }} onClick={() => submitRating()}>
        查看问卷预估评级
      </button>

      <button className="btn btn-outline" onClick={() => goTo('video')}>
        上传视频增强评级
      </button>

      <div className="helper-text" style={{ textAlign: 'center', marginTop: 16 }}>
        上传视频可获得更准确的评级，正式版将基于视频分析生成。
      </div>
    </div>
  );
}
