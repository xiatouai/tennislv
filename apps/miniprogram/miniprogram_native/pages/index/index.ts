import type { StrokeType } from '@tennis/shared';

Page({
  data: {
    strokeType: 'forehand' as StrokeType,
    strokeOptions: [
      { value: 'forehand', label: '正手' },
      { value: 'backhand', label: '反手' },
      { value: 'serve', label: '发球' },
    ],
  },

  onStrokeTypeChange(e: { detail: { value: StrokeType } }) {
    this.setData({ strokeType: e.detail.value });
  },

  onStartUpload() {
    const { strokeType } = this.data;
    wx.navigateTo({
      url: `/pages/upload/upload?strokeType=${strokeType}`,
    });
  },
});
