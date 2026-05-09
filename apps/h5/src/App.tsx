import { AppProvider, useApp } from './store';
import { Home } from './pages/Home';
import { Questionnaire } from './pages/Questionnaire';
import { ChoosePath } from './pages/ChoosePath';
import { Video } from './pages/Video';
import { Analyzing } from './pages/Analyzing';
import { Result } from './pages/Result';
import { ShareCard } from './pages/ShareCard';
import { PeerVerify } from './pages/PeerVerify';
import { Poster } from './pages/Poster';
import { Feedback } from './pages/Feedback';
import { Standard } from './pages/Standard';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Disclaimer } from './pages/Disclaimer';

function PageRouter() {
  const { page } = useApp();
  switch (page) {
    case 'home': return <Home />;
    case 'questionnaire': return <Questionnaire />;
    case 'choose': return <ChoosePath />;
    case 'video': return <Video />;
    case 'analyzing': return <Analyzing />;
    case 'result': return <Result />;
    case 'share': return <ShareCard />;
    case 'verify': return <PeerVerify />;
    case 'poster': return <Poster />;
    case 'feedback': return <Feedback />;
    case 'standard': return <Standard />;
    case 'privacy': return <Privacy />;
    case 'terms': return <Terms />;
    case 'disclaimer': return <Disclaimer />;
    default: return <Home />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <PageRouter />
    </AppProvider>
  );
}
