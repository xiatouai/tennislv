import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { mockRatingResult } from '@tennis/shared';
import type { RatingAnswer, RatingResult, RatingType, PeerVerification, PeerVote } from '@tennis/shared';

export interface AppState {
  ratingType: RatingType;
  answers: RatingAnswer[];
  currentQ: number;
  hasVideo: boolean;
  hasPlayed: boolean | null;
  ratingId: string | null;
  ratingResult: RatingResult | null;
  peerVotes: PeerVerification[];
  toastMessage: string;
}

interface AppContextValue {
  state: AppState;
  page: Page;
  startRating: () => void;
  setAnswer: (qid: string, value: string) => void;
  nextQ: () => void;
  prevQ: () => void;
  uploadVideo: () => void;
  submitRating: () => void;
  videoEnhance: () => void;
  goTo: (page: Page) => void;
  setHasPlayed: (val: boolean) => void;
  castVote: (vote: PeerVote) => void;
  toast: (msg: string) => void;
  resetAll: () => void;
}

export type Page = 'home' | 'questionnaire' | 'choose' | 'video' | 'analyzing' | 'result' | 'share' | 'verify' | 'poster' | 'feedback' | 'standard' | 'privacy' | 'terms' | 'disclaimer';

const genId = () => Math.random().toString(36).slice(2, 10);

const initialState: AppState = {
  ratingType: 'questionnaire_estimate',
  answers: [],
  currentQ: 0,
  hasVideo: false,
  hasPlayed: null,
  ratingId: null,
  ratingResult: null,
  peerVotes: [],
  toastMessage: '',
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [page, setPage] = useState<Page>('home');

  const goTo = useCallback((p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toast = useCallback((msg: string) => {
    setState(s => ({ ...s, toastMessage: msg }));
    setTimeout(() => setState(s => ({ ...s, toastMessage: '' })), 2000);
  }, []);

  const startRating = useCallback(() => {
    setState(s => ({ ...s, answers: [], currentQ: 0, hasVideo: false, ratingType: 'questionnaire_estimate', ratingId: null, ratingResult: null, peerVotes: [], hasPlayed: null }));
    goTo('questionnaire');
  }, [goTo]);

  const setAnswer = useCallback((qid: string, value: string) => {
    setState(s => {
      const idx = s.answers.findIndex(a => a.questionId === qid);
      const newAnswers = idx >= 0
        ? s.answers.map((a, i) => i === idx ? { ...a, value } : a)
        : [...s.answers, { questionId: qid, value }];
      return { ...s, answers: newAnswers };
    });
  }, []);

  const nextQ = useCallback(() => {
    setState(s => ({ ...s, currentQ: s.currentQ + 1 }));
  }, []);

  const prevQ = useCallback(() => {
    setState(s => ({ ...s, currentQ: Math.max(0, s.currentQ - 1) }));
  }, []);

  const uploadVideo = useCallback(() => {
    setState(s => ({ ...s, hasVideo: true }));
  }, []);

  const submitRating = useCallback(() => {
    goTo('analyzing');
    const rid = genId();
    setState(s => {
      const result = mockRatingResult(s.answers, 'questionnaire_estimate');
      return { ...s, ratingId: rid, ratingResult: result, ratingType: 'questionnaire_estimate', peerVotes: [] };
    });

    // Simulate analysis delay
    setTimeout(() => {
      goTo('result');
    }, 2000);
  }, [goTo]);

  const videoEnhance = useCallback(() => {
    goTo('analyzing');
    const rid = genId();
    setState(s => {
      const result = mockRatingResult(s.answers, 'video_enhanced');
      return { ...s, ratingId: rid, ratingResult: result, ratingType: 'video_enhanced', peerVotes: [] };
    });

    setTimeout(() => {
      goTo('result');
    }, 2800);
  }, [goTo]);

  const setHasPlayed = useCallback((val: boolean) => {
    setState(s => ({ ...s, hasPlayed: val }));
  }, []);

  const castVote = useCallback((vote: PeerVote) => {
    setState(s => {
      const voter = `球友${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
      const newVote: PeerVerification = {
        id: genId(),
        ratingId: s.ratingId || '',
        voterNickname: voter,
        vote,
        comment: '',
        createdAt: new Date().toISOString(),
      };
      const peerVotes = [...s.peerVotes, newVote];

      // Upgrade to peer_verified after 2 votes
      let { ratingResult } = s;
      if (peerVotes.length >= 2 && ratingResult && ratingResult.ratingType === 'questionnaire_estimate') {
        ratingResult = { ...ratingResult, ratingType: 'peer_verified', confidence: 78, confidenceLabel: '中' };
      }

      return { ...s, peerVotes, ratingResult };
    });
  }, []);

  const resetAll = useCallback(() => {
    setState(initialState);
    goTo('home');
  }, [goTo]);

  return (
    <AppContext.Provider value={{
      state, page, startRating, setAnswer, nextQ, prevQ, uploadVideo,
      submitRating, videoEnhance, goTo, setHasPlayed, castVote, toast, resetAll,
    }}>
      {children}
      {state.toastMessage && <div className={`toast ${state.toastMessage ? 'show' : ''}`}>{state.toastMessage}</div>}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
