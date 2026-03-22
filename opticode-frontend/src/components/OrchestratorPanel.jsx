import React, { useState } from 'react';
import { parseCode, transpileCode } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function OrchestratorPanel({ 
  sourceCode, sourceLang, apiKey, setAstData, 
  optimizedResult, setOptimizedResult, isLoading, setIsLoading 
}) {
  const [targetLang, setTargetLang] = useState('python');
  const [customInstructions, setCustomInstructions] = useState('');

  const handleOptimize = async () => {
    if (!sourceCode) return alert("Execution Error: Please paste source code before optimizing.");
    
    setIsLoading(true);
    setOptimizedResult(''); 
    setAstData(null); 

    try {
      const parseRes = await parseCode(sourceCode, sourceLang);
      setAstData(parseRes.data.ast_data);

      const payload = {
        sourceCode,
        sourceLang,
        targetLang,
        customInstructions,
        apiKey
      };
      
      const aiRes = await transpileCode(payload);
      setOptimizedResult(aiRes.data.optimized_result);

    } catch (error) {
      console.error("Orchestrator Failure:", error);
      alert("Pipeline Error: " + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>🤖 Dynamic Optimization & Transpilation</h3>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Target Language:</label>
          <select 
            value={targetLang} 
            onChange={(e) => setTargetLang(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
        
        <div style={{ flex: 2 }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Custom Instructions (Optional):</label>
          <input 
            type="text" 
            value={customInstructions} 
            onChange={(e) => setCustomInstructions(e.target.value)} 
            placeholder="e.g., 'Optimize for O(N) time complexity'..." 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
          />
        </div>
      </div>

      <button 
        onClick={handleOptimize} 
        disabled={isLoading} 
        style={{ 
          padding: '14px 24px', 
          backgroundColor: isLoading ? '#7f8c8d' : '#27ae60', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px',
          cursor: isLoading ? 'not-allowed' : 'pointer', 
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background-color 0.3s'
        }}
      >
        {isLoading ? '⏳ Compiling Logic Tree & Refactoring...' : `✨ Optimize and Convert to ${targetLang.toUpperCase()}`}
      </button>

      {/* Upgraded Result Output Area */}
      {optimizedResult && (
        <div style={{ 
          marginTop: '25px', 
          padding: '25px', 
          backgroundColor: '#0d1117', 
          color: '#c9d1d9', 
          borderRadius: '8px',
          border: '1px solid #30363d',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
          lineHeight: '1.6',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h3: ({node, ...props}) => <h3 style={{ color: '#58a6ff', borderBottom: '1px solid #21262d', paddingBottom: '8px', marginTop: '24px' }} {...props} />,
              strong: ({node, ...props}) => <strong style={{ color: '#79c0ff', fontWeight: '600' }} {...props} />,
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <div style={{ borderRadius: '6px', overflow: 'hidden', marginTop: '12px', marginBottom: '12px' }}>
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, '')}
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ margin: 0, padding: '16px' }}
                      {...props}
                    />
                  </div>
                ) : (
                  <code style={{ backgroundColor: '#2d333b', padding: '0.2em 0.4em', borderRadius: '6px', fontSize: '85%', fontFamily: 'monospace' }} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {optimizedResult}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default OrchestratorPanel;