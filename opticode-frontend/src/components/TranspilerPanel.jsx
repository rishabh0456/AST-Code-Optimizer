import React, { useState } from 'react';
import { transpileCode as transpileAPI } from '../services/api';
import { useWorkspace } from '../context/WorkspaceContext';
import { ArrowRightLeft, Code, CheckCircle, ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'csharp', name: 'C#' },
  { id: 'php', name: 'PHP' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'kotlin', name: 'Kotlin' },
  { id: 'swift', name: 'Swift' }
];

export default function TranspilerPanel() {
  const { sourceCode, setSourceCode, sourceLang, setSourceLang, transpiledCode, setTranspiledCode } = useWorkspace();
  const [targetLang, setTargetLang] = useState('python');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTranspile = async () => {
    if (!sourceCode) return;
    setLoading(true);
    setError(null);
    try {
      const response = await transpileAPI({
        sourceCode: sourceCode,
        sourceLang: sourceLang,
        targetLang: targetLang,
        customInstructions: "Strictly transpile to the target language preserving all logic. Return ONLY pure code. DO NOT include any comments whatsoever (no single-line, multi-line, or docstrings)."
      });
      let rawCode = response.data.optimized_result || "";
      // Strip markdown fences for clean code display in the transpiler
      if (rawCode.includes("```")) {
        const matches = rawCode.match(/```[a-z]*\n([\s\S]*?)```/i);
        if (matches && matches[1]) {
            rawCode = matches[1].trim();
        }
      }
      setTranspiledCode(rawCode);
    } catch (err) {
      console.error(err);
      setError('Transpilation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Controls Bar */}
      <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
          
          <div style={{ flex: 1 }}>
            <label className="field-label" style={{ marginBottom: '8px' }}>Source Language</label>
            <div style={{ position: 'relative' }}>
              <select className="text-input" value={sourceLang} onChange={e => setSourceLang(e.target.value)} style={{ paddingRight: '32px', appearance: 'none' }}>
                {LANGUAGES.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '10px', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '4px' }}>
            <button className="btn-primary" onClick={handleTranspile} disabled={!sourceCode || loading} style={{ borderRadius: '50%', padding: '12px', width: '48px', height: '48px' }}>
              {loading ? <span className="spinner" /> : <ArrowRightLeft size={20} />}
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <label className="field-label" style={{ marginBottom: '8px' }}>Target Language</label>
            <div style={{ position: 'relative' }}>
              <select className="text-input" value={targetLang} onChange={e => setTargetLang(e.target.value)} style={{ paddingRight: '32px', appearance: 'none' }}>
                {LANGUAGES.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '10px', pointerEvents: 'none', color: 'var(--text-secondary)' }} />
            </div>
          </div>

        </div>
      </div>

      {error && <div style={{ color: '#ff4d4d', fontSize: '13px', textAlign: 'center' }}>{error}</div>}

      {/* Editor Comparison Area */}
      <div className="two-col" style={{ minHeight: '500px' }}>
        
        {/* Source Box */}
        <div className="card">
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={14} /> Source ({LANGUAGES.find(l => l.id === sourceLang)?.name || sourceLang})
            </span>
          </div>
          <textarea 
            className="code-textarea" 
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            placeholder="Type or paste source code here..."
            style={{ fontSize: '14px' }}
          />
        </div>

        {/* Target Box */}
        <div className="card" style={{ borderColor: transpiledCode ? 'rgba(88, 166, 255, 0.4)' : 'var(--border)' }}>
          <div className="card-header" style={{ borderBottomColor: transpiledCode ? 'rgba(88, 166, 255, 0.2)' : 'var(--border)' }}>
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: transpiledCode ? '#58a6ff' : 'var(--text-secondary)' }}>
              {transpiledCode ? <CheckCircle size={14} /> : <Code size={14} />} Transpiled ({LANGUAGES.find(l => l.id === targetLang)?.name || targetLang})
            </span>
            {transpiledCode && (
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(transpiledCode);
                  // Optional: Show brief visual feedback if desired
                }}
                title="Copy to clipboard"
                style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '4px 10px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.target.style.background = 'var(--bg-hover)'}
                onMouseOut={(e) => e.target.style.background = 'transparent'}
              >
                Copy Code
              </button>
            )}
          </div>
          <div className="card-body" style={{ background: 'rgba(5, 5, 5, 0.3)' }}>
            {!transpiledCode ? (
              <div className="ast-empty" style={{ minHeight: '100%' }}>
                <ArrowRightLeft size={32} className="ast-empty-icon" />
                <span className="ast-empty-text">Select target language and transpile</span>
              </div>
            ) : (
              <textarea 
                className="code-textarea" 
                value={transpiledCode}
                readOnly
                style={{ fontSize: '14px', color: '#79c0ff' }}
               />
            )}
          </div>
          {transpiledCode && (
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(88, 166, 255, 0.2)', display: 'flex', justifyContent: 'center' }}>
              <button style={{ color: '#58a6ff', fontSize: '12px', background: 'rgba(88,166,255,0.1)', border: 'none', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>
                Verify Transpilation Identity via AI
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
