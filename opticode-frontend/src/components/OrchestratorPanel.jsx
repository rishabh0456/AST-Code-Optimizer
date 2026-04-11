import React, { useState } from 'react';
import { parseCode, transpileCode } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const TARGET_LANGUAGES = [
  { value: 'cpp',        label: 'C++' },
  { value: 'java',       label: 'Java' },
  { value: 'python',     label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
];

function OrchestratorPanel({
  sourceCode, sourceLang, apiKey, setAstData,
  optimizedResult, setOptimizedResult, isLoading, setIsLoading
}) {
  const [targetLang, setTargetLang]               = useState('python');
  const [customInstructions, setCustomInstructions] = useState('');

  const handleOptimize = async () => {
    if (!sourceCode) {
      alert('Please paste source code before optimizing.');
      return;
    }

    setIsLoading(true);
    setOptimizedResult('');
    setAstData(null);

    try {
      const parseRes = await parseCode(sourceCode, sourceLang);
      setAstData(parseRes.data.ast_data);

      const payload = { sourceCode, sourceLang, targetLang, customInstructions, apiKey };
      const aiRes   = await transpileCode(payload);
      setOptimizedResult(aiRes.data.optimized_result);

    } catch (error) {
      console.error('Orchestrator Failure:', error);
      alert('Pipeline Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      {/* Card Header */}
      <div className="card-header">
        <span className="card-title">AI Orchestration</span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Powered by Gemini
        </span>
      </div>

      {/* Controls Row */}
      <div className="orch-controls">
        {/* Target Language */}
        <div>
          <label className="field-label" htmlFor="target-lang-select">
            Target Language
          </label>
          <select
            id="target-lang-select"
            className="lang-select"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            style={{ width: '100%', borderRadius: '6px', padding: '8px 12px' }}
            aria-label="Target language"
          >
            {TARGET_LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* Custom Instructions */}
        <div>
          <label className="field-label" htmlFor="custom-instructions">
            Custom Instructions <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
          </label>
          <input
            id="custom-instructions"
            type="text"
            className="text-input"
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="e.g. Optimize for O(N) time complexity..."
            aria-label="Custom instructions"
          />
        </div>
      </div>

      {/* CTA Row */}
      <div className="orch-cta">
        <button
          id="optimize-btn"
          className="btn-primary"
          onClick={handleOptimize}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="btn-loading-text">
              <span className="spinner" />
              Compiling &amp; Refactoring...
            </span>
          ) : (
            <>✨ Optimize &amp; Convert to {TARGET_LANGUAGES.find(l => l.value === targetLang)?.label}</>
          )}
        </button>
      </div>

      {/* Result Output */}
      {optimizedResult && (
        <div className="result-area">
          <div className="result-header">
            <span className="result-label">Output</span>
            <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 600 }}>
              ● Complete
            </span>
          </div>
          <div className="result-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h3: ({ node, ...props }) => (
                  <h3 className="result-h3" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong {...props} />
                ),
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div style={{ borderRadius: '8px', overflow: 'hidden', margin: '12px 0' }}>
                      <SyntaxHighlighter
                        children={String(children).replace(/\n$/, '')}
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, padding: '16px', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace' }}
                        {...props}
                      />
                    </div>
                  ) : (
                    <code {...props}>{children}</code>
                  );
                },
              }}
            >
              {optimizedResult}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrchestratorPanel;