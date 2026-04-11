import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CodeEditor from '../components/CodeEditor';
import LogicFlowPanel from '../components/LogicFlowPanel';
import ReviewPanel from '../components/ReviewPanel';
import TranspilerPanel from '../components/TranspilerPanel';
import { Settings } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

export default function Workspace() {
  const {
    sourceCode, setSourceCode,
    sourceLang, setSourceLang,
  } = useWorkspace();
  
  const [activeTab, setActiveTab] = useState('editor');

  const renderContent = () => {
    switch (activeTab) {
      case 'ast':
        return <LogicFlowPanel />;
      case 'transpiler': 
        return <TranspilerPanel />;
      case 'settings':
        return (
          <div className="card fade-in-up" style={{ padding: '32px' }}>
            <div className="card-header" style={{ marginBottom: '24px', padding: 0, border: 'none' }}>
              <span className="card-title">Workspace Settings</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
              <div>
                <label className="field-label">API Key Configuration</label>
                <input type="password" placeholder="••••••••••••••••" className="text-input" disabled />
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>Gemini key is currently managed via backend environment.</p>
              </div>
            </div>
          </div>
        );

      case 'editor':
      default:
        return (
          <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Code Editor */}
            <CodeEditor
              sourceCode={sourceCode}
              setSourceCode={setSourceCode}
              sourceLang={sourceLang}
              setSourceLang={setSourceLang}
            />
            {/* Code Review AI — inline, same page */}
            <ReviewPanel />
          </div>
        );
    }
  };

  const getPageContext = () => {
    switch(activeTab) {
      case 'editor': return { title: 'Code Workspace', desc: 'Write, review, and fix your code.' };
      case 'ast': return { title: 'Logic Flow', desc: 'Visualize your code structure.' };
      case 'transpiler': return { title: 'Refactor / Transpile', desc: 'Convert code across languages.' };
      case 'settings': return { title: 'Settings', desc: 'Configure workspace.' };
      default: return { title: 'OptiCode', desc: '' };
    }
  }

  return (
    <>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="workspace fade-in-up">
        {/* Top Header */}
        <header className="topbar glass-nav">
          <div className="topbar-breadcrumb">
            <span>OptiCode</span><span>/</span><strong>{getPageContext().title}</strong>
          </div>
          <div className="topbar-right">
            <div className="status-badge glow-pulse">
              <span>●</span> API Secured
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="content">
          <div className="page-header">
            <h1 className="page-title text-gradient">{getPageContext().title}</h1>
            <p className="page-subtitle">{getPageContext().desc}</p>
          </div>
          {renderContent()}
        </main>
      </div>
    </>
  );
}
