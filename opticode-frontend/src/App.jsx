import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';
import ASTViewer from './components/ASTViewer';
import OrchestratorPanel from './components/OrchestratorPanel';

function App() {
  // Global State Management (apiKey removed)
  const [sourceCode, setSourceCode] = useState('');
  const [sourceLang, setSourceLang] = useState('cpp');
  
  const [astData, setAstData] = useState(null);
  const [optimizedResult, setOptimizedResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      
      {/* 1. Sidebar Component */}
      <Sidebar />

      {/* 2. Main Workspace */}
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#f8f9fa' }}>
        <h1 style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
          Advanced Polyglot Logic Transpiler
        </h1>

        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          {/* Left Column: Code Input */}
          <div style={{ flex: 1 }}>
            <CodeEditor 
              sourceCode={sourceCode} 
              setSourceCode={setSourceCode}
              sourceLang={sourceLang}
              setSourceLang={setSourceLang}
            />
          </div>

          {/* Right Column: AST Visualizer */}
          <div style={{ flex: 1 }}>
            <ASTViewer astData={astData} />
          </div>
        </div>

        {/* Bottom Section: AI Orchestrator */}
        <div style={{ marginTop: '40px' }}>
          <OrchestratorPanel 
            sourceCode={sourceCode}
            sourceLang={sourceLang}
            setAstData={setAstData}
            optimizedResult={optimizedResult}
            setOptimizedResult={setOptimizedResult}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;