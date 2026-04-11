import React, { useState } from 'react';
import { reviewCode, fixCode, analyzeAlgorithm } from '../services/api';
import { useWorkspace } from '../context/WorkspaceContext';
import { ShieldCheck, Circle, Check, Bot, Copy, Wrench, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ReviewPanel() {
  const { sourceCode, sourceLang, reviewFindings, setReviewFindings, setSourceCode } = useWorkspace();
  const [activeTab, setActiveTab] = useState('Bugs');
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [fixedCode, setFixedCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const TABS = [
    { id: 'Bugs', label: 'Bugs / Logic', color: '#ff4d4d' },
    { id: 'Security', label: 'Security', color: '#ff8c00' },
    { id: 'Performance', label: 'Performance', color: '#ffcc00' },
    { id: 'Style', label: 'Code Style', color: '#58a6ff' },
    { id: 'Best Practices', label: 'Best Practices', color: '#00ffaa' }
  ];

  const handleRunReview = async () => {
    if (!sourceCode) return;
    setLoading(true);
    setError(null);
    setFixedCode(null);
    try {
      const response = await reviewCode(sourceCode, sourceLang);
      setReviewFindings(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch review from AI Engine.');
    } finally {
      setLoading(false);
    }
  };

  const handleFixAll = async () => {
    if (!sourceCode || !reviewFindings) return;
    setFixing(true);
    setError(null);
    try {
      const findings = reviewFindings.findings || [];
      const summary = findings.map((f, i) => 
        `${i+1}. [${f.severity}] ${f.category} — ${f.title}: ${f.description}`
      ).join('\n');
      const response = await fixCode(sourceCode, sourceLang, summary);
      setFixedCode(response.data.fixed_code);
    } catch (err) {
      console.error(err);
      setError('AI Fix failed. Try again.');
    } finally {
      setFixing(false);
    }
  };

  const handleApplyFix = () => {
    if (fixedCode) {
      let clean = fixedCode.trim();
      const fenceMatch = clean.match(/^```[\w]*\n?([\s\S]*?)```$/);
      if (fenceMatch) clean = fenceMatch[1].trim();
      setSourceCode(clean);
      setFixedCode(null);
      setReviewFindings(null);
    }
  };

  const handleCopy = () => {
    if (fixedCode) {
      let clean = fixedCode.trim();
      const fenceMatch = clean.match(/^```[\w]*\n?([\s\S]*?)```$/);
      if (fenceMatch) clean = fenceMatch[1].trim();
      navigator.clipboard.writeText(clean);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRunAnalysis = async () => {
    if (!sourceCode) return;
    setAnalysisLoading(true);
    try {
      const response = await analyzeAlgorithm(sourceCode, sourceLang);
      setAnalysisResult(response.data.analysis);
    } catch (err) {
      console.error(err);
      setAnalysisResult('❌ Failed to generate algorithm analysis.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const calculateDashOffset = (score) => {
    const circumference = 2 * Math.PI * 38;
    return circumference - (score / 100) * circumference;
  };

  // Empty state — no review yet
  if (!reviewFindings) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card empty-state fade-in-up" style={{ padding: '60px', textAlign: 'center' }}>
          <ShieldCheck size={48} style={{ opacity: 0.3, marginBottom: '16px', color: 'var(--text-muted)', margin: '0 auto' }} />
          <h2 style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '8px' }}>AI Code Review & Analysis</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 24px auto' }}>
            Deep-inspect your code for bugs, security issues, and performance bottlenecks. Then analyze the algorithm complexity.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={handleRunReview} disabled={!sourceCode || loading}>
              {loading ? (
                <span className="btn-loading-text"><span className="spinner" /> Analyzing Codebase...</span>
              ) : (
                <>🔍 Run Code Review</>
              )}
            </button>
            <button 
              className="btn-primary" 
              onClick={handleRunAnalysis} 
              disabled={!sourceCode || analysisLoading}
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
            >
              {analysisLoading ? (
                <span className="btn-loading-text"><span className="spinner" /> Analyzing Algorithm...</span>
              ) : (
                <>📊 Run Algorithm Analysis</>
              )}
            </button>
          </div>
          {error && <p style={{ color: '#ff4d4d', marginTop: '12px', fontSize: '12px' }}>{error}</p>}
        </div>

        {analysisResult && (
          <AlgorithmAnalysisCard analysis={analysisResult} onRerun={handleRunAnalysis} loading={analysisLoading} />
        )}
      </div>
    );
  }

  const allFindings = reviewFindings?.findings || [];
  const activeFindings = allFindings.filter(f => f.category === activeTab);

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'CRITICAL': return { bg: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', border: '1px solid #ff4d4d' };
      case 'HIGH': return { bg: 'rgba(255, 140, 0, 0.1)', color: '#ff8c00', border: '1px solid #ff8c00' };
      case 'MEDIUM': return { bg: 'rgba(255, 204, 0, 0.1)', color: '#ffcc00', border: '1px solid #ffcc00' };
      case 'LOW': return { bg: 'rgba(88, 166, 255, 0.1)', color: '#58a6ff', border: '1px solid #58a6ff' };
      default: return { bg: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #333' };
    }
  };

  return (
    <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Header */}
      <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative', width: '90px', height: '90px' }}>
            <svg transform="rotate(-90)" width="90" height="90">
              <circle cx="45" cy="45" r="38" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
              <circle 
                cx="45" cy="45" r="38" 
                stroke={reviewFindings.score > 80 ? 'var(--green)' : reviewFindings.score > 50 ? '#ff8c00' : '#ff4d4d'} 
                strokeWidth="8" fill="none" 
                strokeDasharray={2 * Math.PI * 38} 
                strokeDashoffset={calculateDashOffset(reviewFindings.score)} 
                style={{ transition: 'stroke-dashoffset 1s ease-out' }} 
                strokeLinecap="round" 
              />
            </svg>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '24px', fontWeight: '800', lineHeight: '1' }}>{reviewFindings.score}</span>
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>Code Review Score</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Based on {allFindings.length} findings across your code.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={handleRunReview} disabled={loading} style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
            <RotateCw size={14} style={{ marginRight: '6px' }}/> Re-Run Review
          </button>
          <button 
            className="btn-primary" onClick={handleFixAll} 
            disabled={fixing || allFindings.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', padding: '10px 20px', fontSize: '13px', fontWeight: '700' }}
          >
            {fixing ? <span className="btn-loading-text"><span className="spinner" /> Fixing...</span> : <><Wrench size={16} /> Fix All Issues</>}
          </button>
        </div>
      </div>

      {/* Fixed Code Output */}
      {fixedCode && (
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))', borderBottom: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={16} /> AI Fixed Code — All Issues Resolved
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleCopy} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: copied ? 'var(--green)' : 'var(--text-secondary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
              <button onClick={handleApplyFix} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} /> Apply to Editor
              </button>
            </div>
          </div>
          <pre style={{ padding: '20px', margin: 0, fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", color: '#e2e8f0', lineHeight: '1.7', overflowX: 'auto', background: 'rgba(0,0,0,0.3)', maxHeight: '500px', overflowY: 'auto' }}>
            {(() => { let c = fixedCode.trim(); const m = c.match(/^```[\w]*\n?([\s\S]*?)```$/); if (m) c = m[1].trim(); return c; })()}
          </pre>
        </div>
      )}

      {error && <div style={{ color: '#ff4d4d', fontSize: '13px', textAlign: 'center' }}>{error}</div>}

      {/* Tabs */}
      <div className="card" style={{ padding: '0', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto', padding: '0 12px' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding: '16px 20px', background: 'transparent', border: 'none', borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent', color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease' }}
            >
              <Circle size={10} fill={tab.color} color={tab.color} />
              {tab.label}
              <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px', fontSize: '10px' }}>
                {allFindings.filter(f => f.category === tab.id).length}
              </span>
            </button>
          ))}
        </div>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          {activeFindings.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Check size={32} style={{ marginBottom: '16px', opacity: 0.5, margin: '0 auto' }} />
              <p>Great job! No findings in this category.</p>
            </div>
          ) : (
            activeFindings.map((finding, idx) => {
              const sev = getSeverityStyle(finding.severity);
              return (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ ...sev, fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.05em' }}>{finding.severity}</span>
                      <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '600' }}>{finding.title}</h4>
                    </div>
                    {finding.lines && finding.lines.length > 0 && finding.lines[0] !== 0 && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '4px 8px', borderRadius: '4px' }}>Line {finding.lines.join(', ')}</span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{finding.description}</p>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Algorithm Analysis — bottom of the page */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: analysisResult ? '20px' : '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity size={20} color="#10b981" />
            <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '16px' }}>Algorithm Analysis</span>
          </div>
          <button className="btn-primary" onClick={handleRunAnalysis} disabled={analysisLoading || !sourceCode}
            style={{ padding: '8px 18px', fontSize: '12px', background: analysisResult ? 'var(--bg-elevated)' : 'linear-gradient(135deg, #10b981, #059669)', color: analysisResult ? 'var(--text-primary)' : '#fff', border: analysisResult ? '1px solid var(--border)' : 'none' }}
          >
            {analysisLoading ? <span className="btn-loading-text"><span className="spinner" /> Analyzing...</span> : analysisResult ? '↻ Re-Analyze' : '📊 Run Analysis'}
          </button>
        </div>
        {analysisResult && (
          <div className="result-body" style={{ fontSize: '14px', lineHeight: '1.7' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div style={{ borderRadius: '8px', overflow: 'hidden', margin: '12px 0' }}>
                      <SyntaxHighlighter children={String(children).replace(/\n$/, '')} style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ margin: 0, padding: '16px', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace' }} {...props} />
                    </div>
                  ) : (
                    <code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }} {...props}>{children}</code>
                  );
                },
              }}
            >
              {analysisResult}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

function AlgorithmAnalysisCard({ analysis, onRerun, loading }) {
  return (
    <div className="card fade-in-up" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Activity size={20} color="#10b981" />
          <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '16px' }}>Algorithm Analysis</span>
        </div>
        <button className="btn-primary" onClick={onRerun} disabled={loading} style={{ padding: '8px 18px', fontSize: '12px', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
          {loading ? <span className="btn-loading-text"><span className="spinner" /> Analyzing...</span> : '↻ Re-Analyze'}
        </button>
      </div>
      <div className="result-body" style={{ fontSize: '14px', lineHeight: '1.7' }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
      </div>
    </div>
  );
}

const RotateCw = ({ size, style }) => (
  <svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);
