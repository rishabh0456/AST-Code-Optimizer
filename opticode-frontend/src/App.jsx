import React, { useState } from 'react';
import './index.css';
import LandingPage from './pages/LandingPage';
import Workspace from './pages/Workspace';
import { WorkspaceProvider } from './context/WorkspaceContext';

function App() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <WorkspaceProvider>
      <div className="app-shell">
        {/* Dynamic Animated Background Layers */}
        <div className="ui-background">
          <div className="gradient-blob blob-1"></div>
          <div className="gradient-blob blob-2"></div>
          <div className="gradient-blob blob-3"></div>
        </div>

        <div className={`app-view ${hasEntered ? 'show-workspace' : 'show-landing'}`}>
          {!hasEntered ? (
            <LandingPage onStart={() => setHasEntered(true)} />
          ) : (
            <Workspace />
          )}
        </div>
      </div>
    </WorkspaceProvider>
  );
}

export default App;