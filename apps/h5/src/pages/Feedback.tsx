import { useEffect } from 'react';

const FEEDBACK_FORM_URL = 'https://wj.qq.com/s2/26606149/5bb4/';

export function Feedback() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = FEEDBACK_FORM_URL;
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page page-safe fade-in" style={{ textAlign: 'center', paddingTop: 60 }}>
      <div className="page-title" style={{ marginBottom: 8 }}>正在前往内测反馈问卷</div>
      <div className="helper-text" style={{ marginBottom: 24 }}>
        如果没有自动跳转，请点击下方按钮
      </div>
      <a href={FEEDBACK_FORM_URL} style={{ textDecoration: 'none' }}>
        <button className="btn btn-primary">
          填写内测反馈
        </button>
      </a>
    </div>
  );
}
