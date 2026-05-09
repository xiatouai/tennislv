import type { User } from '@tennis/shared';

App({
  globalData: {
    user: null as User | null,
    apiBaseUrl: 'http://localhost:3000/api/v1',
  },

  onLaunch() {
    console.log('[AI网球教练] App launched');
    // TODO: WeChat OAuth login
  },
});
